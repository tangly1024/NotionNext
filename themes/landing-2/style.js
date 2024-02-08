/* eslint-disable react/no-unknown-property */

/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
  
  .sticky{
    position: fixed;
    z-index: 9999;
    background-color: rgb(255 255 255 / 0.8);
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  
  :is(.dark .sticky){
    background-color: rgb(17 25 40 / 0.8);
  }
  
  .sticky {
    -webkit-backdrop-filter: blur(5px);
            backdrop-filter: blur(5px);
    box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.1);
  }
  
  .sticky .navbar-logo{
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .sticky #navbarToggler span{
    --tw-bg-opacity: 1;
    background-color: rgb(17 25 40 / var(--tw-bg-opacity));
  }
  
  :is(.dark .sticky #navbarToggler span){
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  }
  
  .sticky #navbarCollapse li > a{
    --tw-text-opacity: 1;
    color: rgb(17 25 40 / var(--tw-text-opacity));
  }
  
  .sticky #navbarCollapse li > a:hover{
    --tw-text-opacity: 1;
    color: rgb(55 88 249 / var(--tw-text-opacity));
    opacity: 1;
  }
  
  :is(.dark .sticky #navbarCollapse li > a){
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }
  
  :is(.dark .sticky #navbarCollapse li > a:hover){
    --tw-text-opacity: 1;
    color: rgb(55 88 249 / var(--tw-text-opacity));
  }
  
  #navbarCollapse li .ud-menu-scroll.active{
    opacity: 0.7;
  }
  
  .sticky #navbarCollapse li .ud-menu-scroll.active{
    --tw-text-opacity: 1;
    color: rgb(55 88 249 / var(--tw-text-opacity));
    opacity: 1;
  }
  
  .sticky .loginBtn{
    --tw-text-opacity: 1;
    color: rgb(17 25 40 / var(--tw-text-opacity));
  }
  
  .sticky .loginBtn:hover{
    --tw-text-opacity: 1;
    color: rgb(55 88 249 / var(--tw-text-opacity));
    opacity: 1;
  }
  
  :is(.dark .sticky .loginBtn){
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }
  
  :is(.dark .sticky .loginBtn:hover){
    --tw-text-opacity: 1;
    color: rgb(55 88 249 / var(--tw-text-opacity));
  }
  
  .sticky .signUpBtn{
    --tw-bg-opacity: 1;
    background-color: rgb(55 88 249 / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }
  
  .sticky .signUpBtn:hover{
    --tw-bg-opacity: 1;
    background-color: rgb(27 68 200 / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
  }
  
  .sticky #themeSwitcher ~ span{
    --tw-text-opacity: 1;
    color: rgb(17 25 40 / var(--tw-text-opacity));
  }
  
  :is(.dark .sticky #themeSwitcher ~ span){
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
    --tw-text-opacity: 1;
    color: rgb(99 115 129 / var(--tw-text-opacity));
  }
  
  .text-body-secondary{
    --tw-text-opacity: 1;
    color: rgb(136 153 168 / var(--tw-text-opacity));
  }

  `}</style>
}

export { Style }
