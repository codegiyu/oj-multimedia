/** Same behavior as lodash/capitalize: first char upper, rest lower. */
export function capitalizeWord(value: string): string {
  if (!value) return value;

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
