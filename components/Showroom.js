 "use client";

import {
  Search,
  MessageCircle,
  Phone,
  Info,
  Send,
  PhoneCall,
  Maximize2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PremiumVideo from "./PremiumVideo";
import InspectSelector from "./InspectSelector";

const dealership = {
  phone: "01206 413177",
  whatsapp: "07939885608",
  accent: "#732b97",
  accent2: "#b85cff",
};

function Details({ car, innerRef }) {
  return (
    <section className="panel" ref={innerRef}>
      <h2>Details</h2>
      {car.details?.map(([label, value]) => (
        <div className="detail-row" key={label}>
          <span>{label}</span>
          <strong>{value || "TBC"}</strong>
        </div>
      ))}
    </section>
  );
}

function Ask({ car, question, setQuestion, innerRef }) {
  const cleanPhone = dealership.phone.replaceAll(" ", "");
  const whatsAppNumber = "44" + dealership.whatsapp.replace(/^0/, "");
  const message = encodeURIComponent(
    `Hi, I'm interested in the ${car.title}. ${
      question ? "My question is: " + question : "Can you tell me more about it?"
    }`
  );

  return (
    <section className="panel" ref={innerRef}>
      <h2>Ask</h2>

      <textarea
        className="question-input"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about this car..."
      />

      <div className="cta-grid">
        <a
          className="btn btn-accent"
          href={`https://wa.me/${whatsAppNumber}?text=${message}`}
        >
          <MessageCircle size={15} /> WhatsApp
        </a>

        <a className="btn btn-white" href={`tel:${cleanPhone}`}>
          <Phone size={15} /> Call
        </a>
      </div>
    </section>
  );
}

export default function Showroom({ car }) {
  const [cinema, setCinema] = useState(false);
  const [question, setQuestion] = useState("");
  const [currentVideo, setCurrentVideo] = useState(car.walkaroundVideo);
  const [activeLabel, setActiveLabel] = useState("Walkaround");
  const [walkaroundSoundOn, setWalkaroundSoundOn] = useState(false);

  const topRef = useRef(null);
  const inspectRef = useRef(null);
  const detailsRef = useRef(null);
  const askRef = useRef(null);

  const uniqueInspects = (car.inspectVideos || []).filter(
  (clip) => clip.label !== "Walkaround"
);

const clips = [
  {
    label: "Walkaround",
    icon: "car",
    video: car.walkaroundVideo,
    preview: car.walkaroundVideo,
  },
  ...uniqueInspects,
];

  useEffect(() => {
    setCurrentVideo(car.walkaroundVideo);
    setActiveLabel("Walkaround");
    setWalkaroundSoundOn(false);
  }, [car.walkaroundVideo]);

  const isWalkaround = activeLabel === "Walkaround";

  function selectClip(clip) {
    setCurrentVideo(clip.video);
    setActiveLabel(clip.label);

    if (clip.label !== "Walkaround") {
      setWalkaroundSoundOn(false);
    }

    setTimeout(
      () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      40
    );
  }

  function scrollTo(ref) {
    setCinema(false);
    setTimeout(
      () => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50
    );
  }

  function goInspect() {
    setCinema(true);
    setTimeout(
      () => inspectRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80
    );
  }

  const cleanPhone = dealership.phone.replaceAll(" ", "");

  return (
    <main
      className={`showroom ${cinema ? "cinema" : ""}`}
      style={{ "--accent": dealership.accent, "--accent2": dealership.accent2 }}
    >
      <section className="mobile-normal-hero" ref={topRef}>
        <PremiumVideo
          src={currentVideo}
          className="normal-video"
          muted={!isWalkaround || !walkaroundSoundOn}
          enableSoundUnlock={isWalkaround}
        />

        {isWalkaround && (
          <button
            type="button"
            className="video-sound-btn"
            onClick={() => setWalkaroundSoundOn((prev) => !prev)}
          >
            {walkaroundSoundOn ? "🔊" : "🔇"}
          </button>
        )}

        <div className="normal-fade" />

        <div className="normal-copy">
          <h1>{car.title}</h1>

          <div className="keybar">
            <span>{car.price}</span>
            <span>{car.mileage}</span>
            <span>{car.fuel}</span>
            <span>{car.gearbox}</span>
            <span>{car.body}</span>
          </div>
        </div>
      </section>

      <section className="cinema-section" ref={inspectRef}>
        <PremiumVideo
          src={currentVideo}
          className="cinema-video"
          muted={!isWalkaround || !walkaroundSoundOn}
          enableSoundUnlock={isWalkaround}
        />

        {isWalkaround && (
          <button
            type="button"
            className="video-sound-btn cinema-sound-btn"
            onClick={() => setWalkaroundSoundOn((prev) => !prev)}
          >
            {walkaroundSoundOn ? "🔊" : "🔇"}
          </button>
        )}

        <div className="cinema-fade" />

        <div className="cinema-inspect-panel">
          <h2>Inspect Vehicle</h2>
          <p>Choose a section and the video above switches straight to it.</p>
          <InspectSelector
            car={{ ...car, inspectVideos: clips }}
            activeLabel={activeLabel}
            onSelect={selectClip}
          />
        </div>
      </section>

      <aside className="desktop-side">
        <div className="panel">
          <h2>Inspect Vehicle</h2>
          <p>Choose a section and the video switches straight to it.</p>
          <InspectSelector
            car={{ ...car, inspectVideos: clips }}
            activeLabel={activeLabel}
            onSelect={selectClip}
            compact
          />
        </div>

        <Details car={car} innerRef={detailsRef} />
        <Ask
          car={car}
          question={question}
          setQuestion={setQuestion}
          innerRef={askRef}
        />
      </aside>

      <section className="mobile-content">
        <div className="panel mobile-inspect" ref={inspectRef}>
          <h2>Inspect Vehicle</h2>
          <p>Choose a section and the video above switches straight to it.</p>
          <InspectSelector
            car={{ ...car, inspectVideos: clips }}
            activeLabel={activeLabel}
            onSelect={selectClip}
          />
        </div>

        <Details car={car} innerRef={detailsRef} />
        <Ask
          car={car}
          question={question}
          setQuestion={setQuestion}
          innerRef={askRef}
        />
      </section>

      <nav className="mobile-dock">
        <button type="button" onClick={() => setCinema(!cinema)}>
          <Maximize2 size={17} />
          <span>{cinema ? "Normal" : "Cinema"}</span>
        </button>

        <button type="button" onClick={goInspect}>
          <Search size={17} />
          <span>Inspect</span>
        </button>

        <button type="button" onClick={() => scrollTo(detailsRef)}>
          <Info size={17} />
          <span>Details</span>
        </button>

        <button type="button" onClick={() => scrollTo(askRef)}>
          <Send size={17} />
          <span>Ask</span>
        </button>

        <a href={`tel:${cleanPhone}`}>
          <PhoneCall size={17} />
          <span>Call</span>
        </a>
      </nav>
    </main>
  );
}