import { useCallback, useMemo, useRef } from "react";
import type { SoundProfile } from "../types/letter";

interface SoundEngine {
  playKey: () => void;
  playSpace: () => void;
  playReturn: () => void;
  playDing: () => void;
}

interface ProfileParams {
  freq: number;
  click: number;
  body: number;
  gain: number;
}

function getProfileParams(profile: SoundProfile): ProfileParams {
  switch (profile) {
    case "sharp":
      return { freq: 1400, click: 0.018, body: 180, gain: 0.5 };
    case "soft":
      return { freq: 800, click: 0.03, body: 130, gain: 0.32 };
    case "deep":
      return { freq: 600, click: 0.035, body: 110, gain: 0.4 };
    default:
      return { freq: 1000, click: 0.022, body: 150, gain: 0.42 };
  }
}

/**
 * Synthesizes typewriter sound effects via the Web Audio API instead of
 * loading sample files. Each theme's soundProfile tweaks frequency/decay
 * so machines feel distinct without needing separate audio assets.
 */
export function useSoundEngine(enabled: boolean, profile: SoundProfile): SoundEngine {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new AudioContextClass();
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const params = useMemo(() => getProfileParams(profile), [profile]);

  const playKey = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const t0 = ctx.currentTime;

      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = "square";
      click.frequency.setValueAtTime(params.freq + Math.random() * 200, t0);
      clickGain.gain.setValueAtTime(params.gain, t0);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t0 + params.click);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(t0);
      click.stop(t0 + params.click + 0.01);

      const body = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      body.type = "triangle";
      body.frequency.setValueAtTime(params.body, t0);
      bodyGain.gain.setValueAtTime(params.gain * 0.5, t0);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.05);
      body.connect(bodyGain);
      bodyGain.connect(ctx.destination);
      body.start(t0);
      body.stop(t0 + 0.06);
    } catch {
      // Audio is non-critical; fail silently (e.g. autoplay policy block).
    }
  }, [enabled, getCtx, params]);

  const playSpace = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(220, t0);
      gain.gain.setValueAtTime(0.3, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.08);
    } catch {
      // no-op
    }
  }, [enabled, getCtx]);

  const playReturn = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(900, t0);
      osc.frequency.exponentialRampToValueAtTime(200, t0 + 0.28);
      gain.gain.setValueAtTime(0.12, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.3);

      window.setTimeout(() => {
        const t1 = ctx.currentTime;
        const thunk = ctx.createOscillator();
        const thunkGain = ctx.createGain();
        thunk.type = "triangle";
        thunk.frequency.setValueAtTime(140, t1);
        thunkGain.gain.setValueAtTime(0.4, t1);
        thunkGain.gain.exponentialRampToValueAtTime(0.001, t1 + 0.1);
        thunk.connect(thunkGain);
        thunkGain.connect(ctx.destination);
        thunk.start(t1);
        thunk.stop(t1 + 0.1);
      }, 270);
    } catch {
      // no-op
    }
  }, [enabled, getCtx]);

  const playDing = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(2200, t0);
      gain.gain.setValueAtTime(0.25, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.5);
    } catch {
      // no-op
    }
  }, [enabled, getCtx]);

  return { playKey, playSpace, playReturn, playDing };
}
