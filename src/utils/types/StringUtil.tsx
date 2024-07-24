export function strip(x: string): string {
  return x.replace(/^\s+|\s+$/gm, "");
}
export function rstrip(x: string): string {
  return x.replace(/\s+$/gm, "");
}
export function lstrip(x: string): string {
  return x.replace(/^\s+/gm, "");
}
export function lrstrip(x: string): string {
  return x.replace(/^\s+|\s+$/gm, "");
}
export function trim(x: string, characters: string): string {
  var start = 0;
  while (characters.indexOf(x[start]) >= 0) {
    start += 1;
  }
  var end = x.length - 1;
  while (characters.indexOf(x[end]) >= 0) {
    end -= 1;
  }
  return x.substr(start, end - start + 1);
}
export function rtrim(x: string, characters: string) {
  // var start = 0;
  var end = x.length - 1;
  while (characters.indexOf(x[end]) >= 0) {
    end -= 1;
  }
  return x.substr(0, end + 1);
}
export function ltrim(x: string, characters: string) {
  var start = 0;
  while (characters.indexOf(x[start]) >= 0) {
    start += 1;
  }
  // var end = x.length - 1;
  return x.substr(start);
}
