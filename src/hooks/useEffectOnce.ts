import { useEffect } from 'react';

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useEffectOnce = (callback: () => void) => useEffect(callback, []);
