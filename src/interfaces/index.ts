import type { ComponentType, JSX, ReactNode, SVGProps } from "react";

export interface MenuRoute {
  path: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}
