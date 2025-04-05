/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  
  // Default colors if the colorName doesn't exist in Colors
  const defaultColors = {
    light: {
      text: '#000',
      background: '#fff',
    },
    dark: {
      text: '#fff',
      background: '#000',
    }
  };

  return Colors[theme][colorName] || defaultColors[theme][colorName as keyof typeof defaultColors.light] || '#000';
}
