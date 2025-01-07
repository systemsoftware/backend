const hexToRgb = (hex) => {
  if (hex.length === 4) {
    hex = hex.replace(/./g, '$&$&');
  }
  return hex.match(/.{2}/g).map((value) => parseInt(value, 16));
}

const getContrastTextColor = (color) => {
  if (!color) {
    console.error('Invalid color input: color is undefined or null');
    return 'black';
  }
    
  let r, g, b;
  
  if (Array.isArray(color)) {
    [r, g, b] = color;
  } else if (typeof color === 'string') {
    // Handle hex colors
    if (color.startsWith('#')) {
      [r, g, b] = hexToRgb(color.slice(1));
      } else if (color.startsWith('rgb')) {
      const values = color.match(/\d+/g);
      if (!values || values.length < 3) {
        console.error('Invalid rgb format:', color);
        return 'black'; 
      }
      [r, g, b] = values.map(Number);
    }
    // Handle named colors
    else {
      let namedColors = {
        white: [255, 255, 255],
        black: [0, 0, 0],
        red: [255, 0, 0],
        green: [0, 128, 0],
        blue: [0, 0, 255],
        gray: [128, 128, 128],
        yellow: [255, 255, 0],
      };

      try {
        namedColors = require('css-color-names');
      } catch {
        console.warn('css-color-names package not found. Using a smaller set of named colors.');
      }
      
      const colorValue = typeof namedColors[color] === 'string' ? hexToRgb(namedColors[color].replace('#','')) : namedColors[color];
      if (colorValue) {
        [r, g, b] = colorValue;
      } else {
        console.error('Unknown color name:', color);
        return 'black';
      }
    }
  }

  if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number' ||
      isNaN(r) || isNaN(g) || isNaN(b)) {
    console.error('Invalid RGB values:', { r, g, b });
    return 'black';
  }

  const toSRGB = (value) => {
    value = value / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  const sR = toSRGB(r);
  const sG = toSRGB(g);
  const sB = toSRGB(b);

  const luminance = 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
  
  return luminance > 0.179 ? 'black' : 'white';
}

module.exports = getContrastTextColor;