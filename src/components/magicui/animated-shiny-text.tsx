import { ComponentPropsWithoutRef, CSSProperties, FC } from "react";

import { cn } from "src/lib/utils"; 

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
  baseGradientFromColor?: string;
  baseGradientToColor?: string;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  baseGradientFromColor = "#3b82f6", // indigo-600
  baseGradientToColor = "#9333ea", // purple-600
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
          backgroundImage: `
            linear-gradient(var(--shiny-bg-x-position, calc(-100% - var(--shiny-width))) 0%, 
                          transparent calc(-100% - var(--shiny-width) + 20px), 
                          var(--shiny-color, rgba(255,255,255,0.8)) calc(-100% - var(--shiny-width) + 40px), 
                          transparent calc(-100% - var(--shiny-width) + 60px), 
                          transparent 100%),
            linear-gradient(to right, ${baseGradientFromColor}, ${baseGradientToColor})
          `,
          backgroundSize: `var(--shiny-width) 100%, 100% 100%`,
          backgroundPosition: `var(--shiny-bg-x-position, calc(-100% - var(--shiny-width))) 0%, 0% 0%`,
          backgroundRepeat: 'no-repeat, no-repeat',
        } as CSSProperties
      }
      className={cn(
        "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",

        // Shine effect
        "animate-shiny-text bg-clip-text [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};