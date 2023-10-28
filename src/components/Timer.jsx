import { useTimer } from "react-timer-hook";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { store } from "../store";
import { useSnapshot } from "valtio";
import useSound from "use-sound";

export const MyTimer = ({ time }) => {
  const snap = useSnapshot(store);

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + time + 1.3);

  const [playOut] = useSound("./1028_Out.mp3");

  const { seconds, start } = useTimer({
    expiryTimestamp: expiryTimestamp,
    onExpire: () => {
      store.timerExpired = true;
      store.gameOn = false;
      store.showContinue = true;
      playOut();
    },

    autoStart: false,
  });

  useEffect(() => {
    if (snap.gameOn) {
      start();
    }
  }, [snap.gameOn]);

  return (
    <div
      className="fixed z-10 flex min-w-[24px] max-w-[24px] items-center justify-center 
    pl-[20vw] pt-[20vw]
    md:pl-[12vw] md:pt-[9vw]"
    >
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: snap.gameOn ? 1 : 0, opacity: snap.gameOn ? 1 : 0 }}
        className="{/*border-slate-50/60*/} {/*border-2*/} z-20 px-2 py-[1px] text-center font-super text-4xl text-slate-50"
        transition={{ scale: { delay: 1.3 }, opacity: { duration: 0.4 } }}
      >
        <div className="">{seconds}</div>
      </motion.div>
    </div>
  );
};
