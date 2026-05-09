"use client";

import Link from "next/link";

export default function Header({ dealership }) {
  const logo = dealership?.logo_url || "";
  const phone = dealership?.phone || "01206 413177";
  const name = dealership?.dealership_name || "Dealership";

  return (
    <header
      className="header"
      style={{
        "--accent": dealership?.accent_color || "#732b97",
        "--accent2": "#b85cff",
      }}
    >
      <div className="header-inner">
        <Link href="/" aria-label="Home">
          {logo ? (
            <img
              src={logo}
              alt={name}
              className="logo-img"
            />
          ) : (
            <div className="logo-waiting">
              Add logo
            </div>
          )}
        </Link>

        <a
          className="call-btn"
          href={`tel:${phone.replaceAll(" ", "")}`}
        >
          Call
        </a>
      </div>
    </header>
  );
}
