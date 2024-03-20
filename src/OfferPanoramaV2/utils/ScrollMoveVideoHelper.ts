import { Logger } from "../../logger";

const logger = Logger.getLogger(1000);

const debug = {
    lastPosition: 0,
    lastInnerHeight: 0,
    lastScrollY: 0,
    relativeY: 0,
}

export class ScrollMoveVideoHelper {
    private video: HTMLVideoElement;
    // private viewport = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    private viewport = window.outerHeight;
    private spinDurationLimit = 0.5;
    private spinHeightStart = 0.97;
    private spinHeightEnd = 0.2;
    private distance: number;

    private domRect: DOMRect;

    constructor(video: HTMLVideoElement) {
        this.video = video;
        this.domRect = video.getBoundingClientRect();
        this.distance = this.spinHeightStart - this.spinHeightEnd;
    }

    public move = () => {
        const height = 659;
        const currentScroll = window.scrollY;
        const currentPosition = Math.min(1, currentScroll / height);

        let nextTime;

        if(debug.lastPosition > currentPosition) {
            logger.log({
                context: 'ScrollMoveVideoHelper',
                payload: {
                    lastScroll: debug.lastScrollY,
                    currentScroll: currentScroll,

                    lastHeight: debug.lastInnerHeight,
                    currentHeight: height,

                    lastPosition: debug.lastPosition,
                    currentPosition: currentPosition,
                }
            });


            nextTime  = this.video.currentTime;
        } else {
            nextTime = 5 * currentPosition;
        }

        debug.lastPosition = currentPosition;
        debug.lastInnerHeight = height;
        debug.lastScrollY = currentScroll;

        return nextTime;
    }

    // public move(): number {
    //     const bottom = this.video.getBoundingClientRect().bottom / this.viewport;

    //     const relativeBottom = this.getInRange(
    //         bottom,
    //         this.spinHeightEnd,
    //         this.spinHeightStart
    //     );

    //     const relativeScroll = this.spinHeightStart - relativeBottom;

    //     const maxDuration = this.video.duration * this.spinDurationLimit;

    //     const nextTime = (relativeScroll / this.distance) * maxDuration;

    //     // logger.log({
    //     //     context: 'ScrollMoveVideoHelper',
    //     //     fn: 'move',
    //     //     payload: {
    //     //         currentTime: nextTime,
    //     //     }
    //     // })

    //     return nextTime;
    // }

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