import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Set = {
  weight: number;
  reps: number;
  done: boolean;
};

type Exercise = {
  name: string;
  sets: Set[];
};

function calculateSets(max: number): Set[] {
  return [
    { weight: Math.round(max * 0.65 / 2.5) * 2.5, reps: 5, done: false },
    { weight: Math.round(max * 0.75 / 2.5) * 2.5, reps: 3, done: false },
    { weight: Math.round(max * 0.85 / 2.5) * 2.5, reps: 1, done: false },
  ];
}

function getTodayExercise(squat: number, bench: number, deadlift: number): Exercise {
  const day = new Date().getDay(); // 0=вс, 1=пн, 2=вт...
  if (day === 1 || day === 4) {
    return { name: "Присед 🦵", sets: calculateSets(squat) };
  } else if (day === 2 || day === 5) {
    return { name: "Жим лёжа 💪", sets: calculateSets(bench) };
  } else if (day === 3 || day === 6) {
    return { name: "Становая тяга 🏋️", sets: calculateSets(deadlift) };
  } else {
    return { name: "Отдых 😴", sets: [] };
  }
}

export default function Workout() {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState<Set[]>([]);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("userData");
      if (stored) {
        const data = JSON.parse(stored);
        const ex = getTodayExercise(data.squat, data.bench, data.deadlift);
        setExercise(ex);
        setSets(ex.sets);
      }
    };
    load();
  }, []);

  const toggleSet = (index: number) => {
    const updated = [...sets];
    updated[index].done = !updated[index].done;
    setSets(updated);
  };

  const allDone = sets.length > 0 && sets.every((s) => s.done);

  const handleFinish = () => {
    Alert.alert("Тренировка завершена! 💥", "Отличная работа. Результаты сохранены.");
  };

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏋️ Тренировка</Text>
      <Text style={styles.exerciseName}>{exercise.name}</Text>

      {sets.length === 0 ? (
        <Text style={styles.restText}>Сегодня день отдыха. Восстанавливайся 💤</Text>
      ) : (
        <>
          <View style={styles.setsHeader}>
            <Text style={styles.headerText}>Подход</Text>
            <Text style={styles.headerText}>Вес</Text>
            <Text style={styles.headerText}>Повторения</Text>
            <Text style={styles.headerText}>Готово</Text>
          </View>

          {sets.map((set, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.setRow, set.done && styles.setRowDone]}
              onPress={() => toggleSet(index)}
            >
              <Text style={styles.setText}>{index + 1}</Text>
              <Text style={styles.setText}>{set.weight} кг</Text>
              <Text style={styles.setText}>{set.reps}</Text>
              <Text style={styles.setText}>{set.done ? "✅" : "⬜"}</Text>
            </TouchableOpacity>
          ))}

          {allDone && (
            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
              <Text style={styles.finishButtonText}>Завершить тренировку 🔥</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <Text style={styles.hint}>Нажми на подход чтобы отметить выполненным</Text>
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
  loading: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 32,
  },
  setsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  headerText: {
    color: "#555",
    fontSize: 13,
    flex: 1,
    textAlign: "center",
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  setRowDone: {
    borderColor: "#FFD700",
    backgroundColor: "#1a1500",
  },
  setText: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  finishButton: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  restText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
  hint: {
    color: "#333",
    fontSize: 13,
    textAlign: "center",
    marginTop: 24,
  },
});