export function parseCsvLine(line) {
  return line.split(',').map((value) => value.trim());
}

export function toCsvLine(values) {
  return values.join(',');
}
