import { useCallback, useRef } from 'react';

export const useInfiniteScrolling = (handleTrigger) => {
  const observer = useRef();

  const lastElementRef = useCallback(
    node => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          handleTrigger();
        }
      });
      if (node) observer.current.observe(node);
    },
    [handleTrigger],
  );

  return lastElementRef;
};
