function hashStr(s: string): number {
  let h = 0;
  for (const c of s) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function getEntityColor(name: string): string {
  const hue = hashStr(name) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}
