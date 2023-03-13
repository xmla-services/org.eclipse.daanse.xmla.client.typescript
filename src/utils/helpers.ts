export function optionalArrayToArray(el: any): any[] {
  if (Array.isArray(el)) return el;
  if (el) {
    return [el];
  }
  return [];
}
