import { proxy } from "valtio";

export const store = proxy({
  redCount: 3,
  yellowCount: 3,
  greenCount: 3,
  blueCount: 3,
  loaded: false,
  start: false,
  finished: false,
});
