// This is a shim for web and Android where the tab bar is generally opaque.
export default undefined;

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useBottomTabOverflow() {
  const { bottom } = useSafeAreaInsets();
  return bottom;
}
