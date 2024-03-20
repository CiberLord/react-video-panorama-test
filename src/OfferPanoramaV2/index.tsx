import React, { PropsWithChildren } from 'react';
import cn from 'classnames';
import { InView } from 'react-intersection-observer';

import styles from './styles.module.css';
import { useVideoPanorama } from './hooks/useVideoPanorama';

interface IOfferPanoramaProps {
    className?: string;
    onErrorVideoLoad?: () => void;
    isMobile?: boolean;
}

export const OfferPanorama: React.FC<PropsWithChildren<IOfferPanoramaProps>> = ({ children, isMobile, onErrorVideoLoad, className, }) => {
    const { 
        videoRef,
        handleIntersection, 
        handleVideoLoaded, 
        handleMouseEnter, 
        handleMouseLeave, 
        handleMouseMove,
    } = useVideoPanorama(true);

    const getViedoUrls = () => {
        return {
            mp4Url: 'https://3d-tours-preview.s3.yandex.net/9b29d4f1-7a60-496d-90a2-5fda8806f33d/touch.mp4',
            webmUrl: 'https://3d-tours-preview.s3.yandex.net/9b29d4f1-7a60-496d-90a2-5fda8806f33d/touch.webm',
        };
    }

    const { mp4Url, webmUrl } = getViedoUrls()

    return (
        <InView 
            onChange={handleIntersection} 
            className={cn(className, styles.container)}
            rootMargin="0px 0px 200px 0px"
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
            {children}
        </InView>
    )
}