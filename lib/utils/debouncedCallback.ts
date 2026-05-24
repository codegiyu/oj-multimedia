export type DebouncedCallback<T extends unknown[]> = {
  call: (...args: T) => void;
  flush: () => void;
  cancel: () => void;
};

/** Schedules `fn`; `flush` runs the latest pending args immediately. */
export function createDebouncedCallback<T extends unknown[]>(
  fn: (...args: T) => void,
  ms: number
): DebouncedCallback<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: T | null = null;

  const cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    pending = null;
  };

  const flush = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (pending !== null) {
      const args = pending;
      pending = null;
      fn(...args);
    }
  };

  const call = (...args: T) => {
    pending = args;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      flush();
    }, ms);
  };

  return { call, flush, cancel };
}
