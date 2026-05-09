 "use client";

import { Armchair, CircleDot, CarFront, Car, ShieldCheck, RotateCcw, Play } from "lucide-react";
import PremiumVideo from "./PremiumVideo";

const icons = {
  seat: Armchair,
  wheel: CircleDot,
  front: CarFront,
  rear: Car,
  shield: ShieldCheck,
  walkaround: RotateCcw,
};

export default function InspectSelector({ car, activeLabel, onSelect, compact = false }) {
  const clips = [
    { label: "Walkaround", icon: "walkaround", video: car.walkaroundVideo, preview: car.teaserVideo },
    ...(car.inspectVideos || []).filter((clip) => clip?.video)
  ];

  if (compact) {
    return (
      <div className="compact-inspect-grid">
        {clips.map((clip) => {
          const Icon = icons[clip.icon] || Play;
          return (
            <button key={`${clip.label}-${clip.video}`} type="button" onClick={() => onSelect(clip)} className={`compact-inspect ${activeLabel === clip.label ? "active" : ""}`}>
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
        return (
          <button key={clip.label} type="button" onClick={() => onSelect(clip)} className={`inspect-tile ${activeLabel === clip.label ? "active" : ""}`}>
            <PremiumVideo src={clip.preview || clip.video} className="tile-video" />
            <div className="tile-shade" />
            <div className="tile-content">
              <span><Icon size={15} /></span>
              <strong>{clip.label}</strong>
              <small>{activeLabel === clip.label ? "Playing now" : "Tap to view"}</small>
            </div>
          </button>
        );
      })}
    </div>
  );
}
