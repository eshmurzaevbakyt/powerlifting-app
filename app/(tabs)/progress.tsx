import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type WorkoutEntry = {
  date: string;
  exercise: string;
  sets: { weight: number; reps: number; done: boolean }[];
  totalVolume: number;
};

export default function Progress() {
  const [history, setHistory] = useState<WorkoutEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("workoutHistory");
      if (stored) setHistory(JSON.parse(stored));
    };
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📈 Прогресс</Text>

      {history.length === 0 ? (
        <Text style={styles.empty}>
          Тренировок пока нет.{"\n"}Заверши первую тренировку — она появится здесь.
        </Text>
      ) : (
        history.map((entry, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardExercise}>{entry.exercise}</Text>
              <Text style={styles.cardDate}>{entry.date}</Text>
            </View>

            <View style={styles.setsContainer}>
              {entry.sets
                .filter((s) => s.done)
                .map((set, i) => (
                  <Text key={i} style={styles.setText}>
                    {set.weight} кг × {set.reps}
                  </Text>
                ))}
            </View>

            <Text style={styles.volume}>Объём: {entry.totalVolume} кг</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0a0a0a",
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 24,
  },
  empty: {
    color: "#555",
    fontSize: 16,
    textAlign: "center",
    marginTop: 60,
    lineHeight: 26,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardExercise: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDate: {
    color: "#555",
    fontSize: 14,
  },
  setsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  setText: {
    color: "#aaa",
    fontSize: 14,
    backgroundColor: "#111",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  volume: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
  },
});