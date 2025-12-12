'use client';

import { useRef, useEffect } from 'react';
import styles from './AltServicesSection.module.css';

export default function AltServicesSection() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const video3Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadFirstFrame = (video: HTMLVideoElement | null) => {
      if (video) {
        video.load();
        video.addEventListener(
          'loadedmetadata',
          () => {
            video.currentTime = 0;
          },
          { once: true },
        );
      }
    };

    loadFirstFrame(video1Ref.current);
    loadFirstFrame(video2Ref.current);
    loadFirstFrame(video3Ref.current);
  }, []);

  const handleMouseEnter = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <section className={styles.section} id="services">
      <h2 className={styles.title}>Service you can count on</h2>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div
            className={styles.imageWrapper}
            onMouseEnter={() => handleMouseEnter(video1Ref)}
            onMouseLeave={() => handleMouseLeave(video1Ref)}
          >
            <video
              ref={video1Ref}
              src="/grok-video-pool-skimming.mp4"
              muted
              loop
              playsInline
              preload="auto"
              className={styles.video}
            />
          </div>
          <h3>Routine Care</h3>
          <p>We balance chemistry, brush tiles, skim surfaces, and empty baskets for crystal-clear water.</p>
        </div>

        <div className={styles.card}>
          <div
            className={styles.imageWrapper}
            onMouseEnter={() => handleMouseEnter(video2Ref)}
            onMouseLeave={() => handleMouseLeave(video2Ref)}
          >
            <video
              ref={video2Ref}
              src="/grok-video-pool-maintenance.mp4"
              muted
              loop
              playsInline
              preload="auto"
              className={styles.video}
            />
          </div>
          <h3>Equipment Repair</h3>
          <p>We diagnose and repair pumps, heaters, filters, and automation to keep your pool running smoothly.</p>
        </div>

        <div className={styles.card}>
          <div
            className={styles.imageWrapper}
            onMouseEnter={() => handleMouseEnter(video3Ref)}
            onMouseLeave={() => handleMouseLeave(video3Ref)}
          >
            <video
              ref={video3Ref}
              src="/grok-video-filter-cleaning.mp4"
              muted
              loop
              playsInline
              preload="auto"
              className={styles.video}
            />
          </div>
          <h3>Filter Cleaning</h3>
          <p>We deep-clean filters to improve circulation, extend equipment life, and maintain crystal-clear water.</p>
        </div>
      </div>
    </section>
  );
}

