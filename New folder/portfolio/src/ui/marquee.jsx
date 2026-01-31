"use client";

import { github } from "../assets";
import { cn } from "../lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-2",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[350px] h-[620px] max-w-full shrink-0 rounded-[20px] p-[1px] md:w-[450px] transition-all duration-300 hover:scale-[1.02] flex flex-col"
            style={{
              background: "linear-gradient(135deg, #804dee 0%, #bf61ff 100%)",
              boxShadow: "0px 35px 120px -15px #211e35",
            }}
            key={item.name}
          >
            <div
              className="h-full w-full rounded-[19px] px-8 py-6 flex flex-col"
              style={{ backgroundColor: "#151030" }}
            >
              <blockquote className="h-full flex flex-col justify-between">
                <div className="relative w-full h-[230px] rounded-xl overflow-hidden mb-4">
                  <img
                    src={item.image}
                    alt={item.image}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="relative z-20 text-base leading-relaxed font-normal text-white-100 mb-6 flex-grow h-1/2">
                  {item.quote}
                </p>

                <div className="relative w-full z-20 flex justify-between gap-1 pt-4 border-t border-secondary/10">
                  <span className="text-base font-semibold text-white-100">
                    {item.name}
                  </span>
                  <a
                    href={item.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer w-12 h-12 flex justify-center items-center hover:opacity-80 transition-opacity"
                    title="github button"
                  >
                    <img src={github} alt="github" />
                  </a>
                </div>
              </blockquote>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
