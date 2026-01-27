import React from "react";
import { textVariant } from "../utils/motion";
import { styles } from "../utils/styles";
import { sectionWrapper } from "../HOC/section-wrapper";
import { motion } from "framer-motion";
import { IconMoped } from "@tabler/icons-react";
import { github } from "../assets";
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
         
        }
      </div>
    </>
  );
};


const WorkWrapper = sectionWrapper(Works, "work");

export default WorkWrapper;
