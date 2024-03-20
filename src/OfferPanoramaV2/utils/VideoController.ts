import { Logger } from '../../logger';
import { MouseMoveVideoHelper } from './MouseMoveVideoHelper';
import { ScrollMoveVideoHelper } from './ScrollMoveVideoHelper';

enum RenderState {
    INITIAL,
    STARTED,
    RUNNING,
    STOPPED,
}

interface IMouseHandler {
    handleEnter: () => void;
    handleMove: (event: MouseEvent) => void;
    handleLeave: () => void;
}

interface IVideoControllerOptions {
    disableHoverEffect?: boolean;
}

const logger = Logger.getLogger(1000);

export class VideoController {
    public mouseHandler: IMouseHandler;

    private video: HTMLVideoElement;
    private seeked: boolean = true;
    private rafId: number = 0;
    private renderState: RenderState = RenderState.INITIAL;
    private scrollMoveHelper: ScrollMoveVideoHelper;
    private mouseMoveHelper: MouseMoveVideoHelper;
    private enableHover: boolean;

    constructor(video: HTMLVideoElement, options?: IVideoControllerOptions ) {
        this.video = video;
        this.scrollMoveHelper = new ScrollMoveVideoHelper(video);
        this.mouseMoveHelper = new MouseMoveVideoHelper(video);
        this.enableHover = !Boolean(options?.disableHoverEffect);
        this.mouseHandler = {
            handleEnter: this.mouseMoveHelper.handleMouseEnter,
            handleLeave: this.mouseMoveHelper.handleMouseLeave,
            handleMove: this.mouseMoveHelper.handleMouseMove
        }
    }

    public start = () => {
        if (this.renderState === RenderState.INITIAL) {
            this.video.addEventListener('canplaythrough', this.handleCanPlayThrough);
        }

        if (this.renderState === RenderState.STOPPED) {
            this.initLoop();
        }

        this.renderState = RenderState.STARTED;
    }

    public stop = () => {
        this.renderState = RenderState.STOPPED;
        this.video.removeEventListener('canplaythrough', this.handleCanPlayThrough);
        this.video.removeEventListener('seeked', this.handleVideoSeeked);

        window.cancelAnimationFrame(this.rafId);
    }

    private handleCanPlayThrough = () => {
        if (this.video.readyState === 4) {
            this.initLoop();
        }
    }

    private initLoop = () => {
        if (this.renderState !== RenderState.RUNNING) {
            this.renderState = RenderState.RUNNING;
            this.seeked = true;
            this.video.addEventListener('seeked', this.handleVideoSeeked);

            this.rafId = window.requestAnimationFrame(this.loop);
        }
    }

    private loop = () => {
        const isRender = this.seeked && this.renderState === RenderState.RUNNING;

        if (isRender) {
            this.seeked = false;
            this.render();
        }

        this.rafId = requestAnimationFrame(this.loop)
    }

    private render = () => {
        let currentTime = undefined;

        const isHover = this.mouseMoveHelper.hovered && this.enableHover;

        if (isHover) {
            currentTime = this.mouseMoveHelper.move();
        } else {
            currentTime = this.scrollMoveHelper.move();
        }

        if(typeof currentTime === 'number' && !isNaN(currentTime)) {
            this.video.currentTime = currentTime;

            // logger.log({
            //     context: 'VideoController',
            //     fn: 'render',
            //     payload: {
            //         currentTime: this.video.currentTime
            //     }
            // })
        }
    }

    private handleVideoSeeked = () => {
        this.seeked = true;
    }
}