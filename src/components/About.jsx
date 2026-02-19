import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const aboutRef = useRef(null);
  const clipRef = useRef(null);
  const imageMaskRef = useRef(null);

  useGSAP(
    () => {
      if (!clipRef.current || !imageMaskRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.to(imageMaskRef.current, {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          ease: "none",
          scrollTrigger: {
            trigger: clipRef.current,
            start: "top top",
            end: "+=1200",
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.to(imageMaskRef.current, {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          ease: "none",
          scrollTrigger: {
            trigger: clipRef.current,
            start: "top 75%",
            end: "bottom top",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: aboutRef }
  );

  return (
    <div ref={aboutRef} id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to Zentry
        </p>

        <AnimatedTitle
          title="Disc<b>o</b>ver the world's <br /> largest shared <b>a</b>dventure"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p>The Game of Games begins - your life, now an epic MMORPG</p>
          <p className="text-gray-500">
            Zentry unites every player from countless games and platforms, both
            digital and physical, into a unified Play Economy
          </p>
        </div>
      </div>

      <div ref={clipRef} className="h-dvh w-screen" id="clip">
        <div ref={imageMaskRef} className="mask-clip-path about-image">
          <img
            src="img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
