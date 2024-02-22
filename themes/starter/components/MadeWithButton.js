/* eslint-disable @next/next/no-img-element */
export const MadeWithButton = () => {
  return <>
        {/* <!-- ====== Made With Button Start --> */}
        <a
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="fixed bottom-8 left-4 z-[999] inline-flex items-center gap-[10px] rounded-lg bg-white px-[14px] py-2 shadow-2 dark:bg-dark-2 sm:left-9"
      href="https://tailgrids.com/"
    >
      <span className="text-base font-medium text-dark-3 dark:text-dark-6">
        Made with
      </span>
      <span className="block h-4 w-px bg-stroke dark:bg-dark-3"></span>
      <span className="block w-full max-w-[88px]">
        <img
          src="/images/starter/brands/tailgrids.svg"
          alt="tailgrids"
          className="dark:hidden"
        />
        <img
          src="/images/starter/brands/tailgrids-white.svg"
          alt="tailgrids"
          className="hidden dark:block"
        />
      </span>
    </a>
    </>
}
