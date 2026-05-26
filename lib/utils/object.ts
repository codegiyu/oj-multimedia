export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[] | K
): Omit<T, K> {
  const keyList = (Array.isArray(keys) ? keys : [keys]) as K[];
  const result = { ...obj };

  for (const key of keyList) {
    delete result[key];
  }

  return result;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}
