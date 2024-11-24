export const randomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  const getColorBrightness = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };
  
  export const generateRandomGradient = () => {
    const numberOfColors = Math.floor(Math.random() * 3) + 2; // 2-4 colors
    const colors: string[] = [];
    const angle = Math.floor(Math.random() * 360);
  
    for (let i = 0; i < numberOfColors; i++) {
      colors.push(randomColor());
    }
  
    const brightnesses = colors.map((color) => getColorBrightness(color));
    const avgBrightness =
      brightnesses.reduce((a, b) => a + b) / brightnesses.length;
  
    const accentColor =
      avgBrightness > 128
        ? colors.reduce((a, b) =>
            getColorBrightness(a) < getColorBrightness(b) ? a : b
          )
        : colors.reduce((a, b) =>
            getColorBrightness(a) > getColorBrightness(b) ? a : b
          );
  
    return {
      style: `linear-gradient(${angle}deg, ${colors.join(", ")})`,
      accent: accentColor,
    };
  };
  
export const HSLToHex = (h: number, s: number, l: number): string => {
    const hDecimal = l / 100;
    const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };
  
  export const generateSolidColorPair = () => {
    const goldenRatio = 0.618033988749895;
    const hue = Math.random();
    const baseHue = Math.floor((hue + goldenRatio) * 360) % 360;
  
    const mainColor = HSLToHex(
      baseHue,
      70 + Math.random() * 20,
      45 + Math.random() * 20 
    );
  
    const accentHueShift = Math.random() > 0.5 ? 180 : 120;
    const accentHue = (baseHue + accentHueShift) % 360;
    const accentColor = HSLToHex(
      accentHue,
      75 + Math.random() * 15,
      65 + Math.random() * 15
    );
  
    return {
      style: `${mainColor}`,
      accent: accentColor,
    };
  };