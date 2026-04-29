import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const [bodyWeight, setBodyWeight] = useState("");
  const [squat, setSquat] = useState("");
  const [bench, setBench] = useState("");
  const [deadlift, setDeadlift] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("userData");
      if (stored) {
        const data = JSON.parse(stored);
        setBodyWeight(String(data.bodyWeight));
        setSquat(String(data.squat));
        setBench(String(data.bench));
        setDeadlift(String(data.deadlift));
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!bodyWeight || !squat || !bench || !deadlift) {
      Alert.alert("Ошибка", "Заполни все поля");
      return;
    }
    const userData = {
      bodyWeight: parseFloat(bodyWeight),
      squat: parseFloat(squat),
      bench: parseFloat(bench),
      deadlift: parseFloat(deadlift),
    };
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    Alert.alert(
      "Сбросить данные?",
      "Все данные будут удалены и ты вернёшься к онбордингу",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Сбросить",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace("/onboarding");
          },
        },
      ]
    );
  };

  const total = (parseFloat(squat) || 0) + (parseFloat(bench) || 0) + (parseFloat(deadlift) || 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 Профиль</Text>
      <Text style={styles.totalText}>Тотал: {total} кг</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Вес тела (кг)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={bodyWeight}
          onChangeText={setBodyWeight}
          placeholderTextColor="#555"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Присед (кг)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={squat}
          onChangeText={setSquat}
          placeholderTextColor="#555"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Жим (кг)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={bench}
          onChangeText={setBench}
          placeholderTextColor="#555"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Тяга (кг)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={deadlift}
          onChangeText={setDeadlift}
          placeholderTextColor="#555"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {saved ? "✅ Сохранено!" : "Сохранить"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Сбросить данные</Text>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
  },
  totalText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 32,
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
  saveButton: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  resetButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  resetButtonText: {
    fontSize: 16,
    color: "#555",
  },
});