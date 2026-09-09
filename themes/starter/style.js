/* eslint-disable react/no-unknown-property */
import CONFIG, { starterConfig } from './config'
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'

/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  const primary = starterConfig('STARTER_COLOR_PRIMARY', CONFIG.STARTER_COLOR_PRIMARY, CONFIG)
  const primaryHover = starterConfig('STARTER_COLOR_PRIMARY_HOVER', CONFIG.STARTER_COLOR_PRIMARY_HOVER, CONFIG)
  const dark = starterConfig('STARTER_COLOR_DARK', CONFIG.STARTER_COLOR_DARK, CONFIG)
  const textMuted = starterConfig('STARTER_COLOR_TEXT_MUTED', CONFIG.STARTER_COLOR_TEXT_MUTED, CONFIG)

  return <style jsx global>{`

  #theme-starter {
    --starter-color-primary: ${primary};
    --starter-color-primary-hover: ${primaryHover};
    --starter-color-dark: ${dark};
    --starter-color-text-muted: ${textMuted};
  }

  #theme-starter [class~="bg-primary"] {
    background-color: var(--starter-color-primary) !important;
  }

  #theme-starter [class~="text-primary"],
  #theme-starter [class~="hover:text-primary"]:hover,
  #theme-starter .group:hover [class~="group-hover:text-primary"] {
    color: var(--starter-color-primary) !important;
  }

  #theme-starter [class~="border-primary"],
  #theme-starter [class~="focus:border-primary"]:focus {
    border-color: var(--starter-color-primary) !important;
  }

  #theme-starter [class~="ring-primary"],
  #theme-starter [class~="focus:ring-primary"]:focus {
    --tw-ring-color: var(--starter-color-primary) !important;
  }

  #theme-starter [class~="hover:bg-primary"]:hover,
  #theme-starter [class~="hover:bg-blue-dark"]:hover,
  #theme-starter [class~="hover:border-blue-dark"]:hover {
    background-color: var(--starter-color-primary-hover) !important;
    border-color: var(--starter-color-primary-hover) !important;
  }

  #theme-starter [class~="bg-dark"],
  .dark #theme-starter [class~="dark:bg-dark"] {
    background-color: var(--starter-color-dark) !important;
  }

  #theme-starter [class~="hover:bg-dark"]:hover {
    background-color: var(--starter-color-dark) !important;
  }

  #theme-starter .text-body-color,
  #theme-starter [class~="text-body-color"] {
    color: var(--starter-color-text-muted) !important;
  }

  #theme-starter .sticky{
    position: fixed;
    z-index: 20;
    background-color: rgb(255 255 255 / 0.8);
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }

  :is(.dark #theme-starter .sticky){
    background-color: color-mix(in srgb, var(--starter-color-dark) 80%, transparent);
  }

  #theme-starter .sticky {
    -webkit-backdrop-filter: blur(5px);
            backdrop-filter: blur(5px);
    box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.1);
  }

  #theme-starter .sticky .navbar-logo{
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  #theme-starter .sticky #navbarToggler span{
    --tw-bg-opacity: 1;
    background-color: rgb(17 25 40 / var(--tw-bg-opacity));
  }

  :is(.dark #theme-starter .sticky #navbarToggler span){
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  }

  #theme-starter .sticky #navbarCollapse li > a{
    --tw-text-opacity: 1;
    color: rgb(17 25 40 / var(--tw-text-opacity));
  }

  #theme-starter .sticky #navbarCollapse li > a:hover{
    color: var(--starter-color-primary);
    opacity: 1;
  }

  #theme-starter .sticky #navbarCollapse li > button{
    --tw-text-opacity: 1;
    color: rgb(17 25 40 / var(--tw-text-opacity));
  }

  #theme-starter .sticky #navbarCollapse li > button:hover{
    color: var(--starter-color-primary);
    opacity: 1;
  }

  :is(.dark #theme-starter .sticky #navbarCollapse li > a){
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }

  :is(.dark #theme-starter .sticky #navbarCollapse li > a:hover){
    color: var(--starter-color-primary);
  }

  :is(.dark #theme-starter .sticky #navbarCollapse li > button){
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }

  :is(.dark #theme-starter .sticky #navbarCollapse li > button:hover){
    color: var(--starter-color-primary);
  }

  #navbarCollapse li .ud-menu-scroll.active{
    opacity: 0.7;
  }

  #theme-starter .sticky #navbarCollapse li .ud-menu-scroll.active{
    color: var(--starter-color-primary);
    opacity: 1;
  }

  #theme-starter .signUpBtn{
    display: inline-flex;
    min-height: 2.5rem;
    align-items: center;
    justify-content: center;
    background-color: rgb(255 255 255 / 0.2);
    color: rgb(255 255 255);
    line-height: 1;
  }

  #theme-starter .signUpBtn:hover{
    background-color: rgb(255 255 255);
    color: rgb(17 25 40);
  }

  #theme-starter .sticky .loginBtn{
    --tw-text-opacity: 1;
    color: rgb(17 25 40 / var(--tw-text-opacity));
  }

  #theme-starter .sticky .loginBtn:hover{
    color: var(--starter-color-primary);
    opacity: 1;
  }

  :is(.dark #theme-starter .sticky .loginBtn){
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }

  :is(.dark #theme-starter .sticky .loginBtn:hover){
    color: var(--starter-color-primary);
  }

  #theme-starter .sticky .signUpBtn{
    background-color: var(--starter-color-primary);
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }

  #theme-starter .sticky .signUpBtn:hover{
    background-color: var(--starter-color-primary-hover);
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }

  @media (min-width: 1024px) {
    #theme-starter #navbarCollapse {
      background-color: transparent !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
  }

  #theme-starter .sticky #themeSwitcher ~ span{
    --tw-text-opacity: 1;
    color: rgb(17 25 40 / var(--tw-text-opacity));
  }

  :is(.dark #theme-starter .sticky #themeSwitcher ~ span){
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }

  .navbarTogglerActive > span:nth-child(1){
    top: 7px;
    --tw-rotate: 45deg;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  .navbarTogglerActive > span:nth-child(2){
    opacity: 0;
  }

  .navbarTogglerActive > span:nth-child(3){
    top: -8px;
    --tw-rotate: 135deg;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }

  .text-body-color{
    color: var(--starter-color-text-muted);
  }

  .text-body-secondary{
    --tw-text-opacity: 1;
    color: rgb(136 153 168 / var(--tw-text-opacity));
  }


.common-carousel .swiper-button-next:after,
.common-carousel .swiper-button-prev:after{
  display: none;
}

.common-carousel .swiper-button-next,
.common-carousel .swiper-button-prev{
  position: static !important;
  margin: 0px;
  height: 3rem;
  width: 3rem;
  border-radius: 0.5rem;
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(17 25 40 / var(--tw-text-opacity));
  --tw-shadow: 0px 8px 15px 0px rgba(72, 72, 138, 0.08);
  --tw-shadow-colored: 0px 8px 15px 0px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.common-carousel .swiper-button-next:hover,
.common-carousel .swiper-button-prev:hover{
  background-color: var(--starter-color-primary);
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

:is(.dark .common-carousel .swiper-button-next),:is(.dark
.common-carousel .swiper-button-prev){
  --tw-bg-opacity: 1;
  background-color: rgb(17 25 40 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}

.common-carousel .swiper-button-next svg,
.common-carousel .swiper-button-prev svg{
  height: auto;
  width: auto;
}

  /* 正文（Notion 文章 / 仪表盘页）：限制最大宽度，兼顾表格/图片与阅读行宽 */
  #theme-starter #article-wrapper {
    max-width: 64rem;
  }

  /* 全站 container：xl 及以上略窄于满屏，接近主题默认版心（1140px） */
  @media (min-width: 1140px) {
    #theme-starter .container {
      max-width: 72rem;
    }
  }

      ${themeConsoleStyle('starter', CONFIG)}

  #theme-starter .starterHeroPrimaryBtn {
    background-color: rgb(255 255 255) !important;
    color: rgb(17 25 40) !important;
  }

  #theme-starter .starterHeroPrimaryBtn:hover {
    background-color: rgb(243 244 246) !important;
    color: var(--starter-color-text-muted) !important;
  }
  `}</style>
}

export { Style }
