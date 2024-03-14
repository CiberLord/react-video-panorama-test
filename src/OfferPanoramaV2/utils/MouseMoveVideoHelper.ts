/* eslint-disable no-lone-blocks */
export class MouseMoveVideoHelper {
    public hovered: boolean = false;
    private video: HTMLVideoElement;
    private currentTime = 0;

    constructor(video: HTMLVideoElement) {
        this.video = video;
        this.currentTime = video.currentTime;
    }

    public move = () => {
        if (this.hovered) {
            return this.currentTime;
        }

        return this.video.currentTime;
    }

    public handleMouseEnter = () => {
        this.hovered = true;
    }

    public handleMouseMove = (event: MouseEvent) => {
        const videoRect = this.video.getBoundingClientRect();

        this.currentTime = ((event.clientX - videoRect.left) / videoRect.width) * this.video.duration;
    }

    public handleMouseLeave = () => {
        this.hovered = false;
    }
}