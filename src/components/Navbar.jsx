import clsx from "clsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useMemo, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import { auth } from "../lib/firebase";
import Button from "./Button";

const baseNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Games", href: "/games" },
  { label: "Contact", href: "/#contact" },
];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  useEffect(() => {
    if (!auth) return undefined;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const navItems = useMemo(() => {
    if (currentUser) return baseNavItems;
    return [...baseNavItems, { label: "Login", href: "/login" }];
  }, [currentUser]);

  const profileLabel =
    currentUser?.displayName?.trim()?.[0] ||
    currentUser?.email?.trim()?.[0] ||
    "U";

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
  };

  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    if (isAudioPlaying) {
      audio.play().catch(() => {
        setIsAudioPlaying(false);
      });
      return;
    }

    audio.pause();
  }, [isAudioPlaying]);

  useGSAP(
    () => {
      if (!navContainerRef.current) return;

      gsap.set(navContainerRef.current, { y: 0, autoAlpha: 1 });

      const onScroll = () => {
        const currentY = window.scrollY || window.pageYOffset || 0;
        navContainerRef.current.classList.toggle("floating-nav", currentY > 8);
      };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    },
    { scope: navContainerRef }
  );

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-10" />

            <Button
              id="product-button"
              title="Products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>

          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => (
                <a key={index} href={item.href} className="nav-hover-btn">
                  {item.label}
                </a>
              ))}
            </div>

            {currentUser && (
              <div className="ml-6 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="size-9 rounded-full border border-white/30 bg-white/10 text-sm uppercase text-white"
                  title={`Signed in as ${
                    currentUser.email || currentUser.phoneNumber || "user"
                  }. Click to sign out.`}
                >
                  {profileLabel}
                </button>
              </div>
            )}

            <button
              onClick={toggleAudioIndicator}
              className="ml-4 flex items-center space-x-0.5"
              aria-label="toggle background audio"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isAudioPlaying,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
