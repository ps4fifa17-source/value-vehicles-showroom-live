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
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls;
    const videoSrc = isUrl(src) ? src : cloudflareHls(src);

    if (videoSrc.includes(".m3u8")) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
      } else if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
      }
    } else {
      video.src = videoSrc;
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

    window.addEventListener("unlock-showroom-sound", unlockSound);
    function muteSound() {
  if (!enableSoundUnlock) return;

  video.muted = true;
}

window.addEventListener("mute-showroom-sound", muteSound);

    return () => {
  window.removeEventListener("unlock-showroom-sound", unlockSound);
  window.removeEventListener("mute-showroom-sound", muteSound);

  if (hls) hls.destroy();
};
  }, [src, muted, enableSoundUnlock]);

  return (
    <div className={`video-box ready ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="auto"
        controls={false}
      />
    </div>
  );
}