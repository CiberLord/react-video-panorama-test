import React, { useCallback, useRef, useState } from "react";

import { VideoController } from "../utils/VideoController";


export const useVideoPanorama = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoControllerRef = useRef<VideoController | null>(null);

    const [isVisible, setIsVisible] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    const handleVideoLoaded = useCallback(() => {
        if (!videoRef.current) {
            return;
        }

        if(isVideoLoaded) {
            return;
        }

        if (videoRef.current.readyState === 4) {
            setIsVideoLoaded(true);
        }
    }, [isVideoLoaded]);

    const handleMouseEnter = useCallback(() => {
        videoControllerRef.current?.mouseHandler.handleEnter();
    }, []);

    const handleMouseMove = useCallback((event: React.MouseEvent) => {
        videoControllerRef.current?.mouseHandler.handleMove(event as unknown as MouseEvent);
    }, []);

    const handleMouseLeave = useCallback(() => {
        videoControllerRef.current?.mouseHandler.handleLeave();
    }, []);

    const handleIntersection = useCallback((isInView: boolean) => {
        setIsVisible(isInView);

        if (!videoRef.current) {
            return;
        }

        if(!canvasRef.current) {
            return;
        }

        if (isInView) {
            videoRef.current.load();

            // controller создаем один раз только при монтировании
            videoControllerRef.current = new VideoController(videoRef.current, {
                canvas: canvasRef.current
            });

            videoControllerRef.current.start();
        } else {
            videoControllerRef.current?.stop();
        }
    }, []);

    return {
        isVisible,
        videoRef,
        isVideoLoaded,
        handleVideoLoaded,
        handleIntersection,
        handleMouseEnter,
        handleMouseMove,
        handleMouseLeave,
        canvasRef
    }
}