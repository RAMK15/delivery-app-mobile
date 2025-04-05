/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#FF6B6B',
    tabIconDefault: '#ccc',
    tabIconSelected: '#FF6B6B',
    icon: '#666',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#FF6B6B',
    tabIconDefault: '#ccc',
    tabIconSelected: '#FF6B6B',
    icon: '#999',
  },
} as const;

export default Colors;
