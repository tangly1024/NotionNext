import React from "react";
// import Marquee from "react-fast-marquee";
// import { motion } from "framer-motion";
import StatPoint from "./StatPoint"

import CONFIG from '../config'
import CONFIG_EN from '../config_en'
// import LargeCallout from "@site/src/components/layouts/LargeCallout";
// import Button from "@site/src/components/Button";
// import { RxArrowTopRight } from "react-icons/rx";
// import Arthur from "@site/static/img/arthur_logo.webp";
// import HuggingFace from "@site/static/img/huggingface_logo.webp";
// import HumanLoop from "@site/static/img/humanloop_logo.webp";
// import Preamble from "@site/static/img/preamble_logo.webp";
// import Scale from "@site/static/img/scale_logo.webp";
// import Snorkel from "@site/static/img/snorkel_logo.webp";
// import Stability from "@site/static/img/stability_logo.webp";
// import Towards from "@site/static/img/towards_logo.webp";
// import Trustible from "@site/static/img/trustible_logo.webp";
// import Voiceflow from "@site/static/img/voiceflow_logo.webp";
// import FiscalNote from "@site/static/img/fiscalnote_logo.webp";
// import OpenAI from "@site/static/img/openai_logo.webp";

function Join(props) {
  const { i18n = 'zh' } = props

  const config = i18n === 'zh' ? CONFIG : CONFIG_EN;


  const stats = config.JOIN_STATS;
  

//   const brands = [
//     { name: "Scale", logo: Scale, link: "https://scale.com/" },
//     { name: "OpenAI", logo: OpenAI, link: "https://openai.com/" },
//     { name: "Stability", logo: Stability, link: "https://stability.ai/" },
//     { name: "HuggingFace", logo: HuggingFace, link: "https://huggingface.co/" },
//     { name: "HumanLoop", logo: HumanLoop, link: "https://humanloop.com/" },
//     { name: "Preamble", logo: Preamble, link: "https://www.preamble.com/" },
//     { name: "Voiceflow", logo: Voiceflow, link: "https://www.voiceflow.com/" },
//     { name: "Arthur", logo: Arthur, link: "https://www.arthur.ai/" },
//     { name: "Snorkel", logo: Snorkel, link: "https://snorkel.ai/" },
//     { name: "Towards", logo: Towards, link: "https://towardsai.net/" },
//     { name: "Trustible", logo: Trustible, link: "https://www.trustible.ai/" },
//     { name: "FiscalNote", logo: FiscalNote, link: "https://fiscalnote.com/" },
//   ];

  return (
    <div className="w-screen font-vietnam">
      <div className="text-center text-2xl md:text-5xl font-vietnam font-semibold md:font-medium tracking-tighter px-4 md:px-32 md:pt-15 lg:px-[200px]">
        <span style={{ color: "black" }}>{config.JOIN_1}</span>
        <br />
        <span style={{ color: "black" }}>{
          config.JOIN_2
        }</span>
        {/* <div className="text-center text-default text-sm font-vietnam font-light tracking-tight px-4 md:px-30 lg:px-56 pt-10">
          Become part of a worldwide network of learners from various
          industries, all mastering the skill of effectively engaging with AI
          using our curriculum
        </div> */}
      </div>
      <div className="flex flex-col gap-8 md:gap-0 md:flex-row items-center justify-between px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32 text-transparent bg-clip-text bg-gradient-to-r from-[#005046] to-[#027F75] pt-14 pb-10 max-w-screen-xl mx-auto">
        {stats.map((stat, i) => (
          <StatPoint key={i} header={stat.header} subtitle={stat.subtitle} />
        ))}
      </div>

      {/* <LargeCallout className={"pt-20 tracking-tighter"}>
        <div
          id={"competition"}
          className="flex gap-4 justify-around flex-col md:flex-row"
        >
          <div className="md:w-[45%] md:pl-28 md:ml-12">
            <div className="mt-8 text-4xl tracking-tighter text-center md:text-left">
              <span className="font-bold">HackAPrompt</span> Competition
            </div>
            <div className="opacity-75 font-light pt-8 md:text-left text-center px-4 md:px-0 leading-6">
            We launched the first ever prompt hacking competition designed to enhance AI safety and education by challenging participants to outsmart large language models from May 5th to June 3rd! The competition featured 10 increasingly difficult levels of prompt hacking defenses and the chance to win over $35,000 in prizes!
            </div>
            <div className="flex pt-8 justify-center md:justify-start">
              <a href="https://www.aicrowd.com/challenges/hackaprompt-2023">
                <Button
                  onClick={() =>
                    React.useEffect(() => {
                      window.open(
                        "https://www.aicrowd.com/challenges/hackaprompt-2023",
                        "_blank",
                        "noopener noreferrer"
                      );
                    }, [])
                  }
                  text={"See Results"}
                  type={"white"}
                  icon={
                    <RxArrowTopRight
                      className="inline-block text-green/300"
                      style={{ position: "relative", top: "3px" }}
                    />
                  }
                />
              </a>
            </div>
          </div>
          <div
            className="w-[550px] h-[325px] mr-[-100px] md:flex hidden"
            style={{ paddingTop: "20px", marginTop: "-20px" }}
          >
            <img
              src={require("@site/static/img/lock.webp").default}
              alt="Example banner"
            />
          </div>
        </div>
        <div className="pt-20">
          <div style={{ touchAction: "none" }}>
            <Marquee gradient={false} speed={30}>
              {brands.map((brand, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className="mx-4 flex items-center"
                >
                  <a
                    href={brand.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="w-40 h-20 md:w-48 md:h-24 flex items-center justify-center">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="object-contain"
                        style={
                          brand.name === "Scale"
                            ? { width: "80%", height: "80%" }
                            : {}
                        }
                      />
                    </div>
                  </a>
                </motion.div>
              ))}
            </Marquee>
          </div>
          <div className="text-center opacity-80 font-medium pt-4 pb-8 text-xs md:text-lg">
            Proudly Sponsored by Industry-Leading AI Companies
          </div>
        </div>
      </LargeCallout> */}
    </div>
  );
}

export default Join;