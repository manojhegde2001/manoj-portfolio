"use client";

import type { GravityPreset } from "@/lib/physics/constants";

export interface ControlsProps {
  gravity: GravityPreset["name"];
  soundOn: boolean;
  onDrop(): void;
  onShake(): void;
  onGravity(): void;
  onSound(): void;
  onReset(): void;
}

export function Controls({ gravity, soundOn, onDrop, onShake, onGravity, onSound, onReset }: ControlsProps) {
  return (
    <div className="ctrls physics-only" role="group" aria-label="Playground controls">
      <button type="button" className="ctrl" onClick={onDrop} title="Knock every letter loose">
        Drop all
      </button>
      <button type="button" className="ctrl" onClick={onShake} title="Throw everything loose upward">
        Shake
      </button>
      <button
        type="button"
        className="ctrl"
        onClick={onGravity}
        title="Cycle gravity: Earth, Moon, Zero-G"
        aria-label={`Gravity: ${gravity}. Press to switch.`}
      >
        Gravity: {gravity}
      </button>
      <button type="button" className="ctrl" onClick={onSound} title="Collision sounds">
        Sound: {soundOn ? "on" : "off"}
      </button>
      <button type="button" className="ctrl" onClick={onReset} title="Rebuild the playground">
        Reset
      </button>
    </div>
  );
}
