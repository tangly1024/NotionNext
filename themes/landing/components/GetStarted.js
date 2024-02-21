import Button from "./Button";
import CONFIG from '../config'
import CONFIG_EN from '../config_en'
import ClassicPadding from "./ClassicPadding";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import React from "react";
import { RxArrowTopRight } from "react-icons/rx";

function GetStarted(props) {
  const { i18n = 'zh' } = props

  const config = i18n === 'zh' ? CONFIG : CONFIG_EN;

  return (
    <ClassicPadding className="flex flex-col md:flex-row gap-4 justify-between items-center pt-0 md:pt-24 pb-10 md:pb-24">
      <div className="items-center md:w-[60%]">
        <div className="text-center md:text-left text-5xl md:text-7xl font-vietnam font-medium tracking-tighter pt-16">
            <span style={{ color: "black", letterSpacing: "0.01em" }}>{config.START}</span>
          <div className="text-center md:text-left text-default text-2xl font-vietnam font-light tracking-tight pt-6 px-12 md:px-0">
          {config.START_1}
          </div>
          <div className="flex justify-center md:justify-start pt-8 text-[1rem] tracking-tighter mb-12 mt-1">
            <Button
              onClick={() => {
                window.location.replace("/about");
              }}
                text={"Get Started"}
                icon={
                  <RxArrowTopRight
                    className="inline-block text-white"
                    style={{ verticalAlign: "middle" }}
                  />
                }
              />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center">
        <LazyLoadImage
          src={"/images/Hi.webp"} 
          className="mx-auto md:ml-[80px] md:h-auto h-[300px]"
        />
      </div>
    </ClassicPadding>
  );
}

export default GetStarted;
