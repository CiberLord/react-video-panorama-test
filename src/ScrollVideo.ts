

class ScrollVideo {
    private video: HTMLVideoElement;
    private seeked: boolean = true;
    private rafId?: number;
    private isVideoLoaded: boolean = false;
    private isMetaDataLoaded: boolean = false;
    private isRun: boolean = false;
    private viewport = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    private spinDurationLimit = 0.5;
    private spinHeightStart = 0.9;
    private spinHeightEnd = 0.3;
    private distance: number;

    constructor(video: HTMLVideoElement) {
        this.video = video;
        this.video.preload = "none";
        this.video.oncanplaythrough = this.handleVideoLoaded;
        this.video.onloadedmetadata = this.handleMetaDataLoaded;

        this.handleVideoSeeked.bind(this);

        this.distance = this.spinHeightStart - this.spinHeightEnd;
    }

    public start() {
        this.isRun = true;

        this.video.load();
    }

    public destroy() {
        this.pause();

        this.rafId && window.cancelAnimationFrame(this.rafId);

        this.video.removeEventListener('seeked', this.handleVideoSeeked);
    }

    public resume() {
        this.isRun = true;
    }

    public pause() {
        this.isRun = false;
    }

    private handleVideoLoaded = () => {
        if (this.video.readyState === 4) {
            this.isVideoLoaded = true;

            this.initRender();
        }
    }

    private handleMetaDataLoaded = () => {
        this.isMetaDataLoaded = true;

        this.initRender();
    }

    private initRender = () => {
        if (this.isMetaDataLoaded && this.isVideoLoaded && this.isRun) {
            this.video.addEventListener('seeked', this.handleVideoSeeked);

            this.rafId = window.requestAnimationFrame(this.render);
        }
    }

    private handleVideoSeeked = () => {
        this.seeked = true;
    }

    private render = () => {
        const isRender = this.seeked && this.isRun;

        if (isRender) {
            this.seeked = false;

            const bottom = this.video.getBoundingClientRect().bottom / this.viewport;

            const relativeBottom = this.getInRange(
                bottom,
                this.spinHeightEnd,
                this.spinHeightStart
            );

            const relativeScroll = this.spinHeightStart - relativeBottom;

            const maxDuration = this.video.duration * this.spinDurationLimit;

            const nextTime = (relativeScroll / this.distance) * maxDuration;

            this.video.currentTime = nextTime;
        }

        this.rafId = requestAnimationFrame(this.render);
    }

    private getInRange = (value: number, start: number, end: number) => {
        if (value < start) {
            return start;
        }

        if (value > end) {
            return end;
        }

        return value;
    }
}

export { ScrollVideo }