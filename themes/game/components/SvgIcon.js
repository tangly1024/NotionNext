export const SvgIcon = () => {
  return <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            width="24"
            height="24"
            className="fill-current text-black dark:text-white"
        />
        <rect width="24" height="24" fill="url(#paint0_radial)" />
        <defs>
            <radialGradient
                id="paint0_radial"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="rotate(45) scale(39.598)"
            >
                <stop stopColor="#CFCFCF" stopOpacity="0.6" />
                <stop offset="1" stopColor="#E9E9E9" stopOpacity="0" />
            </radialGradient>
        </defs>
    </svg>
}
