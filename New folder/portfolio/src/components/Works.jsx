import React from "react";
import { textVariant } from "../utils/motion";
import { styles } from "../utils/styles";
import { sectionWrapper } from "../HOC/section-wrapper";
import { motion } from "framer-motion";
import { IconMoped } from "@tabler/icons-react";
import { github } from "../assets";
import { InfiniteMovingCards } from "../ui/marquee";
import { projects } from "../utils";
const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Turning Ideas Into Reality</p>
        <p className={styles.sectionHeadText}>My Creations.</p>
      </motion.div>

      <motion.p
        variants={textVariant()}
        className="text-secondary text-[17px] max-w-3xl mt-4 leading-[30px]"
      >
        {" "}
        These projects highlight my skills and hands-on experience through
        real-world applications. Each project includes a brief overview along
        with links to the source code and live demos. Together, they showcase my
        ability to solve complex problems, adapt to new technologies, and build
        scalable, efficient solutions.
      </motion.p>

      <div className="flex flex-wrap gap-10 mt-1.5 xl:flex-row mt-7 ">
        {
          /* {services.map((service, index) => (
          <GlareCardDemo key={index} service={service} index={index}/>
        ))} */
         <InfiniteMovingCardsDemo />
        }
      </div>
    </>
  );
};



export function InfiniteMovingCardsDemo() {
  return (
    <div
      className="rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden ">
      <InfiniteMovingCards items={projects} direction="right" speed="normal" />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "An offline-first payment platform that allows users to send and verify transactions without internet access. Uses React PWA, AES encryption, SMS-based communication via Twilio, and a Spring Boot backend to ensure secure and reliable payment processing with multi-language support.",
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "William Shakespeare",
    title: "Hamlet",
  },
  {
    quote: "All that we see or seem is but a dream within a dream.",
    name: "Edgar Allan Poe",
    title: "A Dream Within a Dream",
  },
  {
    quote:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    name: "Jane Austen",
    title: "Pride and Prejudice",
  },
  {
    quote:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    name: "Herman Melville",
    title: "Moby-Dick",
  },
];

const WorkWrapper = sectionWrapper(Works, "work");

export default WorkWrapper;
