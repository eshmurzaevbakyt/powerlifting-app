import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#0a0a0a",
          borderTopColor: "#222",
        },
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#555",
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Главная", tabBarLabel: "Главная" }} />
      <Tabs.Screen name="workout" options={{ title: "Тренировка", tabBarLabel: "Тренировка" }} />
      <Tabs.Screen name="progress" options={{ title: "Прогресс", tabBarLabel: "Прогресс" }} />
      <Tabs.Screen name="profile" options={{ title: "Профиль", tabBarLabel: "Профиль" }} />
    </Tabs>
  );
}