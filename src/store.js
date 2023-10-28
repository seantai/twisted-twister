import { proxy } from "valtio";

export const store = proxy({
  redCount: 1,
  yellowCount: 1,
  greenCount: 1,
  blueCount: 1,
  loaded: false,
  start: false,
  showStart: true,
  finished: false,
  roundTimeLength: 3,
  showModal: false,
  expired: false,
  level: 1,
  resume: null,
  showTimer: false,
  gameOn: false,
  showContinue: false,
  showCount: false,
  playDump: false,
  showConfetti: false,
  playLevelComplete: false,
});
