/**
 * Generates a string with matching characters from the start and end.
 * @param num The number of characters to match from each end.
 * @param string The input string to process.
 * @returns A string with matching characters and ellipsis in the middle.
 */
export function matchChars(num: number, string: string): string {
  if (num * 2 >= string.length) {
    return string;
  }

  const start = string.slice(0, num).replace(/\s/g, "");

  return `${start}...`;
}
