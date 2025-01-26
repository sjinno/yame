import React, { ReactNode } from 'react';
import clsx from 'clsx';
import './container.scss';

interface Props {
  children: ReactNode;
}

export function Container({ children }: Props) {
  return (
    <div className="w-[420px] mx-auto">
      {React.Children.map(children, (child) => (
        <div>{child}</div>
      ))}
    </div>
  );
}
