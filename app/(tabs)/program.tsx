import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Program() {
  const [isNovice, setIsNovice] = useState<boolean | null>(null);
  const [dayOption, setDayOption] = useState<string | null>(null);
  
  useEffect(() => {
  const load = async () => {
    const stored = await AsyncStorage.getItem("programSettings");
    if (stored) {
      const data = JSON.parse(stored);
      setIsNovice(data.isNovice);
      setDayOption(data.dayOption);
    }
  };
  load();
}, []);
  const handleStart = async () => {
    if (isNovice === null || !dayOption) {
      alert("Выбери уровень и дни тренировок");
      return;
    }

    const programSettings = {
      isNovice,
      dayOption,
      startDate: new Date().toISOString().split("T")[0],
      weeksCompleted: 0,
    };

    const exerciseState = {
      deadlift: { weight: isNovice ? 30 : null, completedRows: 0 },
      bench: { weight: isNovice ? 20 : null, completedRows: 0 },
      squat: { weight: isNovice ? 30 : null, completedRows: 0 },
      hyperextension: { weight: 0, completedRows: 0 },
      arnold_press: { weight: 5, completedRows: 0 },
      reverse_curl: { weight: 10, completedRows: 0 },
      wrist_curl: { weight: 10, completedRows: 0 },
      dumbbell_press: { weight: 6, completedRows: 0 },
      tricep_rope: { weight: 15, completedRows: 0 },
      overhead_tricep: { weight: 8, completedRows: 0 },
      leg_press: { weight: 40, completedRows: 0 },
      assisted_pullup: { weight: 30, completedRows: 0 },
      ez_curl: { weight: 10, completedRows: 0 },
    };

    await AsyncStorage.setItem("programSettings", JSON.stringify(programSettings));
    await AsyncStorage.setItem("exerciseState", JSON.stringify(exerciseState));

    console.log("Сохраняем программу:", programSettings);
    console.log("Сохранено");
    router.replace("/(tabs)");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>⚡ Программа</Text>
      <Text style={styles.subtitle}>Настрой свою программу тренировок</Text>

      <Text style={styles.sectionTitle}>Твой уровень</Text>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.optionButton, isNovice === true && styles.optionSelected]}
          onPress={() => setIsNovice(true)}
        >
          <Text style={[styles.optionText, isNovice === true && styles.optionTextSelected]}>
            🌱 Новичок
          </Text>
          <Text style={styles.optionDesc}>Начинаю с нуля</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, isNovice === false && styles.optionSelected]}
          onPress={() => setIsNovice(false)}
        >
          <Text style={[styles.optionText, isNovice === false && styles.optionTextSelected]}>
            💪 Опытный
          </Text>
          <Text style={styles.optionDesc}>Есть рабочие веса</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Дни тренировок</Text>
      <View style={styles.dayColumn}>
        <TouchableOpacity
          style={[styles.dayButton, dayOption === "mon-wed-fri" && styles.optionSelected]}
          onPress={() => setDayOption("mon-wed-fri")}
        >
          <Text style={[styles.optionText, dayOption === "mon-wed-fri" && styles.optionTextSelected]}>
            Пн / Ср / Пт
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dayButton, dayOption === "tue-thu-sat" && styles.optionSelected]}
          onPress={() => setDayOption("tue-thu-sat")}
        >
          <Text style={[styles.optionText, dayOption === "tue-thu-sat" && styles.optionTextSelected]}>
            Вт / Чт / Сб
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>Начать программу →</Text>
      </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
  },
  dayColumn: {
    gap: 12,
    marginBottom: 40,
  },
  dayButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
  },
  optionSelected: {
    borderColor: "#FFD700",
    backgroundColor: "#1a1500",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionTextSelected: {
    color: "#FFD700",
  },
  optionDesc: {
    color: "#555",
    fontSize: 13,
    marginTop: 4,
  },
  startButton: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});