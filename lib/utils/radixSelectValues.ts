/** Separator for Radix Select item values — keeps hidden native `<option>` keys unique when labels/values repeat. */
const RADIX_SELECT_VALUE_SEP = '\u001f';

export function toRadixSelectItemValue(optionValue: string, index: number): string {
  return `${index}${RADIX_SELECT_VALUE_SEP}${optionValue}`;
}

export function fromRadixSelectItemValue(radixValue: string): string {
  const sepIndex = radixValue.indexOf(RADIX_SELECT_VALUE_SEP);
  if (sepIndex === -1) return radixValue;

  return radixValue.slice(sepIndex + 1);
}

export function resolveRadixSelectItemValue(
  items: ReadonlyArray<{ value: string }>,
  selectedValue: string
): string | undefined {
  const index = items.findIndex(item => String(item.value) === selectedValue);
  if (index === -1) return undefined;

  return toRadixSelectItemValue(String(items[index].value), index);
}
