import { createTypography, getTypeScaleFactor } from '../src/theme/typography';
import { createTheme } from '../src/theme';

describe('responsive typography', () => {
  it('clamps the scale factor at both ends', () => {
    expect(getTypeScaleFactor(280)).toBeCloseTo(0.92);
    expect(getTypeScaleFactor(375)).toBeCloseTo(1);
    expect(getTypeScaleFactor(600)).toBeCloseTo(1.08);
  });

  it('keeps line height proportional to font size on every device', () => {
    for (const width of [320, 360, 375, 414, 480]) {
      const type = createTypography(width);
      for (const variant of Object.values(type)) {
        expect(variant.lineHeight).toBeGreaterThan(variant.fontSize as number);
      }
    }
  });
});

describe('themes', () => {
  it('exposes a full palette for both modes', () => {
    const light = createTheme('light', 375);
    const dark = createTheme('dark', 375);
    expect(Object.keys(light.colors)).toEqual(Object.keys(dark.colors));
    expect(light.colors.background).not.toBe(dark.colors.background);
    expect(light.mode).toBe('light');
    expect(dark.mode).toBe('dark');
  });
});
