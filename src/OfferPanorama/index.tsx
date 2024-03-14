import React from 'react';
import cn from 'classnames';
import { throttle } from 'lodash';
import { InView } from 'react-intersection-observer';

import styles from './styles.module.css';

const SECOND = 1000;
const IDEAL_FPS = 60;
const VIDEO_FPS = 24;
const INITIAL_VIDEO_FRAME = 24;
const FRAME_DURATION = 1 / VIDEO_FPS; // 1/24 то есть стандартно все видео в 24фпс
const SMOOTH_TRANSITION_TIME = SECOND / 16;
const SMOOTH_TRANSITION_STEP = SMOOTH_TRANSITION_TIME / (SECOND / IDEAL_FPS);
const SPIN_WINDOW_HEIGHT_LIMITS_START = 0.95;
const SPIN_WINDOW_HEIGHT_LIMITS_END = 0.35;
const SMOOTH_PAINT_FRAME_THRESHOLD = 2;
const SPIN_DURATION_LIMIT = 0.45;

const STYLE_BLUR = {
    filter: 'blur(5px)',
};

export interface IOfferPanoramaProps {
    className?: string;
    isMobile?: boolean;
    onErrorVideoLoad?: () => any;
    children?: React.ReactNode;
    virtualTourData?: any;
    shouldSpinOnScroll?: boolean;
}

interface IState {
    hovered: boolean;
    isVideoLoaded: boolean;
    isLastFrame: boolean;
    isVisible: boolean;
}

export const getInRange = (value: number, start: number, end: number) => {
    if (value < start) {
        return start;
    }

    if (value > end) {
        return end;
    }

    return value;
};

class OfferPanorama extends React.PureComponent<IOfferPanoramaProps, IState> {
    isLoadingStarted = false;
    previousAbsoluteTime = 0;
    raf?: number;
    initialTime = 0;
    videoFrameNum: number;
    throttledHandleScroll: () => void;
    throttledHandleMouseMove: (e: React.MouseEvent) => void;
    viewPortHeight = 0;
    video: HTMLVideoElement | null = null;
    frameDuration = 0;
    videoRect?: DOMRect;

    state: IState = {
        hovered: false,
        isLastFrame: false,
        isVideoLoaded: false,
        isVisible: false,
    };

    constructor(props: IOfferPanoramaProps) {
        super(props);

        this.videoFrameNum = INITIAL_VIDEO_FRAME / 4;
        this.throttledHandleScroll = throttle(this.handelScroll, 150);
        this.throttledHandleMouseMove = throttle(this.handleMouseMove, 50, { leading: true, trailing: false });
    }

