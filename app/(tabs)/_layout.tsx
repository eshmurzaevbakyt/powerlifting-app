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
      <Tabs.Screen name="index" options={{ title: "Главная", tabBarLabel: "🏠" }} />
      <Tabs.Screen name="workout" options={{ title: "Тренировка", tabBarLabel: "🏋️" }} />
      <Tabs.Screen name="progress" options={{ title: "Прогресс", tabBarLabel: "📈" }} />
      <Tabs.Screen name="profile" options={{ title: "Профиль", tabBarLabel: "👤" }} />
      <Tabs.Screen name="program" options={{ title: "Программа", tabBarLabel: "📋" }} />
    </Tabs>
  );
}