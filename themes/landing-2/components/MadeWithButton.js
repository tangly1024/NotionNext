/* eslint-disable @next/next/no-img-element */
export const MadeWithButton = () => {
  return <>
        {/* <!-- ====== Made With Button Start --> */}
        <a
      target="_blank"
      rel="nofollow noopener noreferrer"
      class="fixed bottom-8 left-4 z-[999] inline-flex items-center gap-[10px] rounded-lg bg-white px-[14px] py-2 shadow-2 dark:bg-dark-2 sm:left-9"
      href="https://tailgrids.com/"
    >
      <span class="text-base font-medium text-dark-3 dark:text-dark-6">
        Made with
      </span>
      <span class="block h-4 w-px bg-stroke dark:bg-dark-3"></span>
      <span class="block w-full max-w-[88px]">
        <img
          src=".//images/landing-2/brands/tailgrids.svg"
          alt="tailgrids"
          class="dark:hidden"
        />
        <img
          src=".//images/landing-2/brands/tailgrids-white.svg"
          alt="tailgrids"
          class="hidden dark:block"
        />
      </span>
    </a>
    </>
}
