"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

function isUrl(value) {
  return value?.startsWith("http") || value?.startsWith("/");
}

function cloudflareHls(id) {
  return `https://videodelivery.net/${id}/manifest/video.m3u8`;
}

export default function PremiumVideo({
  src,
  className = "",
  muted = true,
  enableSoundUnlock = false,
  soundChannel = "default",
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const loadedSrcRef = useRef("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const videoSrc = isUrl(src) ? src : cloudflareHls(src);

    if (loadedSrcRef.current !== videoSrc) {
      loadedSrcRef.current = videoSrc;

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (videoSrc.includes(".m3u8")) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = videoSrc;
        } else if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            maxBufferLength: 12,
            backBufferLength: 20,
            startLevel: -1,
          });

          hlsRef.current = hls;
          hls.loadSource(videoSrc);
          hls.attachMedia(video);
        }
      } else {
        video.src = videoSrc;
      }
    }

    video.muted = muted;
    video.volume = 1;
    video.play().catch(() => {});

    function unlockSound() {
      if (!enableSoundUnlock) return;
      video.muted = false;
      video.volume = 1;
      video.play().catch(() => {});
    }

    function muteSound() {
      if (!enableSoundUnlock) return;
      video.muted = true;
      video.play().catch(() => {});
    }

    window.addEventListener(`unlock-${soundChannel}-sound`, unlockSound);
    window.addEventListener(`mute-${soundChannel}-sound`, muteSound);

    return () => {
      window.removeEventListener(`unlock-${soundChannel}-sound`, unlockSound);
      window.removeEventListener(`mute-${soundChannel}-sound`, muteSound);
    };
  }, [src, soundChannel, enableSoundUnlock, muted]);

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`video-box ready ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="metadata"
        controls={false}
      />
    </div>
  );
}