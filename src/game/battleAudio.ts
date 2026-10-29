import type { BattleFrame } from "../types/game";

// Tiny synthesized game sounds: no downloads, external assets, or copyrighted audio.
let audio: AudioContext | null = null;

export function activateAudio(): void {
  if (typeof window === "undefined" || !window.AudioContext) return;
  try {
    audio ??= new window.AudioContext();
    if (audio.state === "suspended") {
      void audio.resume().catch(() => undefined);
    }
  } catch {
    audio = null;
  }
}

export function playBattleCue(frame: BattleFrame): void {
  if (typeof window === "undefined" || !window.AudioContext) return;
  if (!["strike", "counter", "slain", "fallen", "breach", "end", "enter"].includes(frame.kind)) return;
  try {
    activateAudio();
    if (!audio || audio.state !== "running") return;
    const now = audio.currentTime;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    let start = 220;
    let finish = 85;
    let duration = 0.16;
    let volume = 0.065;
    oscillator.type = "triangle";
    if (frame.kind === "strike" || frame.kind === "counter") {
      start = frame.effect === "magic" ? 620 : 230;
      finish = frame.effect === "magic" ? 210 : 65;
      duration = 0.16;
      oscillator.type = frame.effect === "magic" ? "sine" : "sawtooth";
      volume = 0.05;
    } else if (frame.kind === "slain") {
      start = 490;
      finish = 200;
      duration = 0.28;
      oscillator.type = "square";
    } else if (frame.kind === "fallen" || frame.kind === "breach") {
      start = 130;
      finish = 40;
      duration = 0.29;
      oscillator.type = "sawtooth";
    } else if (frame.kind === "end") {
      start = 490;
      finish = 880;
      duration = 0.33;
      oscillator.type = "sine";
    } else if (frame.kind === "enter") {
      start = 180;
      finish = 270;
      volume = 0.025;
      duration = 0.08;
    }
    oscillator.frequency.setValueAtTime(start, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, finish), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.015);
  } catch {
    // Sound is optional. Game logic must keep working in muted/restricted browsers.
  }
}
