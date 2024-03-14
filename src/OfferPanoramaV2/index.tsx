import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { InView } from 'react-intersection-observer';

import styles from './styles.module.css';
import { useVideoPanorama } from './hooks/useVideoPanorama';

interface IOfferPanoramaProps {
    className?: string;
    onErrorVideoLoad?: () => void;
}

export const OfferPanorama: React.FC<PropsWithChildren<IOfferPanoramaProps>> = ({ children, onErrorVideoLoad, className, }) => {
    const { 
        videoRef,
        canvasRef,
        handleIntersection, 
        handleVideoLoaded, 
        handleMouseEnter, 
        handleMouseLeave, 
        handleMouseMove 
    } = useVideoPanorama();

    const getViedoUrls = () => {
        return {
            mp4Url: 'https://s3.mds.yandex.net/3d-tours-preview/2764358b-32ee-47ef-9577-1244a9f558fc/desktop.mp4',
            webmUrl: 'https://s3.mds.yandex.net/3d-tours-preview/2764358b-32ee-47ef-9577-1244a9f558fc/desktop.webm',
        };
    }

    const { mp4Url, webmUrl } = getViedoUrls()

    return (
        <InView 
            onChange={handleIntersection} 
            className={cn(className, styles.container)}
            rootMargin="0px 0px 400px 0px"
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
         >
            <video 
                ref={videoRef} 
                playsInline={true}
                preload="none"
                onError={onErrorVideoLoad}
                className={styles.video}
                onCanPlayThrough={handleVideoLoaded}
                onLoadedData={handleVideoLoaded}
                muted={true}
                loop={false}
                //@ts-expect-error по аналогии с автору
                pipe="false"
                x-yandex-pip="false"
            >
              <source src={mp4Url} type="video/mp4" />
              <source src={webmUrl} type="video/webm" />
            </video>
            <canvas className={styles.canvas} ref={canvasRef} />
            {children}
        </InView>
    )
}