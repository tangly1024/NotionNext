import React from "react";
import ClassicPadding from "./ClassicPadding";
import { RxArrowTopRight } from "react-icons/rx";
import { FaBookOpen } from "react-icons/fa";
import { RiBracesFill, RiSuitcaseFill } from "react-icons/ri";
import { FiLayers } from "react-icons/fi";
import { TbCertificate } from "react-icons/tb";
import { BsPencilFill } from "react-icons/bs";
import BulletPoint from "./BulletPoint";
import CONFIG from '../config'
import CONFIG_EN from '../config_en'

function FAQ(props) {
  const { i18n = 'zh' } = props

  const config = i18n === 'zh' ? CONFIG : CONFIG_EN;
  const leftFaq = config.FAQ_LEFT;
  const rightFaq = config.FAQ_RIGHT;
  
  return (
    <ClassicPadding className={"md:pb-24 pb-15"}>
      <div
        id={"faq"}
        className="text-left md:text-center text-3xl md:text-5xl font-vietnam font-medium tracking-tighter  md:px-0 pt-6 md:pt-20"
      >
        <span style={{ color: "black" }}>FAQ</span>
      </div>

      <div className="flex flex-col md:flex-row justify-around pt-4 md:pt-20 gap-8 md:gap-24">
        <div
          className="gap-8 md:gap-12 flex-col flex"
          style={{ color: "black" }}
        >
          {leftFaq.map((faq, i) => (
            <BulletPoint
              key={i}
              icon={faq.icon}
              header={faq.header}
              subtitle={<span>{faq.subtitle}</span>}
            />
          ))}
        </div>
        <div
          className="gap-8 md:gap-12 flex-col flex"
          style={{ color: "black" }}
        >
          {rightFaq.map((faq, i) => (
            <BulletPoint
              key={i}
              icon={faq.icon}
              header={faq.header}
              subtitle={<span>{faq.subtitle}</span>}
            />
          ))}
        </div>
      </div>
    </ClassicPadding>
  );
}

export default FAQ;
