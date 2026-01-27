import React from "react";
import { styles } from "../utils/styles";
import { ComputersCanvas } from "./canvas";
import { motion } from "framer-motion";
import * as THREE from "three";
const Hero = () => {
  return (
    <section>
      <div className="relative h-screen w-full mx-auto ">
        <div
          className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl flex flex-row items-start gap-5`}
        >
          {" "}
          <div className="flex flex-col justify-center items-center mt-5 lg:ml-20">
            <div className="w-5 h-5 rounded-full bg-[#804dee]" />
            <div className="w-1 sm:h-80 h-40 violet-gradient " />
          </div>
          <div>
            <h1 className={`${styles.heroHeadText} text-white`}>
              Hi , I'am <span className=" text-[#804dee]">Afnan Kazi </span>
            </h1>
            <p className={`${styles.heroSubText} mt-2 text-white-100 `}>
              Creating Cool Applications That Actually Make an Impact
            </p>
          </div>
        </div>
        <ComputersCanvas />

        <div className="absolute xs:bottom-10 bottom-35 flex justify-center items-center w-full">
          <a href="#about">
            <div className="w-[34px] h-[64px] border-secondary border-4  rounded-3xl flex justify-center items-start p-2">
              <motion.div
                animate={{ y: [0,24,0] }}
                transition={{  duration:1.5 , repeat:Infinity , repeatType:"loop" }}
                className="w-[10px] h-[10px] bg-secondary rounded-full  "
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
