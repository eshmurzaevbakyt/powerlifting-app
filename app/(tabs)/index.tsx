import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

function getLevel(total: number): string {
  if (total === 0) return "Новичок 🥉";
  if (total < 300) return "3 разряд 🥈";
  if (total < 450) return "2 разряд 🥇";
  if (total < 600) return "1 разряд 💪";
  if (total < 750) return "КМС 🏆";
  return "МС 👑";
}

export default function Index() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("userData");
      if (!stored) {
        setTimeout(() => router.replace("/onboarding"), 100);
      } else {
        setUserData(JSON.parse(stored));
      }
    };
    load();
  }, []);

  if (!userData) return null;

  const total = userData.squat + userData.bench + userData.deadlift;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ PowerLifter</Text>
      <Text style={styles.subtitle}>Твой путь к рекорду</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userData.squat}</Text>
          <Text style={styles.statLabel}>Присед</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userData.bench}</Text>
          <Text style={styles.statLabel}>Жим</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userData.deadlift}</Text>
          <Text style={styles.statLabel}>Тяга</Text>
        </View>
      </View>

      <Text style={styles.total}>Тотал: {total} кг</Text>
      <Text style={styles.level}>Уровень: {getLevel(total)}</Text>
      <Text style={styles.weight}>Вес тела: {userData.bodyWeight} кг</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    minWidth: 90,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  total: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  level: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 8,
  },
  weight: {
    fontSize: 14,
    color: "#555",
  },
});