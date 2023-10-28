import { proxy } from "valtio";

export const store = proxy({
  level: 1,

  redCount: 1,
  yellowCount: 1,
  greenCount: 1,
  blueCount: 1,

  gameOn: false,
  timerExpired: false,

  showContinue: false,
  showCount: false,
  showConfetti: false,

  playDump: false,
  playLevelComplete: false,
});