    componentDidMount() {
        this.viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

    componentWillUnmount() {
        const { shouldSpinOnScroll } = this.props;

        if (shouldSpinOnScroll) {
            window.removeEventListener('scroll', this.throttledHandleScroll);
        }
    }

    render() {
        const { children, className, isMobile, onErrorVideoLoad, virtualTourData } = this.props;
        const { isVideoLoaded } = this.state;
        const { mp4Url, webmUrl } = this.getViedoUrls();

        return (
            <InView
                className={cn(styles.container, className, {
                    [styles.isVideoLoaded]: isVideoLoaded,
                })}
                onChange={this.handleIntersectionChange}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onMouseMove={this.throttledHandleMouseMove}
                rootMargin="0px 0px 400px 0px"
            >
                 <div className={cn(styles.previewContainer, styles.fallback)} />
                <video
                    className={styles.video}
                    loop={false}
                    muted={true}
                    onCanPlayThrough={this.handleVideoLoadSuccess}
                    onError={onErrorVideoLoad}
                    onLoadedData={this.handleVideoLoadSuccess}
                    //@ts-expect-error по аналогии с автору
                    pipe={false}
                    yandex-pipe={false}
                    preload="none"
                    ref={(node) => {
                        this.video = node;
                        if (this.video) {
                            this.video.disableRemotePlayback = true;
                        }
                    }}
                    // eslint-disable-next-line react/no-unknown-property
                    x-yandex-pip="false"
                >
                    <source src={mp4Url} type="video/mp4" />
                    <source src={webmUrl} type="video/webm" />
                </video>
                {children}
            </InView>
        );
    }

    handleVideoLoadSuccess = (event: any) => {
        const { isVideoLoaded } = this.state;

        // canplaythrough может быть задиспатчен несколько раз (например при каждой смене currentTime)
        // отсекаем все вызовы после первой успешной загрузки видео
        if (isVideoLoaded) {
            return;
        }

        if (this.video && this.video.readyState === 4) {
            this.setState({ isVideoLoaded: true });
            this.videoRect = this.video.getBoundingClientRect();
        }
    };

    handleMouseMove = (event: React.MouseEvent) => {
        const { isVideoLoaded } = this.state;

        event.persist();

        if (!isVideoLoaded || event.clientX === null || !this.videoRect || !this.video) {
            return;
        }

        const nextTime = ((event.clientX - this.videoRect.left) / this.videoRect.width) * this.video.duration;

        if (Math.abs(nextTime - this.previousAbsoluteTime) >= FRAME_DURATION) {
            this.video.currentTime = nextTime;

            this.previousAbsoluteTime = nextTime;
        }
    };

    handleMouseEnter = () => {
        this.setState({ hovered: true });
    };

    handleMouseLeave = () => {
        this.setState({ hovered: false });
    };

    handelScroll = () => {
        const { isVideoLoaded } = this.state;

        if (!isVideoLoaded || !this.video) {
            return;
        }

        const relativeBottom = getInRange(
            this.video.getBoundingClientRect().bottom / this.viewPortHeight,
            SPIN_WINDOW_HEIGHT_LIMITS_END,
            SPIN_WINDOW_HEIGHT_LIMITS_START
        );

        const animationRelativeDistance = SPIN_WINDOW_HEIGHT_LIMITS_START - SPIN_WINDOW_HEIGHT_LIMITS_END;

        const nextAbsoluteTime =
            ((SPIN_WINDOW_HEIGHT_LIMITS_START - relativeBottom) / animationRelativeDistance) *
            this.video.duration *
            SPIN_DURATION_LIMIT;

        this.spinPanorama(nextAbsoluteTime);

        this.previousAbsoluteTime = nextAbsoluteTime;
    };

    handleIntersectionChange = (isInView: boolean) => {
        const { shouldSpinOnScroll } = this.props;

        this.setState({ isVisible: isInView });

        if (isInView) {
            this.startVideoLoad();

            if (shouldSpinOnScroll) {
                window.addEventListener('scroll', this.throttledHandleScroll, { passive: true });
            }
        } else {
            if (shouldSpinOnScroll) {
                window.removeEventListener('scroll', this.throttledHandleScroll);
            }
        }
    };

    spinPanorama(nextTime: number) {
        const prevTime = this.previousAbsoluteTime;
        const timeDiff = prevTime - nextTime;

        if (timeDiff === 0) {
            return;
        }

        this.raf && window.cancelAnimationFrame(this.raf);



        if (Math.abs(timeDiff) > SMOOTH_PAINT_FRAME_THRESHOLD * FRAME_DURATION) {
            console.log('smooth');
            this.raf = this.smoothPaint(prevTime, nextTime);

            return;
        }

        this.setVideoTime(nextTime);
    }

    smoothPaint(prevTime: number, nextTime: number) {
        let curTime = prevTime;
        let finishOnNextStep = true;
        const timeDiff = prevTime - nextTime;
        const step = Math.max(Math.abs(timeDiff) / SMOOTH_TRANSITION_STEP, FRAME_DURATION);

        const paintStep = () => {
            if (Math.abs(curTime - nextTime) < step) {
                if (finishOnNextStep) {
                    finishOnNextStep = false;
                } else {
                    return;
                }
            }

            if (Math.abs(curTime - nextTime) > Math.abs(timeDiff)) {
                return;
            }

            curTime = timeDiff > 0 ? curTime - step : curTime + step;

            this.setVideoTime(curTime);

            this.raf = window.requestAnimationFrame(paintStep);
        };

        return window.requestAnimationFrame(paintStep);
    }

    setVideoTime(time: number) {
        const { isMobile } = this.props;

        if (!this.video) {
            return;
        }

        const nextTime = Math.min(
            Math.max(time, this.initialTime),
            this.initialTime + this.video.duration * SPIN_DURATION_LIMIT
        );

        this.video.currentTime = nextTime;

        if (isMobile) {
            this.setState({
                isLastFrame: Math.abs(this.video.currentTime - this.video.duration) <= FRAME_DURATION,
            });
        }
    }

    startVideoLoad() {
        if (!this.isLoadingStarted && this.video) {
            this.video.load();
            this.isLoadingStarted = true;
        }
    }

    getViedoUrls() {
        return {
            mp4Url: 'https://s3.mds.yandex.net/3d-tours-preview/2764358b-32ee-47ef-9577-1244a9f558fc/desktop.mp4',
            webmUrl: 'https://s3.mds.yandex.net/3d-tours-preview/2764358b-32ee-47ef-9577-1244a9f558fc/desktop.webm',
        };
    }
}

export { OfferPanorama };
