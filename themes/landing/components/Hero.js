import React, { useEffect, useMemo } from "react";

import Button from "./Button";
import ButtonField from "./ButtonField";
import CONFIG from '../config'
import CONFIG_EN from '../config_en'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { RxArrowTopRight } from "react-icons/rx";

// import BeginnerWeb from "../images/beginnerweb.webp";
// import IntermediateWeb from "images/intermediateweb.webp";
// import AdvancedWeb from "images/advancedweb.webp";
// import ApplicationsWeb from "images/applicationsweb.webp";

// import BeginnerMobile from "images/beginnermobile.webp";
// import IntermediateMobile from "images/intermediatemobile.webp";
// import AdvancedMobile from "images/advancedmobile.webp";
// import ApplicationsMobile from "images/applicationsmobile.webp";

// import "public/css/index.css";

function Hero(props) {
  const { i18n = 'zh' } = props

  const config = i18n === 'zh' ? CONFIG : CONFIG_EN;

  const categories =config.CATEGORIES;
  const categories2 = config.CATEGORIES2;
  const [activeCategory, setActiveCategory] = React.useState("ChatGPT");

  const x_pos = React.useMemo(() => {
    switch (activeCategory) {
      case "ChatGPT":
        return "left-1";
      case "Midjourney":
        return "left-2";
      case "Runway":
        return "left-3";
      case "Agents":
        return "left-4";
      case "OpenLLM":
        return "left-5";
      case "StableDiffusion":
        return "left-6";
      case "DigitalHuman":
        return "left-7";
      case "AI Audio":
        return "left-8";
    }
  }, [activeCategory]);

  const x_pos_mob = React.useMemo(() => {
    switch (activeCategory) {
      case "ChatGPT":
        return "left-1";
      case "Midjourney":
        return "left-2";
      case "Runway":
        return "left-3";
      case "Agents":
        return "left-4";
      case "OpenLLM":
        return "left-5";
      case "StableDiffusion":
        return "left-6";
      case "DigitalHuman":
        return "left-7";
      case "AI Audio":
        return "left-8";
    }
  }, [activeCategory]);

  return (
    <div style={{ maxWidth: "100vw", overflow: "hidden",  marginTop: "70px" }}>
      <div className={"pb-10 px-4 md:px-20 lg:px-56 2xl:px-96"}>
        <div
          className="mt-14 text-center text-3xl md:text-7xl font-vietnam md:font-medium font-semibold tracking-tighter lg:px-8 2xl:px-32 pt-2"
          style={{ color: "black" }}
        >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 md:text-6xl text-5xl"
              style={{
                backgroundImage: 'linear-gradient(to bottom right, rgb(36,5,80), rgb(108,75,150), rgb(213,189,237))'
              }}
            
            >{config.HERO_TITLE_1}</span>
        </div>
        <div className="text-center text-default text-sm font-vietnam font-light tracking-wider px-4 md:px-10 lg:px-20 xl:px-60 pt-6">
          {config.HERO_P_1}
        </div>
        {/* <div>
          <p className="text-xl text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">{config.HERO_P_1}</p>
        </div> */}
        <div className="flex items-center justify-center pt-6">
          <Button
            onClick={() => {
              window.location.replace("/about");
            }}
              text={"Learn Prompt"}
              icon={
                <RxArrowTopRight
                  className="inline-block text-white"
                  style={{ verticalAlign: "middle" }}
                />
              }
            />  
        </div>
        <div className="flex flex-col items-center pt-16 z-10 overflow-hidden md:overflow-visible">
          <div
            className="flex flex-row flex-wrap gap-4 md:gap-4 justify-center z-[2]"
            style={{ color: "black" }}
          >
            {categories.map((category, i) => (
              <ButtonField
                key={i}
                text={category}
                isActive={category == activeCategory}
                onClick={() => setActiveCategory(category)}
                customStyle={
                  category === "StableDiffusion"
                    ? "bg-yellow-500"
                    : category === "Runway"
                      ? "bg-red-500"
                      : category === "Agents"
                        ? "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"
                        : ""
                }
              />
            ))}

          </div>
          <div
            className="flex flex-row flex-wrap gap-4 md:gap-4 justify-center z-[2] mt-5"
            style={{ color: "black" }}
          >
          {categories2.map((category, i) => (
              <ButtonField
                key={i}
                text={category}
                isActive={category == activeCategory}
                onClick={() => setActiveCategory(category)}
                customStyle={
                  category === "OpenLLM"
                    ? "bg-yellow-500"
                    : category === "DigitalHuman"
                      ? "bg-red-500"
                      : category === "AI Audio"
                        ? "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"
                        : ""
                }
              />
            ))}
          </div>
          <div className="relative hidden md:flex web_lazy">
            <div
              className={`mt-[-25px] top-0 hidden md:flex border-black transition-all ${x_pos}`}
            >
              <img src={"/images/gptweb.webp"} alt="Beginner Web"/>
              <img src={"/images/mjweb.webp"} alt="Intermediate Web" />
              <img src={"/images/runwayweb.webp"} alt="Advanced Web" />
              <LazyLoadImage src={"/images/agentweb.webp"} alt="Applications Web" />
              <img src={"/images/llmweb.webp"} alt="Beginner Web"/>
              <img src={"/images/sdweb.webp"} alt="Intermediate Web" />
              <img src={"/images/heygenweb.webp"} alt="Advanced Web" />
              <LazyLoadImage src={"/images/audioweb.webp"} alt="Applications Web" />
            </div>
          </div>

          <div className="relative  md:hidden flex mobile_lazy">
            <div
              className={
                "left-0 top-0 h-full flex flex-row transition-all " +
                x_pos_mob
              }
            >
              <img src={"/images/gptmobile.webp"} alt="Beginner Mobile" width={"100%"}/>
              <img src={"/images/mjmobile.webp"} alt="Intermediate Mobile" />
              <img src={"/images/runwaymobile.webp"} alt="Advanced Mobile" />
              <LazyLoadImage src={"/images/agentmobile.webp"} alt="Applications Mobile"/>
              <img src={"/images/llmmobile.webp"} alt="Beginner Mobile" width={"100%"}/>
              <img src={"/images/sdmobile.webp"} alt="Intermediate Mobile" />
              <img src={"/images/heygenmobile.webp"} alt="Advanced Mobile" />
              <LazyLoadImage src={"/images/audiomobile.webp"} alt="Applications Mobile"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
