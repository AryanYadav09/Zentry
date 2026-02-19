import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "./Button";
import VideoPreview from "./VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = 4;
  const initialVideoLoadCount = 3;
  const heroRef = useRef(null);
  const frameRef = useRef(null);
  const previewContainerRef = useRef(null);
  const previewCardRef = useRef(null);
  const transitionVideoRef = useRef(null);
  const transitionTlRef = useRef(null);
  const movePreviewXToRef = useRef(null);
  const movePreviewYToRef = useRef(null);

  const previewSize = 256;

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => Math.min(prev + 1, initialVideoLoadCount));
  };

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;
  const nextPreviewIndex = (activeIndex % totalVideos) + 1;

  useEffect(() => {
    if (loadedVideos >= initialVideoLoadCount) {
      setLoading(false);
    }
  }, [loadedVideos, initialVideoLoadCount]);

  useEffect(
    () => () => {
      transitionTlRef.current?.kill();
    },
    []
  );

  useGSAP(
    () => {
      if (!frameRef.current || !previewContainerRef.current) return;

      const initialX = (frameRef.current.clientWidth - previewSize) / 2;
      const initialY = (frameRef.current.clientHeight - previewSize) / 2;

      gsap.set(previewContainerRef.current, {
        x: initialX,
        y: initialY,
      });

      movePreviewXToRef.current = gsap.quickTo(previewContainerRef.current, "x", {
        duration: 0.45,
        ease: "power3.out",
      });
      movePreviewYToRef.current = gsap.quickTo(previewContainerRef.current, "y", {
        duration: 0.45,
        ease: "power3.out",
      });
    },
    { scope: heroRef }
  );

  const handleFrameMouseMove = (event) => {
    if (isTransitioning || !frameRef.current || !previewContainerRef.current) return;

    const rect = frameRef.current.getBoundingClientRect();
    const maxX = Math.max(rect.width - previewSize, 0);
    const maxY = Math.max(rect.height - previewSize, 0);

    const targetX = gsap.utils.clamp(
      0,
      maxX,
      event.clientX - rect.left - previewSize / 2
    );
    const targetY = gsap.utils.clamp(
      0,
      maxY,
      event.clientY - rect.top - previewSize / 2
    );

    movePreviewXToRef.current?.(targetX);
    movePreviewYToRef.current?.(targetY);
  };

  const handleMiniVdClick = () => {
    if (
      isTransitioning ||
      !previewCardRef.current ||
      !transitionVideoRef.current ||
      !frameRef.current
    ) {
      return;
    }

    setIsTransitioning(true);

    const previewRect = previewCardRef.current.getBoundingClientRect();
    const frameRect = frameRef.current.getBoundingClientRect();
    const startX = previewRect.left - frameRect.left;
    const startY = previewRect.top - frameRect.top;
    const transitionVideoEl = transitionVideoRef.current;

    transitionTlRef.current?.kill();
    gsap.killTweensOf([transitionVideoEl, previewCardRef.current]);

    gsap.set(transitionVideoEl, {
      autoAlpha: 1,
      x: startX,
      y: startY,
      width: previewRect.width,
      height: previewRect.height,
      borderRadius: 12,
      transformOrigin: "top left",
    });

    transitionVideoEl.currentTime = 0;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onStart: () => {
        gsap.set(previewCardRef.current, { autoAlpha: 0 });
        transitionVideoEl.play().catch(() => {});
      },
      onComplete: () => {
        setActiveIndex(nextPreviewIndex);
        setIsTransitioning(false);

        gsap.set(transitionVideoEl, {
          autoAlpha: 0,
          clearProps:
            "x,y,width,height,borderRadius,transformOrigin,transform",
        });
        gsap.set(previewCardRef.current, {
          clearProps: "scale,autoAlpha,transform,visibility,opacity",
        });
      },
    });

    tl.to(transitionVideoEl, {
      x: 0,
      y: 0,
      width: "100%",
      height: "100%",
      borderRadius: 0,
      duration: 0.95,
    });

    transitionTlRef.current = tl;
  };

  const handleExploreGamesClick = () => {
    navigate("/games");
  };

  useGSAP(
    () => {
      if (!frameRef.current) return;

      gsap.fromTo(
        frameRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          borderRadius: "0% 0% 0% 0%",
        },
        {
          clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
          borderRadius: "0% 0% 40% 10%",
          ease: "none",
          scrollTrigger: {
            trigger: frameRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: heroRef }
  );

  return (
    <div ref={heroRef} className="relative h-dvh w-screen overflow-x-hidden">
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          {/* https://uiverse.io/G4b413l/tidy-walrus-92 */}
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div
        ref={frameRef}
        onMouseMove={handleFrameMouseMove}
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          <div ref={previewContainerRef} className="absolute left-0 top-0 z-50 size-64">
            <VideoPreview>
              <button
                type="button"
                ref={previewCardRef}
                onClick={handleMiniVdClick}
                disabled={isTransitioning}
                className="block size-full overflow-hidden rounded-xl border border-white/20 bg-black/45 p-0 leading-none shadow-[0_18px_45px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-transform duration-500 hover:scale-[1.02] disabled:cursor-wait"
                aria-label="Play next video"
              >
                <video
                  src={getVideoSrc(nextPreviewIndex)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="block size-full object-cover object-center"
                  onLoadedData={handleVideoLoad}
                />
              </button>
            </VideoPreview>
          </div>

          <video
            ref={transitionVideoRef}
            src={getVideoSrc(nextPreviewIndex)}
            loop
            muted
            playsInline
            className="pointer-events-none absolute left-0 top-0 z-30 block size-64 object-cover object-center opacity-0"
            onLoadedData={handleVideoLoad}
          />
          <video
            key={activeIndex}
            src={getVideoSrc(activeIndex)}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 block size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>A</b>MING
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              redefi<b>n</b>e
            </h1>

            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>

            <Button
              id="explore-games"
              title="Explore games"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
              onClick={handleExploreGamesClick}
            />
          </div>
        </div>
      </div>

      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        G<b>A</b>MING
      </h1>
    </div>
  );
};

export default Hero;
