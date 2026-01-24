import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CowLoaderProps {
  onComplete: () => void;
  duration?: number;
}

const Hurdle = ({ passed }: { passed: boolean }) => (
  <motion.div
    className="relative w-10 h-14"
    animate={{ opacity: passed ? 0.4 : 1 }}
    transition={{ duration: 0.2 }}
  >
    {/* Left pole */}
    <div className="absolute bottom-0 left-0 w-1.5 h-14 bg-gradient-to-b from-orange-400 to-orange-600 rounded-t-sm shadow-md" />
    {/* Right pole */}
    <div className="absolute bottom-0 right-0 w-1.5 h-14 bg-gradient-to-b from-orange-400 to-orange-600 rounded-t-sm shadow-md" />

    {/* Top bar */}
    <div className="absolute top-0 left-0 right-0 h-2.5 flex overflow-hidden rounded-sm shadow">
      <div className="flex-1 h-full bg-white" />
      <div className="flex-1 h-full bg-red-500" />
      <div className="flex-1 h-full bg-white" />
      <div className="flex-1 h-full bg-red-500" />
    </div>

    {/* Middle bar */}
    <div className="absolute top-6 left-0 right-0 h-2 flex overflow-hidden rounded-sm">
      <div className="flex-1 h-full bg-red-500" />
      <div className="flex-1 h-full bg-white" />
      <div className="flex-1 h-full bg-red-500" />
      <div className="flex-1 h-full bg-white" />
    </div>

    {/* Base supports */}
    <div className="absolute bottom-0 -left-0.5 w-2.5 h-1 bg-gray-600 rounded-sm" />
    <div className="absolute bottom-0 -right-0.5 w-2.5 h-1 bg-gray-600 rounded-sm" />
  </motion.div>
);

const Firework = ({ delay, x, y }: { delay: number; x: number; y: number }) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#FFE66D",
    "#95E1D3",
    "#F38181",
    "#AA96DA",
    "#FF9F43",
    "#5F27CD",
  ];

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
    >
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            boxShadow: `0 0 6px ${colors[i % colors.length]}`,
          }}
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: Math.cos((i * 30 * Math.PI) / 180) * 50,
            y: Math.sin((i * 30 * Math.PI) / 180) * 50,
            scale: [1, 1.5, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ delay, duration: 0.7, ease: "easeOut" }}
        />
      ))}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-white"
        style={{ left: -8, top: -8, boxShadow: "0 0 20px white" }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 2, 0], opacity: [1, 1, 0] }}
        transition={{ delay, duration: 0.3 }}
      />
    </motion.div>
  );
};

