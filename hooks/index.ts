import { useEffect, useMemo, useRef } from "react";
import debounce from "lodash/debounce";

export const useDebounce = (
  callback: (e: React.ChangeEvent<any>) => void,
  timer: number = 1000
) => {
  const ref = useRef() as any;

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, timer);
  }, []);

  return debouncedCallback;
};
