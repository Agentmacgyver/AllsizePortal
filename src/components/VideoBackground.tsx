import { useState, useEffect, useRef } from "react";
import farmVideo from "@/assets/farm-bg.mp4";
import CowLoader from "./CowLoader";

const VideoBackground = () => {
  const [videoReady, setVideoReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 3) {
      setVideoReady(true);
      return;
    }

    const handleCanPlay = () => {
      setVideoReady(true);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.load();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const isFullyReady = videoReady && loaderDone;

  return (
    <>
      {!loaderDone && <CowLoader onComplete={() => setLoaderDone(true)} />}

      <div
        className={`absolute inset-0 -z-10 overflow-hidden transition-opacity duration-500 ${
          isFullyReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute min-w-full min-h-full object-cover"
        >
          <source src={farmVideo} type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-overlay)" }}
        />

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>
    </>
  );
};

export default VideoBackground;
