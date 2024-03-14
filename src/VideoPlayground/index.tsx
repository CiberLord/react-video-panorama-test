import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import styles from './styles.module.css';
import { ScrollVideo } from '../ScrollVideo';

const URL = 'https://s3.mds.yandex.net/3d-tours-preview/2764358b-32ee-47ef-9577-1244a9f558fc/desktop.mp4';

export const getInRange = (value: number, start: number, end: number) => {
    if (value < start) {
        return start;
    }

    if (value > end) {
        return end;
    }

    return value;
};

const SPIN_WINDOW_HEIGHT_LIMITS_START = 0.95;
const SPIN_WINDOW_HEIGHT_LIMITS_END = 0.1;

export const VideoPlayground: React.FC<{ className?: string }> = ({ className }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMetaDataLoaded, setIsMetaDataLoaded] = useState(false);

    const handleVideoLoadSucess = useCallback(() => {
        if(videoRef.current) {
            if(videoRef.current.readyState === 4) {
                setIsLoaded(true);
            }
        }
    }, []);

    const handleMetaDataLoaded = useCallback(() => { 
        setIsMetaDataLoaded(true);
    }, []);

    useEffect(() => {
        if(videoRef.current) {
            videoRef.current.load();

            const scrollVideo = new ScrollVideo(videoRef.current);

            scrollVideo.start();

            return () => {
                scrollVideo.destroy();
            }
        }
    }, [])

    useEffect(() => {
        const video = videoRef.current;

        if(!video) {
            return;
        }

        // console.log({
        //     isLoaded,
        //     isMetaDataLoaded,
        // });

        // const isPlayReady = isLoaded && isMetaDataLoaded;

        // video.disableRemotePlayback = true;

        // if(!isPlayReady) {
        //     return;
        // }

        // const context = {
        //     seeked: true,
        //     viewPortHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        // }

        // const loop = () => {
        //     if(context.seeked) {
        //         context.seeked = false;

        //         const bottom = video.getBoundingClientRect().bottom / context.viewPortHeight;

        //         const relativeBottom = getInRange(
        //             bottom,
        //             SPIN_WINDOW_HEIGHT_LIMITS_END,
        //             SPIN_WINDOW_HEIGHT_LIMITS_START
        //         );

        //         const distance = SPIN_WINDOW_HEIGHT_LIMITS_START - SPIN_WINDOW_HEIGHT_LIMITS_END;

        //         const relativeScroll = SPIN_WINDOW_HEIGHT_LIMITS_START - relativeBottom;

        //         const nextTime = (relativeScroll / distance) * video.duration * 0.5;

        //         video.currentTime = nextTime;
        //     }

        //     window.requestAnimationFrame(loop);
        // }

        // video.addEventListener('seeked', () => {
        //     context.seeked = true;
        // });

        // console.log('start loop');

        // loop();

    }, [isLoaded, isMetaDataLoaded]);

    return (
        <div className={cn(className, styles.container)}>
            <video 
            onLoadedData={handleVideoLoadSucess} 
            onCanPlayThrough={handleVideoLoadSucess}
            onLoadedMetadata={handleMetaDataLoaded}
            ref={videoRef} 
            playsInline={true}
            preload="none"
            className={styles.video} 
            muted={true}
            loop={false}
            //@ts-expect-error по аналогии с автору
            pipe="false"
            >
              <source src={URL} type="video/mp4" />
            </video>
        </div>
    )
}