 "use client";

import Link from "next/link";
import PremiumVideo from "./PremiumVideo";

export default function PortraitCard({ car }) {
  return (
    <Link href={`/car/${car.slug}`} className="portrait-card">
      <PremiumVideo src={car.teaserVideo} className="portrait-video" />
      <div className="portrait-shade" />
      <div className="portrait-info">
        <span>{car.status}</span>
        <h3>{car.title}</h3>
        <strong>{car.price}</strong>
        <div>Enter showroom →</div>
      </div>
    </Link>
  );
}
