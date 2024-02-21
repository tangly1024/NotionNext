import { RiBracesFill, RiSuitcaseFill } from "react-icons/ri";

import { BsPencilFill } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
import { TbCertificate } from "react-icons/tb";

const CONFIG = {

  HEADER_BUTTON_1_TITLE: '🚀 AI 101',
  HEDEAR_BUTTON_1_URL: '/about',

  HEADER_BUTTON_2_TITLE: '⏰ Daily',
  HEDEAR_BUTTON_2_URL: '/daily',

  HEADER_BUTTON_3_TITLE: '📰 Changelog',
  HEDEAR_BUTTON_3_URL: '/updateLog',

  HEADER_BUTTON_4_TITLE: '💪Contribute',
  HEDEAR_BUTTON_4_URL: '/contribute',

  HEADER_BUTTON_5_TITLE: '🧙About US',
  HEDEAR_BUTTON_5_URL: '/us',

  // 首页大图英雄板块
  HERO_TITLE_1: 'Your CookBook to Become a Pro at Communicating with AI',
  HERO_P_1: '🥳 Explore state-of-the-art technology with our free, open-source curriculum, featuring the TOP8 trending projects each month🎉',
  HERO_BUTTON_1_TEXT: 'Start Learning',
  CATEGORIES: ["ChatGPT", "Midjourney", "Runway", "Agents"],
  CATEGORIES2: ["OpenLLM", "StableDiffusion", "DigitalHuman", "AI Audio"],

  JOIN_1: 'Join Our Community',
  JOIN_2: 'Update your prompting skills',
  JOIN_STATS: [
    {
      header: "70K+",
      subtitle: "People Learning",
    },
    {
      header: "10K+",
      subtitle: "Community Members",
    },
    {
      header: "80+",
      subtitle: "Content Modules",
    },
    {
      header: "10+",
      subtitle: "AIGC Project",
    },
  ],


  HERO_BUTTON_1_LINK: '/about',

  // 特性介绍 Before, it was scattered lessons, chaotic learning paths, and high costs.
  FEATURES_HEADER_1: 'Learning AI is easy',
  FEATURES_HEADER_1_P: "How to master AI technology and become an expert?<br/>Before, it was <strong class='font-bold text-red-500'>scattered</strong> lessons, <strong class='font-bold  text-red-500'>chaotic </strong>learning paths, and <strong class='font-bold text-red-500'>high</strong> costs;<br/>Now, an all-in-one platform <strong class='font-bold text-purple-900 bg-clip-text' style='background-image: linear-gradient(to bottom right, rgb(36,5,80), rgb(108,75,150), rgb(213,189,237)); color: transparent;'>Learn Prompt</strong> is all you need",
  FEATURES_HEADER_2: 'Access Core Advantages',
  FEATURES_CARD_1_TITLE: 'Quick Start',
  FEATURES_CARD_1_P: 'Select your course and embark on your AI journey immediately',
  FEATURES_CARD_2_TITLE: 'Global Network',
  FEATURES_CARD_2_P: 'Connect with international communities for broad AI skill acknowledgment',
  FEATURES_CARD_3_TITLE: 'Evolving Paths',
  FEATURES_CARD_3_P: 'Choose from various themes and levels, always freshly updated',

  FAQ_LEFT: [
    {
      icon: (
        <FaBookOpen className="align-middle inline-block text-dark/500 text-xl" />
      ),
      header: "Is this course free?",
      subtitle:
        "Yes, it is completely free and open source. Everyone can access all the resources on our website for free.",
    },
    {
      icon: (
        <RiBracesFill className="align-middle inline-block text-dark/500 text-xl mt-1" />
      ),
      header: "Do I need to know how to code?",
      subtitle:
        "Not at all! The course is designed to be inclusive, catering to participants with or without a programming background.",
    },
    {
      icon: (
        <TbCertificate className="align-middle inline-block text-dark/500 text-2xl mt-1" />
      ),
      header: "Is learning AI genuinely beneficial? ",
      subtitle:
        "Absolutely. AI is a rapidly evolving field, and having this skill set will open doors for you in various industries. ",
    },
  ],  
  FAQ_RIGHT: [
    {
      icon: (
        <FiLayers className="align-middle inline-block text-dark/500 text-xl mt-1" />
      ),
      header: "Is experience in AI required?",
      subtitle:
        "No, it is not required! Our program will take you through the basics and advanced topics of Artificial Intelligence.",
    },
    {
      icon: (
        <RiSuitcaseFill className="align-middle inline-block text-dark/500 text-2xl mt-1" />
      ),
      header: "Will the course offer certificates?",
      subtitle:
        "We plan to release tutorials to teach you how to get AI certificates from Google, Microsoft and others.",
    },
    {
      icon: (
        <BsPencilFill className="align-middle inline-block text-dark/500 text-xl mt-1" />
      ),
      header: "Can I contribute to this project?",
      subtitle:
      "Yes, we are continually seeking contributors. For more details, Navigate to our website's bottom and click 'Contribute'",
    },
  ],
  START: 'Start Now',
  START_1: "Learn AI for free, for all levels!",

  POST_REDIRECT_ENABLE: process.env.NEXT_PUBLIC_POST_REDIRECT_ENABLE || false, // 是否开启文章地址重定向 ； 用于迁移旧网站域名
  POST_REDIRECT_URL: process.env.NEXT_PUBLIC_POST_REDIRECT_URL || 'https://www.learnprompt.pro', // 重定向网站地址

  NEWSLETTER: process.env.NEXT_PUBLIC_THEME_LANDING_NEWSLETTER || false // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
}
export default CONFIG
