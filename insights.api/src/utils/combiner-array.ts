export function combinerArrays(firstArray: string[], secondArray: string[]) {
  const arrayConcat = firstArray.concat(secondArray);

  return Array.from(new Set(arrayConcat));
}
