import * as Haptics from 'expo-haptics';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Pressable } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <Pressable
      {...props}
      onPress={(e) => {
        if (props.onPress) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          props.onPress(e);
        }
      }}
    />
  );
}

