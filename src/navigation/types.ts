import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootTabParamList = {
  Home: undefined;
  Listing: undefined;
  Settings: undefined;
};

export type TabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<
  RootTabParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
