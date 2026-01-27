import Spline from "@splinetool/react-spline";
import { BallCanvas } from "./canvas";
import { technologies } from "../utils";
import { sectionWrapper } from "../HOC/section-wrapper";

export function Tech() {
  return (
    <div className="w-full h-full flex flex-wrap gap-20 justify-center mt-4">
      {technologies.map((tech) => (
        <div className="w-28 h-28" key={tech.name}>
          <BallCanvas icon={tech.icon} />
        </div>
      ))}
    </div>
  );
}
const TechWrapper = sectionWrapper(Tech, "technology");
export default TechWrapper;
