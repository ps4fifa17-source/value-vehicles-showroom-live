 "use client";

import { Armchair, CircleDot, CarFront, Car, ShieldCheck, RotateCcw, Play } from "lucide-react";
import PremiumVideo from "./PremiumVideo";

const iconMap = {
  seat: Armchair,
  wheel: CircleDot,
  front: CarFront,
  rear: Car,
  shield: ShieldCheck,
  walkaround: RotateCcw,
};

export default function InspectCards({ car, activeLabel, onSelect, variant = "cards" }) {
  const clips = [
    { label: "Walkaround", icon: "walkaround", video: car.walkaroundVideo, preview: car.teaserVideo },
    ...(car.inspectVideos || []).filter((clip) => clip?.video)
  ];

  if (variant === "compact") {
    return (
      <div className="inspect-compact-list">
        {clips.map((clip) => {
          const Icon = iconMap[clip.icon] || Play;
          const active = activeLabel === clip.label;
          return (
            <button type="button" key={clip.label} className={`inspect-compact ${active ? "active" : ""}`} onClick={() => onSelect(clip)}>
              <span><Icon size={15} /></span>
              <strong>{clip.label}</strong>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="inspect-grid">
      {clips.map((clip) => {
        const Icon = iconMap[clip.icon] || Play;
        const active = activeLabel === clip.label;
        return (
          <button type="button" key={clip.label} className={`inspect-card-tile ${active ? "active" : ""}`} onClick={() => onSelect(clip)}>
            <PremiumVideo src={clip.preview || clip.video} wrapperClassName="inspect-preview" />
            <div className="inspect-tile-shade" />
            <div className="inspect-tile-content">
              <span><Icon size={15} /></span>
              <strong>{clip.label}</strong>
              <small>{active ? "Playing now" : "Tap to view"}</small>
            </div>
          </button>
        );
      })}
    </div>
  );
}
