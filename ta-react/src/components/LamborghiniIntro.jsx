import { useEffect, useRef } from "react";
import gsap from "gsap";
import goldenLamboLogo from "../assets/golden_lambo_logo.png";

export default function LamborghiniIntro({ onComplete }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const logoRef = useRef(null);
  const taglineRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const letters = titleRef.current?.querySelectorAll(".intro-letter");
    
    // Set initial states via GSAP
    gsap.set(containerRef.current, { opacity: 1 });
    gsap.set(logoRef.current, { scale: 0, opacity: 0, rotationY: -180 });
    if (letters && letters.length > 0) {
      gsap.set(letters, { opacity: 0, y: 60, rotateX: -90, scale: 0.8 });
    }
    gsap.set(taglineRef.current, { opacity: 0, y: 15, letterSpacing: "0.4em" });
    gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: "left center" });

    // Timeline animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Exit animation (silky smooth fade-out and slide-up)
        gsap.to(containerRef.current, {
          opacity: 0,
          y: -50,
          duration: 0.8,
          ease: "power4.inOut",
          onComplete: () => {
            onComplete?.();
          }
        });
      }
    });

    // Step A: Logo scales and rotates in
    tl.to(logoRef.current, {
      scale: 1,
      opacity: 1,
      rotationY: 0,
      duration: 1.2,
      ease: "power4.out"
    });

    // Step B: Staggered text entry for "Trust Autopilot"
    if (letters && letters.length > 0) {
      tl.to(letters, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.05,
        ease: "back.out(1.5)"
      }, "-=0.7");
    }

    // Step C: Tagline fades, slides up, and letter spacing tightens
    tl.to(taglineRef.current, {
      opacity: 1,
      y: 0,
      letterSpacing: "0.25em",
      duration: 1,
      ease: "power3.out"
    }, "-=0.5");

    // Step D: Thin golden progress line grows smoothly to 100%
    tl.to(progressBarRef.current, {
      scaleX: 1,
      duration: 1.8,
      ease: "power2.inOut"
    }, "-=0.9");

    // Step E: Slight delay at 100% progress before exiting
    tl.to({}, { duration: 0.3 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  const titleText = "Trust Autopilot";
  const letters = titleText.split("");

  return (
    <div className="lambo-intro" ref={containerRef}>
      <div className="intro-container">
        
        {/* Textless luxury logo emblem */}
        <div className="intro-logo-wrap" ref={logoRef}>
          <img
            src={goldenLamboLogo}
            alt="Trust Autopilot Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Dynamic staggered split-text title */}
        <div className="intro-title" ref={titleRef}>
          {letters.map((char, index) => (
            <span key={index} className="intro-letter">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* Subtitle / Tagline */}
        <div className="intro-tagline" ref={taglineRef}>
          Verified Automotive Marketplace
        </div>

        {/* Modern thin progress bar */}
        <div className="intro-progress-track">
          <div className="intro-progress-bar" ref={progressBarRef} />
        </div>

      </div>
    </div>
  );
}