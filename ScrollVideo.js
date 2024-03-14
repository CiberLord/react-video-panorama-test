class ScrollVideo {
    constructor(elem) {
        this.elem = elem;
        this.video = this.elem.querySelector("video");
        this.videoDuration = 0.001;
        this.canvas = this.elem.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.seeked = true;
    }
    setVideoDuration() {
        console.log("ondurationchange");
        this.videoDuration = this.video.duration;
    }
    init() {
        // this.video.ondurationchange = this.setVideoDuration();
        this.video.oncanplay = this.loop();
        this.video.currentTime = 0.001;
        this.initObserver();
    }
    loop() {
        requestAnimationFrame(() => this.loop());

        if (this.seeked) {
            this.seeked = false;
            const { scrollHeight, clientHeight, scrollTop } = document.body;
            const maxScroll = scrollHeight - clientHeight;
            const scrollProgress = scrollTop / Math.max(maxScroll, 1);

            //canvas.width = document.body.clientWidth;
            //canvas.height = document.body.clientHeight;
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;

            if (!isNaN(this.video.duration)) {
                this.video.currentTime = this.video.duration * scrollProgress;
            }

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(
                this.video,
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
        }
    }
    initObserver() {
        this.video.addEventListener("seeked", () => {
            this.seeked = true;
        });
    }
}

const Components = document.querySelectorAll(".canvas-wrapper");

Components.forEach((item) => {
    const component = new ScrollVideo(item);
    component.init();
});
