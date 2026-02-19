import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import Button from "./Button";
import AnimatedTitle from "./AnimatedTitle";

const FloatingImage = () => {
  const frameRef = useRef(null);
  const rotateXToRef = useRef(null);
  const rotateYToRef = useRef(null);

  useGSAP(
    () => {
      if (!frameRef.current) return;

      gsap.set(frameRef.current, {
        transformPerspective: 700,
        transformStyle: "preserve-3d",
        willChange: "transform",
      });

      rotateXToRef.current = gsap.quickTo(frameRef.current, "rotationX", {
        duration: 0.35,
        ease: "power3.out",
      });
      rotateYToRef.current = gsap.quickTo(frameRef.current, "rotationY", {
        duration: 0.35,
        ease: "power3.out",
      });
    },
    { scope: frameRef }
  );

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const relativeX = (xPos - centerX) / centerX;
    const relativeY = (yPos - centerY) / centerY;

    const clampedX = gsap.utils.clamp(-1, 1, relativeX);
    const clampedY = gsap.utils.clamp(-1, 1, relativeY);

    rotateXToRef.current?.(-clampedY * 10);
    rotateYToRef.current?.(clampedX * 10);
  };

  const handleMouseLeave = () => {
    rotateXToRef.current?.(0);
    rotateYToRef.current?.(0);
  };

  return (
    <div id="story" className="min-h-dvh w-screen bg-black text-blue-50">
      <div className="flex size-full flex-col items-center py-10 pb-24">
        <p className="font-general text-sm uppercase md:text-[10px]">
          the multiversal ip world
        </p>

        <div className="relative size-full">
          <AnimatedTitle
            title="the st<b>o</b>ry of <br /> a hidden real<b>m</b>"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10"
          />

          <div className="story-img-container">
            <div className="story-img-mask">
              <div className="story-img-content">
                <img
                  ref={frameRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseLeave}
                  src="/img/entrance.webp"
                  alt="entrance.webp"
                  className="object-contain"
                />
              </div>
            </div>

            {/* for the rounded corner */}
            <svg
              className="invisible absolute size-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="flt_tag">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="8"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                    result="flt_tag"
                  />
                  <feComposite
                    in="SourceGraphic"
                    in2="flt_tag"
                    operator="atop"
                  />
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        <div className="-mt-80 flex w-full justify-center md:-mt-64 md:me-44 md:justify-end">
          <div className="flex h-full w-fit flex-col items-center md:items-start">
            <p className="mt-3 max-w-sm text-center font-circular-web text-violet-50 md:text-start">
              Where realms converge, lies Zentry and the boundless pillar.
              Discover its secrets and shape your fate amidst infinite
              opportunities.
            </p>

            <Button
              id="realm-btn"
              title="discover prologue"
              containerClass="mt-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingImage;
