import { proxy } from "valtio";

export const store = proxy({
  redCount: 1,
  yellowCount: 1,
  greenCount: 1,
  blueCount: 1,
});
