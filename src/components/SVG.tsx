
const SvgSidebar = (props: object) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="h-4 w-4 text-black dark:text-white"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect width={18} height={18} x={3} y={3} rx={2} ry={2} />
    <path fill="fff" d="M9 3v18" />
  </svg>
)

export { SvgSidebar }
