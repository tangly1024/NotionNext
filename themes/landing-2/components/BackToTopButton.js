import { useEffect } from 'react'

export const BackToTopButton = () => {
  useEffect(() => {
    // ====== scroll top js
    function scrollTo(element, to = 0, duration = 500) {
      const start = element.scrollTop;
      const change = to - start;
      const increment = 20;
      let currentTime = 0;

      const animateScroll = () => {
        currentTime += increment;

        const val = Math.easeInOutQuad(currentTime, start, change, duration);

        element.scrollTop = val;

        if (currentTime < duration) {
          setTimeout(animateScroll, increment);
        }
      };

      animateScroll();
    }

    Math.easeInOutQuad = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    document.querySelector('.back-to-top').onclick = () => {
      scrollTo(document.documentElement);
    };
  })

  return <>
        {/* <!-- ====== Back To Top Start --> */}
        <a
      href="javascript:void(0)"
      class="back-to-top fixed bottom-8 left-auto right-8 z-[999] hidden h-10 w-10 items-center justify-center rounded-md bg-primary text-white shadow-md transition duration-300 ease-in-out hover:bg-dark"
    >
      <span
        class="mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white"
      ></span>
    </a>
    {/* <!-- ====== Back To Top End --> */}
    </>
}
