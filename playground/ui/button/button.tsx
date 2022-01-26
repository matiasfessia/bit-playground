import React, { ReactNode, useState } from 'react';

export type ButtonProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function Button({ children }: ButtonProps) {
  const [isOverflowing, setIsOverflowing] = useState(false);

  return (
    <button style={{ backgroundColor: 'red', padding: '12px' }}>
      {children}
    </button>
  );
}
