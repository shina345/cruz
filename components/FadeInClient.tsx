"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FadeInClient() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const initAnimations = () => {
      // Find all uninitialized .fade-in-up elements
      const fadeElements = document.querySelectorAll(".fade-in-up:not([data-gsap-animated])");
      fadeElements.forEach((element: any) => {
        element.setAttribute("data-gsap-animated", "true");
        gsap.fromTo(
          element,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Find all uninitialized .parallax-img elements
      const parallaxElements = document.querySelectorAll(".parallax-img:not([data-gsap-parallax])");
      parallaxElements.forEach((img: any) => {
        img.setAttribute("data-gsap-parallax", "true");
        gsap.fromTo(
          img,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    };

    // Initial run
    initAnimations();

    // Setup mutation observer to watch for dynamic DOM additions
    const observer = new MutationObserver(() => {
      initAnimations();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
