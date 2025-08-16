import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '~/utils';
import { headingVariants } from './variants';

type HeadingProps = React.ComponentProps<'h1'> &
  VariantProps<typeof headingVariants> & {
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };

function Heading({ className, level = 'h1', variant, ...props }: HeadingProps) {
  const Comp = level;
  return <Comp className={cn(headingVariants({ level, variant, className }))} {...props} />;
}

export { Heading };
