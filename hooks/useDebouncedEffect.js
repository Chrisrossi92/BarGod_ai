import { useEffect } from "react";
export default function useDebouncedEffect(effect, deps, delay = 400) {
  useEffect(() => {
    const t = setTimeout(effect, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
