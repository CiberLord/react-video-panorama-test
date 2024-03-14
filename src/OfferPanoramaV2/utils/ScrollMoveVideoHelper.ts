export class ScrollMoveVideoHelper {
    private video: HTMLVideoElement;
    private viewport = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    private spinDurationLimit = 0.5;
    private spinHeightStart = 0.9;
    private spinHeightEnd = 0.3;
    private distance: number;

    constructor(video: HTMLVideoElement) {
        this.video = video;
        this.distance = this.spinHeightStart - this.spinHeightEnd;
    }

    public move(): number {
        const bottom = this.video.getBoundingClientRect().bottom / this.viewport;

        const relativeBottom = this.getInRange(
            bottom,
            this.spinHeightEnd,
            this.spinHeightStart
        );

        const relativeScroll = this.spinHeightStart - relativeBottom;

        const maxDuration = this.video.duration * this.spinDurationLimit;

        const nextTime = (relativeScroll / this.distance) * maxDuration;

        return nextTime;
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