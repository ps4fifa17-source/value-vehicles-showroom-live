 "use client";

import {
  Armchair,
  CircleDot,
  CarFront,
  Car,
  ShieldCheck,
  RotateCcw,
  Play,
} from "lucide-react";
import PremiumVideo from "./PremiumVideo";

const icons = {
  seat: Armchair,
  wheel: CircleDot,
  front: CarFront,
  rear: Car,
  shield: ShieldCheck,
  walkaround: RotateCcw,
};

function buildClips(car) {
  const seen = new Set();

  const walkaround = {
    label: "Walkaround",
    icon: "walkaround",
    video: car.walkaroundVideo,
    preview: car.walkaroundVideo,
  };

  const inspectClips = (car.inspectVideos || []).filter((clip) => {
    const label = (clip?.label || "").trim().toLowerCase();
    const video = clip?.video || "";

    if (!video) return false;
    if (label === "walkaround") return false;
    if (video === car.walkaroundVideo) return false;
    if (seen.has(video)) return false;

    seen.add(video);
    return true;
  });

  return [walkaround, ...inspectClips].filter((clip) => clip.video);
}

export default function InspectSelector({
  car,
  activeLabel,
  onSelect,
  compact = false,
}) {
  const clips = buildClips(car);

  if (compact) {
    return (
      <div className="compact-inspect-grid">
        {clips.map((clip) => {
          const Icon = icons[clip.icon] || Play;

          return (
            <button
              key={`${clip.label}-${clip.video}`}
              type="button"
              onClick={() => onSelect(clip)}
              className={`compact-inspect ${
                activeLabel === clip.label ? "active" : ""
              }`}
            >
              <Icon size={15} />
              <span>{clip.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="inspect-scroll">
      {clips.map((clip) => {
        const Icon = icons[clip.icon] || Play;
        const isActive = activeLabel === clip.label;

        return (
          <button
            key={`${clip.label}-${clip.video}`}
            type="button"
            onClick={() => onSelect(clip)}
            className={`inspect-tile ${isActive ? "active" : ""}`}
          >
            <PremiumVideo
              src={clip.preview || clip.video}
              className="tile-video"
              muted={true}
            />

            <div className="tile-shade" />

            <div className="tile-content">
              <span>
                <Icon size={15} />
              </span>
              <strong>{clip.label}</strong>
              <small>{isActive ? "Playing now" : "Tap to view"}</small>
            </div>
          </button>
        );
      })}
    </div>
  );
}