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
  // console.log(expiryTimestamp);
  //replace 100 with a dynamic variable
  // console.log(expiryTimestamp);
  // useEffect(() => {
  //   // store.roundTimeLength = 30;
  //   // console.log(snap.roundTimeLensgth);

  //   expiryTimestamp.setSeconds(
  //     expiryTimestamp.getSeconds() + snap.roundTimeLength + 1.3
  //   );
  // }, [snap.roundTimeLength]);

  const [playOut] = useSound("1027_Out.mp3");

  const { totalSeconds, seconds, isRunning, start, restart, pause } = useTimer({
    expiryTimestamp: expiryTimestamp,
    //check here if win or not, to move to next round
    onExpire: () => {
      playOut();
      store.gameOn = false;
      store.showContinue = true;
      // store.start = false;
      // store.showModal = true;
      // store.expired = true;
      // console.log(isRunning);
    },
    // onExpire: () => alert("times up!"),
    // onExpire: () => console.warn("onExpire called"),
    // pause: snap.finished ? true : false,
    autoStart: false,
  });

  useEffect(() => {
    if (snap.gameOn) {
      start();
    }
  }, [snap.gameOn]);

  // useEffect(()=>{},[

  // ])

  // useEffect(() => {
  //   if (snap.start) {
  //     // if snap.resume = true
  //     console.log("start");
  //     start();
  //   }
  // }, [snap.start, snap.resume]);

  // useEffect(() => {
  //   if (snap.finished) {
  //     console.log("finished");
  //     pause();
  //     restart();
  //   }
  // }, [snap.finished]);

  // useEffect(() => {
  //   console.log(isRunning);
  // }, [isRunning]);

  // useEffect(() => {
  //   if (snap.resume) {
  //     restart();
  //   }
  // }, [snap.resume]);

  return (
    <div className="fixed z-10 flex items-center justify-center pl-[12vw] pt-[9vw]">
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: snap.gameOn ? 1 : 0, opacity: snap.gameOn ? 1 : 0 }}
        // animate={{ scale: snap.start ? 1 : 0, opacity: isRunning ? 1 : 0 }}
        className="z-20 border-2 border-slate-50/60 px-2 py-[1px] text-center text-4xl text-slate-50"
        transition={{ scale: { delay: 1.3 }, opacity: { duration: 0.4 } }}
      >
        <div className="">{seconds}</div>
      </motion.div>
    </div>
  );
};
