import React from "react";
import { motion } from "framer-motion";
import { styles } from "../utils/styles";
import { fadeIn, textVariant, staggerContainer } from "../utils/motion";
import { services } from "../utils";
import { GlareCard } from "../ui/glare-card";
import { sectionWrapper } from "../HOC/section-wrapper";

export function GlareCardDemo({ service  , index}) {
  return (
    <GlareCard  
      variants={fadeIn("right" , "spring" , 0.3 * index, 1)} 
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="flex flex-col items-center justify-center shadow-card "
    >
      <img src={service.icon} alt={service.title} height={100} width={100} />
      <p className="mx-4 text-white font-bold text-xl mt-4 ">{service.title}</p>
    </GlareCard>
  );
}

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <p className={styles.sectionHeadText}>OverView.</p>
      </motion.div>

      <motion.p variants={textVariant()} className="text-secondary text-[17px] max-w-3xl mt-4 leading-[30px]">
        {" "}
        I'm a passionate software developer with strong experience in
        JavaScript, TypeScript, and Java, specializing in modern frameworks like
        React, Next.js, Node.js, Spring Boot, and Three.js. I enjoy building
        fast, scalable, and user-friendly applications that solve real-world
        problems. As a quick learner and collaborative team player, I work
        closely with clients and teams to turn ideas into reliable, high-impact
        digital solutions. Let’s create something amazing together!
      </motion.p>

      <motion.div 
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="flex flex-wrap gap-10 mt-1.5 xl:flex-row mt-7 "
      >
        {services.map((service, index) => (
          <GlareCardDemo key={index} service={service} index={index}/>
        ))}
      </motion.div>
    </>
  );
};

const AboutSection = sectionWrapper(About, "about");
export default AboutSection;
