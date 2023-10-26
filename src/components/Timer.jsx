import { useTimer } from "react-timer-hook";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { store } from "../store";
import { useSnapshot } from "valtio";

export const MyTimer = () => {
  const snap = useSnapshot(store);
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 35);

  const { totalSeconds, seconds, isRunning, start, restart } = useTimer({
    expiryTimestamp,
    //check here if win or not, to move to next round
    onExpire: () => alert("times up!"),
    // onExpire: () => alert("times up!"),
    // onExpire: () => console.warn("onExpire called"),
    autoStart: false,
  });

  useEffect(() => {
    if (snap.start) {
      start();
    }
  }, [snap.start]);

  useEffect(() => {
    if (snap.start) {
      start();
    }
  }, [snap.finished]);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: snap.start ? 1 : 0 }}
      className="z-20 text-center text-4xl"
    >
      <div>:{seconds}</div>
    </motion.div>
  );
};
