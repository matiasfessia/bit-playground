import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

export type OverflowTipProps = {
  text?: string;
};

const useStyles = makeStyles(() => ({
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

export function OverflowTip({ text }: OverflowTipProps) {
  // export const OverflowTip = ({ text }: OverflowTipProps): React.ReactElement => {
  const classes = useStyles();
  const textElementRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const compareSize = () => {
    if (textElementRef.current && textElementRef.current) {
      setIsOverflowing(
        textElementRef.current.scrollWidth > textElementRef.current.clientWidth
      );
    }
  };

  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
    return () => window.removeEventListener('resize', compareSize);
  }, []);

  return (
    <div data-testid="overflow-tip">
      <Tooltip title={text} interactive disableHoverListener={!isOverflowing}>
        <div ref={textElementRef} className={classes.text}>
          {text}
        </div>
      </Tooltip>
    </div>
  );
}
