import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(pokedex)">
        <Icon sf={{ default: "list.bullet", selected: "list.bullet.circle.fill" }} />
        <Label>Pokedex</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(favorite)">
        <Icon sf={{ default: "heart", selected: "heart.fill" }} />
        <Label>Favorite</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
