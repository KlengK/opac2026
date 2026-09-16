"use client";

import { useEffect, useState } from "react";
import AccessBadge from "./AccessBadge.jsx";

const COUNTDOWN_SECONDS = 8;

const AGE_RANGES = ["Under 13", "13–17", "18–24", "25–34", "35–49", "50–64", "65 or older"];
const GENDERS = ["Female", "Male", "Another term", "Prefer not to say"];
const LOCATIONS = ["Main library", "Branch library", "School", "At home", "Somewhere else"];

export default function KioskLauncher({ links }) {
  const [stage, setStage] = useState({ name: "browse", link: null });

  if (stage.name === "survey") {
    return (
      <SurveyStep
        link={stage.link}
        onContinue={() => setStage({ name: "leaving", link: stage.link })}
        onCancel={() => setStage({ name: "browse", link: null })}
      />
    );
  }

  if (stage.name === "leaving") {
    return (
      <LeavingStep link={stage.link} onCancel={() => setStage({ name: "browse", link: null })} />
    );
  }

  return (
    <>
      <h1 className="m-0 text-3xl font-bold tracking-tight">Pick a collection</h1>
      <p className="mt-3 mb-8 max-w-2xl text-lg text-muted">
        Each of these opens a library you can use for free. Choose one to get started.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
        {links.map((link) => (
          <li key={link.slug}>
            <button
              type="button"
              onClick={() => setStage({ name: "survey", link })}
              className="pressable flex h-full w-full flex-col items-start gap-2 rounded-lg border border-line bg-card p-5 text-left hover:border-brand"
            >
              <span className="text-lg font-semibold text-ink">{link.title}</span>
              <span className="text-sm text-muted">{link.description}</span>
              <span className="mt-auto pt-3">
                <AccessBadge access={link.access} note={link.accessNote} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function SurveyStep({ link, onContinue, onCancel }) {
  return (
    <div className="max-w-xl">
      <h1 className="m-0 text-2xl font-bold tracking-tight">
        Before you open {link.title}
      </h1>
      <p className="mt-3 text-muted">
        These three optional questions help the library understand who it is serving.
        You can skip them and go straight through.
      </p>

      <p className="mt-4 rounded-lg border border-partial bg-partial-soft p-3 text-sm">
        <strong>Prototype:</strong> nothing you enter here is recorded or sent anywhere.
        This screen exists to show the flow.
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          onContinue();
        }}
      >
        <Field id="kiosk-age" label="Age range" options={AGE_RANGES} />
        <Field id="kiosk-gender" label="Gender" options={GENDERS} />
        <Field id="kiosk-location" label="Where are you using this?" options={LOCATIONS} />

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-3 font-semibold"
            style={{ color: "var(--paper)" }}
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="rounded-lg border border-line px-5 py-3 font-medium hover:bg-brand-soft"
          >
            Skip and continue
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-line px-5 py-3 font-medium hover:bg-brand-soft"
          >
            Back to collections
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ id, label, options }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <select
        id={id}
        name={id}
        defaultValue=""
        className="mt-1 w-full rounded-lg border border-line bg-card px-3 py-2.5 text-ink"
      >
        <option value="">Prefer not to say</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function LeavingStep({ link, onCancel }) {
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (remaining <= 0) {
      window.location.href = link.url;
      return;
    }
    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, paused, link.url]);

  return (
    <div className="max-w-xl">
      <h1 className="m-0 text-2xl font-bold tracking-tight">Opening {link.title}</h1>

      {/* Announced once on arrival and again on pause. The ticking number itself
          is hidden from screen readers so it does not interrupt every second. */}
      <p aria-live="polite" className="mt-3 text-muted">
        {paused
          ? `Paused. ${link.title} will not open until you choose Open now.`
          : `${link.title} will open automatically in a few seconds. You can open it now, pause, or go back.`}
      </p>

      <p className="mt-6 text-5xl font-bold tabular-nums" aria-hidden="true">
        {Math.max(remaining, 0)}
      </p>

      <p className="mt-2 mb-0 text-sm text-muted">{link.accessNote}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={link.url}
          className="rounded-lg bg-brand px-5 py-3 font-semibold no-underline"
          style={{ color: "var(--paper)" }}
        >
          Open now
        </a>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          className="rounded-lg border border-line px-5 py-3 font-medium hover:bg-brand-soft"
        >
          {paused ? "Resume countdown" : "Pause countdown"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-line px-5 py-3 font-medium hover:bg-brand-soft"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
