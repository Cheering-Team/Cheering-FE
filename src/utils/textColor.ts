export const textColor = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance >= 128 ? '#000000' : '#FFFFFF';
};
