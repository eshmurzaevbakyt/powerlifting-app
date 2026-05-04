import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Onboarding() {
  const [bodyWeight, setBodyWeight] = useState("");
  const [squat, setSquat] = useState("");
  const [bench, setBench] = useState("");
  const [deadlift, setDeadlift] = useState("");

const handleStart = async () => {
  if (!bodyWeight || !squat || !bench || !deadlift) {
    alert("Заполни все поля");
    return;
  }

  try {
    const userData = {
      bodyWeight: parseFloat(bodyWeight),
      squat: parseFloat(squat),
      bench: parseFloat(bench),
      deadlift: parseFloat(deadlift),
    };

    console.log("Сохраняем:", userData);
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    console.log("Сохранено, переходим...");
    router.replace("/(tabs)");
  } catch (e) {
    console.error("Ошибка:", e);
    alert("Ошибка: " + e);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>⚡ PowerLifter</Text>
      <Text style={styles.subtitle}>Давай начнём. Введи свои данные.</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Вес тела (кг)</Text>
        <TextInput
          style={styles.input}
          placeholder="например: 90"
          placeholderTextColor="#555"
          keyboardType="numeric"
          value={bodyWeight}
          onChangeText={setBodyWeight}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Максимум в приседе (кг)</Text>
        <TextInput
          style={styles.input}
          placeholder="например: 140"
          placeholderTextColor="#555"
          keyboardType="numeric"
          value={squat}
          onChangeText={setSquat}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Максимум в жиме (кг)</Text>
        <TextInput
          style={styles.input}
          placeholder="например: 100"
          placeholderTextColor="#555"
          keyboardType="numeric"
          value={bench}
          onChangeText={setBench}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Максимум в тяге (кг)</Text>
        <TextInput
          style={styles.input}
          placeholder="например: 180"
          placeholderTextColor="#555"
          keyboardType="numeric"
          value={deadlift}
          onChangeText={setDeadlift}
        />
      </View>

      <Text style={styles.hint}>
        Не знаешь максимум? Введи рабочий вес с которым делаешь 5 повторений — мы посчитаем сами.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Начать →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0a0a0a",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  hint: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});