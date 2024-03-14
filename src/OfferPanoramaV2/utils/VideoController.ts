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

interface IVideoControllerConfig {
    canvas: HTMLCanvasElement
}

export class VideoController {
    public mouseHandler: IMouseHandler;

    private video: HTMLVideoElement;
    private seeked: boolean = true;
    private rafId: number = 0;
    private renderState: RenderState = RenderState.INITIAL;
    private scrollMoveHelper: ScrollMoveVideoHelper;
    private mouseMoveHelper: MouseMoveVideoHelper;
    private canvas: HTMLCanvasElement;
    private renderContext: CanvasRenderingContext2D | null;

    constructor(video: HTMLVideoElement, config: IVideoControllerConfig) {
        this.video = video;
        this.canvas = config.canvas;
        this.renderContext = this.canvas.getContext('2d');
        this.scrollMoveHelper = new ScrollMoveVideoHelper(video);
        this.mouseMoveHelper = new MouseMoveVideoHelper(video);

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
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            this.renderContext?.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
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
        if (this.mouseMoveHelper.hovered) {
            this.video.currentTime = this.mouseMoveHelper.move();

            return;
        }

        this.video.currentTime = this.scrollMoveHelper.move();

        this.renderContext?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderContext?.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    }

    private handleVideoSeeked = () => {
        this.seeked = true;
    }
}