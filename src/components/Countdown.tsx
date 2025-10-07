import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TextProps } from 'react-native';

import StyledText from './StyledText';

export interface CountdownProps extends TextProps {
  date: Date; // future date
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const secsLeft = (d: Date) => Math.max(0, Math.floor((+d - Date.now()) / 1000));

const Countdown: React.FC<CountdownProps> = ({ date, ...props }) => {
  const target = useMemo(() => new Date(date), [date]);
  const [s, setS] = useState(() => secsLeft(target));
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setS(secsLeft(target));
    timer.current && clearInterval(timer.current);
    timer.current = setInterval(() => {
      setS((prev) => {
        const next = secsLeft(target);
        return next === prev ? (prev - 1 >= 0 ? prev - 1 : 0) : next;
      });
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
  }, [target]);

  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  return (
    <StyledText {...props}>{`${pad(h)}h ${pad(m)}m ${pad(sec)}s`}</StyledText>
  );
};

export default Countdown;
