import { RiBracesFill, RiSuitcaseFill } from "react-icons/ri";

import { BsPencilFill } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
import { TbCertificate } from "react-icons/tb";

const CONFIG = {

  HEADER_BUTTON_1_TITLE: '🚀 AI 101',
  HEDEAR_BUTTON_1_URL: '/about',

  HEADER_BUTTON_2_TITLE: '⏰ 每日精选',
  HEDEAR_BUTTON_2_URL: '/daily',

  HEADER_BUTTON_3_TITLE: '📰 更新日志',
  HEDEAR_BUTTON_3_URL: '/updateLog',

  HEADER_BUTTON_4_TITLE: '💪 共创',
  HEDEAR_BUTTON_4_URL: '/contribute',

  HEADER_BUTTON_5_TITLE: '🧙关于我们',
  HEDEAR_BUTTON_5_URL: '/us',

  // 首页大图英雄板块
  HERO_TITLE_1: 'Your CookBook to Become a Pro at Communicating with AI',
  HERO_P_1: "🥳 加入我们的免费开源课程，深入了解最先进的AIGC技术，每月为您呈现8个精选热门AI项目🎉",
  HERO_BUTTON_1_TEXT: 'Start Learning',
  CATEGORIES: ["ChatGPT", "Midjourney", "Runway", "Agents"],
  CATEGORIES2: ["OpenLLM", "StableDiffusion", "DigitalHuman", "AI Audio"],

  JOIN_1: '加入我们的社区',
  JOIN_2: '成为 Prompt Engineering 专家',
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
  FEATURES_HEADER_1: '轻松学习AI技术',
  FEATURES_HEADER_1_P: "如何掌握AI技术成为行业专家？<br/>从过去<strong class='font-bold text-red-500'>零散</strong>的课程, <strong class='font-bold  text-red-500'>混乱</strong>的学习路径和<strong class='font-bold text-red-500'>高昂</strong>的成本;<br/>现在只需一个一站式平台 <strong class='font-bold text-purple-900 bg-clip-text' style='background-image: linear-gradient(to bottom right, rgb(36,5,80), rgb(108,75,150), rgb(213,189,237)); color: transparent;'>Learn Prompt</strong> is all you need",
  FEATURES_HEADER_2: '三大核心优势',
  FEATURES_CARD_1_TITLE: '快速入门',
  FEATURES_CARD_1_P: '选择一门您喜欢的课程，建立学习体系，立即开始您的人工智能之旅',
  FEATURES_CARD_2_TITLE: '全球化社区',
  FEATURES_CARD_2_P: '加入我们，与更多社区建立联系！让您的AI技能得到广泛认可和提升',
  FEATURES_CARD_3_TITLE: '持续更新',
  FEATURES_CARD_3_P: '快速追踪热门AI产品，分级打造教学课程，享受持续更新的最新内容',
  
  FAQ_LEFT: [
    {
      icon: (
        <FaBookOpen className="align-middle inline-block text-dark/500 text-xl" />
      ),
      header: "该课程是免费的吗？",
      subtitle:
        "它是完全免费和开源的。每个人都可以免费访问我们网站上的所有资源。",
    },
    {
      icon: (
        <RiBracesFill className="align-middle inline-block text-dark/500 text-xl mt-1" />
      ),
      header: "我需要有编程能力吗？",
      subtitle:
        "完全不需要！课程的设计具有包容性，无论学员是否具有编程背景，都可以参加。",
    },
    {
      icon: (
        <TbCertificate className="align-middle inline-block text-dark/500 text-2xl mt-1" />
      ),
      header: "学习人工智能真的有用吗？",
      subtitle:
        "当然！人工智能是一个快速发展的领域，掌握这项技能将为您打开各行各业的大门。",
    },
  ],  
  FAQ_RIGHT: [
    {
      icon: (
        <FiLayers className="align-middle inline-block text-dark/500 text-xl mt-1" />
      ),
      header: "需要人工智能方面的经验吗？",
      subtitle:
        "不需要！我们的课程将带您了解人工智能的基础知识和高级技巧。",
    },
    {
      icon: (
        <RiSuitcaseFill className="align-middle inline-block text-dark/500 text-2xl mt-1" />
      ),
      header: "课程是否提供证书？",
      subtitle:
        "我们计划发布教程，教您如何从谷歌、微软和其他公司获得人工智能证书。",
    },
    {
      icon: (
        <BsPencilFill className="align-middle inline-block text-dark/500 text-xl mt-1" />
      ),
      header: "我能为这个项目做出贡献吗？",
      subtitle:
        "是的，我们一直在寻找投稿人。更多详情，请导航至网站顶部菜单栏，点击‘共创’。",
    },
  ],

  START: 'Start Now',
  START_1: "Learn AI for free, for all levels!",
  
  POST_REDIRECT_ENABLE: process.env.NEXT_PUBLIC_POST_REDIRECT_ENABLE || false, // 是否开启文章地址重定向 ； 用于迁移旧网站域名
  POST_REDIRECT_URL: process.env.NEXT_PUBLIC_POST_REDIRECT_URL || 'https://www.learnprompt.pro', // 重定向网站地址

  NEWSLETTER: process.env.NEXT_PUBLIC_THEME_LANDING_NEWSLETTER || false // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
}
export default CONFIG
