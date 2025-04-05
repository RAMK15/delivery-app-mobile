import { Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function RestaurantLayout() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor,
          },
          headerShadowVisible: false,
          headerTintColor: '#2ecc71',
          title: 'Restaurants'
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerStyle: {
            backgroundColor,
          },
          headerShadowVisible: false,
          headerTintColor: '#2ecc71',
          headerBackTitle: 'Back',
          title: 'Restaurant Details'
        }}
      />
    </Stack>
  );
} 