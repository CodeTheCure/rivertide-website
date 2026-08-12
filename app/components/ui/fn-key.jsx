"use client";

import { useState } from "react";

export default function FnKey() {
  const [on, setOn] = useState(false);

  const handleToggle = () => setOn((v) => !v);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <button
      type="button"
      className={`fnk-keycap ${on ? "is-on" : "is-off"}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      aria-pressed={on}
      aria-label="Press to talk"
    >
      <span className="fnk-glare" aria-hidden="true" />
      <span className="fnk-face">
        <span className="fnk-led" aria-hidden="true" />
        <span className="fnk-symbol" aria-hidden="true">
          fn
        </span>
        <span className="fnk-flash" aria-hidden="true" />
      </span>
      <span className="fnk-glow" aria-hidden="true" />
    </button>
  );
}
