import React, { ReactNode } from 'react';
import './container.scss';

interface Props {
  children: ReactNode;
}

export function Container({ children }: Props) {
  return (
    <div className="mx-auto my-4 container">
      {React.Children.map(children, (child) => (
        <div>{child}</div>
      ))}
    </div>
  );
}
