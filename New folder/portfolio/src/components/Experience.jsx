import React from "react";
import { Timeline } from "../ui/timeline";
import { sectionWrapper } from "../HOC/section-wrapper";
const Experience = () => {
  return <TimelineDemo />;
};

export function TimelineDemo() {
  const data = [
    {
      title: "Vesit Railway",
      content: (
        <div>
          <h1 className="font-bold text-xl mb-2">Full Stack Developer</h1>
          <p className="mb-8 text-xs  md:text-[17px] leading-[28px] dark:text-neutral-200 ">
            Built and launched VESIT Railway from scratch for our College
            <span>June 2025 – present </span>
            <br />
            ● System Modernization: Involved in migration of a legacy railway
            management system from PHP to Next.js, significantly improving
            maintainability, scalability, and performance, and aligning it with
            contemporary web standards.
            <br />
            ● Performance Optimization: Analyzed and refactored backend queries,
            optimizing database indexing, leading to a 5x acceleration in system
            performance and reduced load times.
            <br />
            ●User Experience Enhancement: Redesigned and streamlined APIs with
            advanced data fetching strategies, mitigating UI latency for
            schedule and ticket modules, resulting in a smoother user experience
            and reduced student wait time by 60%
          </p>
          <div className="w-full">
            <img
              src="/vesit/home.png"
              alt="startup template"
              className="w-full rounded-lg object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <img
              src="/vesit/image.png"
              alt="startup template"
              className="w-full mt-4 mb-1 rounded-lg object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Star Union Dai-ichi Life Insurance",
      content: (
        <div>
          <h1 className="font-bold text-xl mb-2">
            Full Stack Developer Intern
          </h1>
          <p className="mb-8 text-xs md:text-[17px] leading-[28px] dark:text-neutral-200">
            Built an Internal Communication Platform
            <span>February 2026 – July 2026</span>
            <br />
            ● Designed and developed a company-wide internal communication tool
            using the MERN stack (MongoDB, Express, React, Node.js) to
            streamline team collaboration.
            <br />
            ● Implemented real-time messaging, role-based access control, and
            secure authentication to improve internal workflow efficiency.
            <br />● Optimized backend APIs and frontend performance to ensure
            fast response times and smooth user experience across departments.
          </p>
        </div>
      ),
    },
    {
      title: "Zemo Technologies",
      content: (
        <div>
          <h1 className="font-bold text-xl mb-2">Frontend Developer</h1>
          <p className="mb-8 text-xs  md:text-[17px] leading-[28px] dark:text-neutral-200 ">
            Built An AI Scoring System
            <span>June 2025 – September 2025 </span>
            <br />
            ● Working on developing an AI-powered automatic scoring system for
            8-Ball Pool, enabling real-time detection and scoring of player
            actions.
            <br />
            ● Integrated React-based frontend with AI model APIs, improving live
            scoreboard updates and game analytics.
            <br />
            ●Optimized UI responsiveness and data handling for seamless in-game
            user experience, ensuring latency under 200ms.
          </p>
        </div>
      ),
    },

  
  ];
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
const ExperienceSection = sectionWrapper(Experience, "experience");
export default ExperienceSection;
