"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import PortraitCard from "./PortraitCard";
import PremiumVideo from "./PremiumVideo";

export default function HomeClient({ dealership, cars, heroVideo }) {
  const [scrolled, setScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const triggerPoint = window.innerWidth <= 920 ? 3 : 35;
      setScrolled(window.scrollY > triggerPoint);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function toggleSound() {
    const next = !soundOn;
    window.dispatchEvent(new Event(next ? "unlock-home-sound" : "mute-home-sound"));
    setSoundOn(next);
  }

  return (
    <>
      <Header dealership={dealership} />

      <main style={{ "--accent": dealership.accent_color || "#732b97", "--accent2": "#b85cff" }}>
        <section className={`home-hero intro-hero ${scrolled ? "intro-scrolled" : ""}`}>
          {heroVideo && (
            <PremiumVideo
              src={heroVideo}
              className="home-video"
              muted={true}
              enableSoundUnlock={true}
              soundChannel="home"
            />
          )}

          {heroVideo && (
            <button type="button" className="sound-toggle" onClick={toggleSound}>
              {soundOn ? "🔊" : "🔇"}
            </button>
          )}

          <div className="home-fade" />

          <div className="home-copy">
            <h1>{dealership.homepage_video_title || "Welcome to our online showroom"}</h1>
            <p>{dealership.homepage_video_subtitle || "Step inside the car before you visit."}</p>
            <a href="#stock">View stock</a>
          </div>
        </section>

        <section id="stock" className="stock">
          <div className="stock-head">
            <h2>Video stock</h2>
            <p>{cars.length} shown</p>
          </div>

          {cars.length === 0 ? (
            <div className="stock-empty">
              <h3>No video stock live yet</h3>
              <p>Vehicles will appear here once they are published from the admin portal.</p>
            </div>
          ) : (
            <div className="stock-grid">
              {cars.map((car) => (
                <PortraitCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}