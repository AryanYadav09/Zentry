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
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = 4;
  const initialVideoLoadCount = 3;
  const heroRef = useRef(null);
  const frameRef = useRef(null);
  const nextVideoRef = useRef(null);
  const currentVideoRef = useRef(null);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => Math.min(prev + 1, initialVideoLoadCount));
  };

  useEffect(() => {
    if (loadedVideos >= initialVideoLoadCount) {
      setLoading(false);
    }
  }, [loadedVideos, initialVideoLoadCount]);

  const handleMiniVdClick = () => {
    setHasClicked(true);

    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  const handleExploreGamesClick = () => {
    navigate("/games");
  };

  useGSAP(
    () => {
      if (!hasClicked || !nextVideoRef.current || !currentVideoRef.current) {
        return;
      }

      gsap.killTweensOf([nextVideoRef.current, currentVideoRef.current]);

      const transitionTl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
      });

      transitionTl
        .set(nextVideoRef.current, {
          autoAlpha: 1,
          scale: 0.7,
          transformOrigin: "center center",
        })
        .to(nextVideoRef.current, {
          width: "100%",
          height: "100%",
          scale: 1,
          duration: 0.9,
          onStart: () => {
            nextVideoRef.current?.play()?.catch(() => {});
          },
        })
        .fromTo(
          currentVideoRef.current,
          { scale: 1, transformOrigin: "center center" },
          { scale: 0, duration: 0.9 },
          0
        );
    },
    {
      scope: heroRef,
      dependencies: [currentIndex, hasClicked],
      revertOnUpdate: true,
    }
  );

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

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

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
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <VideoPreview>
              <div
                onClick={handleMiniVdClick}
                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
              >
                <video
                  ref={currentVideoRef}
                  src={getVideoSrc((currentIndex % totalVideos) + 1)}
                  loop
                  muted
                  className="size-64 origin-center scale-150 object-cover object-center"
                  onLoadedData={handleVideoLoad}
                />
              </div>
            </VideoPreview>
          </div>

          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            className="absolute-center absolute z-20 size-64 object-cover object-center opacity-0"
            onLoadedData={handleVideoLoad}
          />
          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
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
