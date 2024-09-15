/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    twitter: {
      blue: '#1DA1F2',
      black: '#14171A',
      darkGray: '#657786',
      lightGray: '#AAB8C2',
      extraLightGray: '#E1E8ED',
      extraExtraLightGray: '#F5F8FA',
    },
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    twitter: {
      blue: '#1DA1F2',
      black: '#000000',
      darkGray: '#657786',
      lightGray: '#AAB8C2',
      extraLightGray: '#E1E8ED',
      extraExtraLightGray: '#15202B',
    },
  },
};
