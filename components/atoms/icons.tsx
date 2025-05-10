import type { SVGProps } from "react"

export function Tomato(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 10c.7-.7 1.5-1 2.5-1 2 0 3.5 1.5 3.5 3.5 0 .7-.2 1.4-.5 2" />
      <path d="M7 10c-.7-.7-1.5-1-2.5-1C2.5 9 1 10.5 1 12.5c0 .7.2 1.4.5 2" />
      <path d="M12 6V3" />
      <path d="M10 3h4" />
      <path d="M19.2 16.2A7 7 0 0 1 12 19a7 7 0 0 1-7.2-2.8" />
      <path d="M12 19v3" />
      <path d="M12 6a5 5 0 0 1 5 5 7 7 0 0 1-5 7 7 7 0 0 1-5-7 5 5 0 0 1 5-5Z" />
    </svg>
  )
}
