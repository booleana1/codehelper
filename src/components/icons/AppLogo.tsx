import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor" // Use fill for a solid shape
      stroke="currentColor"
      strokeWidth="0" // No stroke needed for a solid filled square
      {...props}
    >
      <path d="M0 0h24v24H0z" /> {/* A simple path for a filled square */}
    </svg>
  );
}
