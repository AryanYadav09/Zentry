import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const MAX_TRANSLATE = 16;
const MAX_ROTATE = 8;

export const VideoPreview = ({ children }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  const moveXToRef = useRef(null);
  const moveYToRef = useRef(null);
  const rotateXToRef = useRef(null);
  const rotateYToRef = useRef(null);
  const contentXToRef = useRef(null);
  const contentYToRef = useRef(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !contentRef.current) return;

      gsap.set(sectionRef.current, {
        transformPerspective: 600,
        transformStyle: "preserve-3d",
        willChange: "transform",
      });
      gsap.set(contentRef.current, {
        transformStyle: "preserve-3d",
        willChange: "transform",
      });

      moveXToRef.current = gsap.quickTo(sectionRef.current, "x", {
        duration: 0.35,
        ease: "power3.out",
      });
      moveYToRef.current = gsap.quickTo(sectionRef.current, "y", {
        duration: 0.35,
        ease: "power3.out",
      });
      rotateXToRef.current = gsap.quickTo(sectionRef.current, "rotationX", {
        duration: 0.35,
        ease: "power3.out",
      });
      rotateYToRef.current = gsap.quickTo(sectionRef.current, "rotationY", {
        duration: 0.35,
        ease: "power3.out",
      });
      contentXToRef.current = gsap.quickTo(contentRef.current, "x", {
        duration: 0.4,
        ease: "power3.out",
      });
      contentYToRef.current = gsap.quickTo(contentRef.current, "y", {
        duration: 0.4,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const rect = currentTarget.getBoundingClientRect();

    const relativeX = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relativeY =
      (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    const clampedX = gsap.utils.clamp(-1, 1, relativeX);
    const clampedY = gsap.utils.clamp(-1, 1, relativeY);

    const offsetX = clampedX * MAX_TRANSLATE;
    const offsetY = clampedY * MAX_TRANSLATE;

    moveXToRef.current?.(offsetX);
    moveYToRef.current?.(offsetY);
    rotateYToRef.current?.(clampedX * MAX_ROTATE);
    rotateXToRef.current?.(-clampedY * MAX_ROTATE);

    // Opposing inner motion creates a subtle parallax depth effect.
    contentXToRef.current?.(-offsetX * 0.6);
    contentYToRef.current?.(-offsetY * 0.6);
  };

  const handleMouseLeave = () => {
    moveXToRef.current?.(0);
    moveYToRef.current?.(0);
    rotateXToRef.current?.(0);
    rotateYToRef.current?.(0);
    contentXToRef.current?.(0);
    contentYToRef.current?.(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute z-50 size-full overflow-hidden rounded-lg"
    >
      <div ref={contentRef} className="origin-center rounded-lg">
        {children}
      </div>
    </section>
  );
};

export default VideoPreview;