const CowLoader = ({ onComplete, duration = 1000 }: CowLoaderProps) => {
  const MIN_VISIBLE_MS = 1000;

  const [progress, setProgress] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const hurdlePositions = [25, 50, 75];

  // refs to prevent double-trigger + allow cleanup
  const didFinishRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    const startTime = Date.now();

    // Key fix:
    // - Ensure the *run* itself never completes in under 1s (so you see all hurdles),
    //   regardless of a small `duration`.
    const runDuration = Math.max(duration * 0.85, MIN_VISIBLE_MS);

    const clearAll = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      for (const t of timeoutsRef.current) clearTimeout(t);
      timeoutsRef.current = [];
    };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / runDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        if (didFinishRef.current) return;
        didFinishRef.current = true;

        setShowFireworks(true);

        // Ensure overall loader is visible at least MIN_VISIBLE_MS from mount
        const remainingMinTime = MIN_VISIBLE_MS - (Date.now() - startTime);

        const t1 = window.setTimeout(() => {
          setIsExiting(true);
          const t2 = window.setTimeout(onComplete, 400);
          timeoutsRef.current.push(t2);
        }, Math.max(0, remainingMinTime) + 700);

        timeoutsRef.current.push(t1);
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      clearAll();
    };
  }, [duration, onComplete]);

  // Calculate jump arc - smoother parabolic motion over hurdles
  const getJumpHeight = () => {
    for (const hurdlePos of hurdlePositions) {
      const distanceToHurdle = progress - hurdlePos;
      // Jump window: start 8 units before hurdle, end 8 units after
      if (distanceToHurdle >= -8 && distanceToHurdle <= 8) {
        // Parabolic arc: peaks at hurdle position
        const normalizedPos = distanceToHurdle / 8; // -1 to 1
        const jumpHeight = (1 - normalizedPos * normalizedPos) * 70; // Max height 70px
        return jumpHeight;
      }
    }
    return 0;
  };

  const jumpHeight = getJumpHeight();
  const isJumping = jumpHeight > 5;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #87CEEB 0%, #B0E0E6 40%, #90EE90 70%, #228B22 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          {/* Sun */}
          <motion.div
            className="absolute top-8 right-16 w-20 h-20 rounded-full"
            style={{
              background: "radial-gradient(circle, #FFD700 0%, #FFA500 100%)",
              boxShadow: "0 0 60px #FFD700, 0 0 100px #FFA50080",
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Clouds */}
          <motion.div
            className="absolute top-16 left-[8%] text-5xl drop-shadow-lg select-none"
            animate={{ x: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            ☁️
          </motion.div>
          <motion.div
            className="absolute top-28 left-[25%] text-3xl drop-shadow-lg select-none"
            animate={{ x: [0, -10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            ☁️
          </motion.div>
          <motion.div
            className="absolute top-12 right-[35%] text-4xl drop-shadow-lg select-none"
            animate={{ x: [0, 12, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            ☁️
          </motion.div>

          {/* Title */}
          <motion.h2
            className="relative z-10 mb-12 text-3xl font-bold text-gray-800 drop-shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Moo-ving along... 🐄
          </motion.h2>

          {/* Track container */}
          <div className="relative w-[500px] h-44 z-10">
            {/* Track/grass */}
            <div
              className="absolute bottom-0 left-0 right-0 h-8 rounded-lg shadow-inner"
              style={{
                background: "linear-gradient(180deg, #32CD32 0%, #228B22 100%)",
              }}
            />

            {/* Running track line */}
            <div className="absolute bottom-8 left-4 right-4 h-0.5 bg-white/40 rounded-full" />

            {/* Finish line */}
            <div className="absolute bottom-8 right-4 flex flex-col items-center">
              <div className="w-1 h-20 bg-gray-800 rounded-t-sm" />
              <motion.div
                className="absolute top-0 left-1 w-8 h-5 border border-gray-800"
                style={{
                  background:
                    "repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 8px 8px",
                }}
                animate={{ scaleX: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </div>

            {/* Hurdles */}
            {hurdlePositions.map((pos, i) => (
              <div
                key={i}
                className="absolute bottom-8"
                style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
              >
                <Hurdle passed={progress > pos + 8} />
              </div>
            ))}

            {/* Cow emoji */}
            <motion.div
              className="absolute bottom-8 text-5xl select-none"
              style={{
                left: `${Math.min(progress * 0.82 + 5, 88)}%`,
                filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.3))",
              }}
              animate={{
                y: -jumpHeight,
                rotate: isJumping ? -15 : 0,
                scaleX: -1, // Flip to face right
              }}
              transition={{
                y: { type: "tween", duration: 0.05 },
                rotate: { type: "spring", stiffness: 300, damping: 20 },
              }}
            >
              🐄
            </motion.div>

            {/* Fireworks */}
            {showFireworks && (
              <>
                <Firework delay={0} x={85} y={-20} />
                <Firework delay={0.08} x={92} y={10} />
                <Firework delay={0.12} x={78} y={-40} />
                <Firework delay={0.18} x={95} y={-30} />
                <Firework delay={0.22} x={88} y={-55} />
                <Firework delay={0.28} x={75} y={-10} />
              </>
            )}
          </div>

          {/* Progress bar */}
          <div className="relative z-10 mt-10 w-72 h-4 bg-white/30 rounded-full overflow-hidden shadow-inner backdrop-blur-sm border border-white/50">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, #4CAF50 0%, #8BC34A 50%, #CDDC39 100%)",
              }}
            />
          </div>

          {/* Fun text */}
          <motion.p
            className="relative z-10 mt-4 text-lg font-medium text-gray-700"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {progress < 20 && "🏃 Ready, set, GO!"}
            {progress >= 20 && progress < 45 && "🐄 Look at her go!"}
            {progress >= 45 && progress < 70 && "⚡ She's flying!"}
            {progress >= 70 && progress < 95 && "🎯 Final stretch!"}
            {progress >= 95 && "🎉 Udderly amazing!"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CowLoader;
