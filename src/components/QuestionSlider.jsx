import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function QuestionSlider({ keyId, dir = 1, children, onDragEnd }) {
  const ref = useRef(null);

  return (
    <div
      className="relative overflow-hidden"
      ref={ref}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          onDragEnd?.("back");
        } else if (e.key === "ArrowRight") {
          onDragEnd?.("next");
        }
      }}
      aria-roledescription="question slider"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={keyId}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_e, info) => {
            const offset = info.offset.x;
            if (offset < -80) onDragEnd?.("next");
            if (offset > 80) onDragEnd?.("back");
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
