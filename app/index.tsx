import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ PowerLifter</Text>
      <Text style={styles.subtitle}>Твой путь к рекорду</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Присед</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Жим</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Тяга</Text>
        </View>
      </View>

      <Text style={styles.total}>Тотал: 0 кг</Text>
      <Text style={styles.level}>Уровень: Новичок 🥉</Text>
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
  },
});