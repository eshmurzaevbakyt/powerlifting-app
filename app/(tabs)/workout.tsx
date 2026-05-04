import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Set = {
  weight: number;
  reps: number;
  done: boolean;
  isAmrap?: boolean; // последний подход на максимум
};

type ExerciseBlock = {
  key: string;
  name: string;
  sets: Set[];
  isWarmup?: boolean;
};

// Разминочные подходы от максимума
function getWarmupSets(max: number): Set[] {
  return [
    { weight: 20, reps: 10, done: false },
    { weight: Math.round(max * 0.35 / 2.5) * 2.5, reps: 5, done: false },
    { weight: Math.round(max * 0.57 / 2.5) * 2.5, reps: 3, done: false },
    { weight: Math.round(max * 0.74 / 2.5) * 2.5, reps: 2, done: false },
    { weight: Math.round(max * 0.86 / 2.5) * 2.5, reps: 1, done: false },
  ];
}

// Рабочие подходы для новичка
function getNoviceWorkSets(weight: number, useAmrap: boolean): Set[] {
  return [
    { weight, reps: 10, done: false },
    { weight, reps: 10, done: false },
    { weight, reps: 10, done: false },
    { weight, reps: 10, done: false, isAmrap: useAmrap },
  ];
}

// Рабочие подходы для опытного (85% от 1RM, 4×5)
function getExperiencedWorkSets(max: number, useAmrap: boolean): Set[] {
  const w = Math.round(max * 0.85 / 2.5) * 2.5;
  return [
    { weight: w, reps: 5, done: false },
    { weight: w, reps: 5, done: false },
    { weight: w, reps: 5, done: false },
    { weight: w, reps: 5, done: false, isAmrap: useAmrap },
  ];
}

// Подсобное упражнение
function getAccessorySets(weight: number, sets: number, reps: number): Set[] {
  return Array(sets).fill(null).map(() => ({ weight, reps, done: false }));
}

// Определяем нужно ли AMRAP (после 3 недель)
function shouldUseAmrap(startDate: string): boolean {
  const start = new Date(startDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 21;
}

// Определяем день тренировки (1, 2, 3 или null=отдых)
function getTodayTrainingDay(dayOption: string): number | null {
  const day = new Date().getDay(); // 0=вс,1=пн...6=сб
  if (dayOption === "mon-wed-fri") {
    if (day === 1) return 1;
    if (day === 3) return 2;
    if (day === 5) return 3;
  } else {
    if (day === 2) return 1;
    if (day === 4) return 2;
    if (day === 6) return 3;
  }
  return null;
}

export default function Workout() {
  const [blocks, setBlocks] = useState<ExerciseBlock[]>([]);
  const [isRestDay, setIsRestDay] = useState(false);
  const [noProgramSet, setNoProgramSet] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadWorkout();
    }, [])
    );

  const loadWorkout = async () => {
    const progRaw = await AsyncStorage.getItem("programSettings");
    const exRaw = await AsyncStorage.getItem("exerciseState");

    if (!progRaw || !exRaw) {
      setNoProgramSet(true);
      setLoading(false);
      return;
    }

    const prog = JSON.parse(progRaw);
    const ex = JSON.parse(exRaw);
    const trainingDay = getTodayTrainingDay(prog.dayOption);
    const amrap = shouldUseAmrap(prog.startDate);

    if (!trainingDay) {
      setIsRestDay(true);
      setLoading(false);
      return;
    }

    let newBlocks: ExerciseBlock[] = [];

    if (trainingDay === 1) {
      // День 1: Становая + подсобка
      const warmup = getWarmupSets(ex.deadlift.weight);
      const work = prog.isNovice
        ? getNoviceWorkSets(ex.deadlift.weight, amrap)
        : getExperiencedWorkSets(ex.deadlift.weight, amrap);

      newBlocks = [
        { key: "deadlift_warmup", name: "Становая тяга — Разминка 🏋️", sets: warmup, isWarmup: true },
        { key: "deadlift", name: "Становая тяга — Рабочие подходы", sets: work },
        { key: "hyperextension", name: "Гиперэкстензия", sets: getAccessorySets(ex.hyperextension.weight, 3, 10) },
        { key: "arnold_press", name: "Жим Арнольда", sets: getAccessorySets(ex.arnold_press.weight, 4, 10) },
        { key: "reverse_curl", name: "Сгибание обратным хватом", sets: getAccessorySets(ex.reverse_curl.weight, 3, 10) },
        { key: "wrist_curl", name: "Сгибание предплечий", sets: getAccessorySets(ex.wrist_curl.weight, 3, 12) },
      ];
    } else if (trainingDay === 2) {
      // День 2: Жим + подсобка
      const warmup = getWarmupSets(ex.bench.weight);
      const work = prog.isNovice
        ? getNoviceWorkSets(ex.bench.weight, amrap)
        : getExperiencedWorkSets(ex.bench.weight, amrap);

      newBlocks = [
        { key: "bench_warmup", name: "Жим лёжа — Разминка 💪", sets: warmup, isWarmup: true },
        { key: "bench", name: "Жим лёжа — Рабочие подходы", sets: work },
        { key: "dumbbell_press", name: "Жим гантелями", sets: getAccessorySets(ex.dumbbell_press.weight, 3, 10) },
        { key: "tricep_rope", name: "Косичка на трицепс", sets: getAccessorySets(ex.tricep_rope.weight, 4, 10) },
        { key: "overhead_tricep", name: "Подъём гантели за головой", sets: getAccessorySets(ex.overhead_tricep.weight, 3, 10) },
      ];
    } else {
      // День 3: Присед + подсобка
      const warmup = getWarmupSets(ex.squat.weight);
      const work = prog.isNovice
        ? getNoviceWorkSets(ex.squat.weight, amrap)
        : getExperiencedWorkSets(ex.squat.weight, amrap);

      newBlocks = [
        { key: "squat_warmup", name: "Присед — Разминка 🦵", sets: warmup, isWarmup: true },
        { key: "squat", name: "Присед — Рабочие подходы", sets: work },
        { key: "leg_press", name: "Жим ногами", sets: getAccessorySets(ex.leg_press.weight, 3, 10) },
        { key: "assisted_pullup", name: "Подтягивания на тренажере", sets: getAccessorySets(ex.assisted_pullup.weight, 4, 10) },
        { key: "ez_curl", name: "Сгибания EZ-гриф", sets: getAccessorySets(ex.ez_curl.weight, 4, 10) },
      ];
    }

    setBlocks(newBlocks);
    setLoading(false);
  };

  const toggleSet = (blockIndex: number, setIndex: number) => {
    const updated = [...blocks];
    updated[blockIndex].sets[setIndex].done = !updated[blockIndex].sets[setIndex].done;
    setBlocks(updated);
  };

  const updateWeight = (blockIndex: number, setIndex: number, value: string) => {
    const updated = [...blocks];
    updated[blockIndex].sets[setIndex].weight = parseFloat(value) || 0;
    setBlocks(updated);
  };

  const updateReps = (blockIndex: number, setIndex: number, value: string) => {
    const updated = [...blocks];
    updated[blockIndex].sets[setIndex].reps = parseInt(value) || 0;
    setBlocks(updated);
  };

  const allMainDone = blocks
    .filter(b => !b.isWarmup)
    .every(b => b.sets.every(s => s.done));

  const handleFinish = async () => {
    // Сохраняем историю
    const histRaw = await AsyncStorage.getItem("workoutHistory");
    const history = histRaw ? JSON.parse(histRaw) : [];

    const totalVolume = blocks
      .flatMap(b => b.sets)
      .filter(s => s.done)
      .reduce((sum, s) => sum + s.weight * s.reps, 0);

    history.unshift({
      date: new Date().toISOString().split("T")[0],
      blocks: blocks.map(b => ({ name: b.name, sets: b.sets })),
      totalVolume,
    });
    await AsyncStorage.setItem("workoutHistory", JSON.stringify(history));

    // Обновляем веса на следующую тренировку
    const exRaw = await AsyncStorage.getItem("exerciseState");
    const ex = JSON.parse(exRaw!);
    const progRaw = await AsyncStorage.getItem("programSettings");
    const prog = JSON.parse(progRaw!);

    for (const block of blocks) {
      if (block.isWarmup) continue;
      const allBlockDone = block.sets.every(s => s.done);

      // Основные движения
      if (["deadlift", "bench", "squat"].includes(block.key)) {
        const lastSet = block.sets[block.sets.length - 1];

        if (lastSet.isAmrap && lastSet.done) {
          // Считаем 1RM по формуле Эпли
          const oneRM = Math.round(lastSet.weight * (1 + lastSet.reps / 30) / 2.5) * 2.5;
          ex[block.key].weight = oneRM;
        } else if (allBlockDone) {
          ex[block.key].weight += 2.5;
        }
        ex[block.key].completedRows = allBlockDone
          ? ex[block.key].completedRows + 1
          : 0;
      } else {
        // Подсобка — прогрессия если 3 тренировки подряд выполнено
        if (allBlockDone) {
          ex[block.key].completedRows += 1;
          if (ex[block.key].completedRows >= 3) {
            ex[block.key].weight += 2.5;
            ex[block.key].completedRows = 0;
          }
        } else {
          ex[block.key].completedRows = 0;
        }
      }
    }

    await AsyncStorage.setItem("exerciseState", JSON.stringify(ex));
    alert(`Тренировка завершена! 💥\nОбъём: ${Math.round(totalVolume)} кг`);
    loadWorkout(); // перезагружаем с новыми весами
  };

  if (loading) {
    return <View style={styles.container}><Text style={styles.loading}>Загрузка...</Text></View>;
  }

  if (noProgramSet) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🏋️ Тренировка</Text>
        <Text style={styles.restText}>Сначала выбери программу во вкладке 📋</Text>
      </View>
    );
  }

  if (isRestDay) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🏋️ Тренировка</Text>
        <Text style={styles.restText}>Сегодня день отдыха 💤{"\n"}Восстанавливайся</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏋️ Тренировка</Text>
      <Text style={styles.hint}>Нажми на подход чтобы отметить. Вес и повторения можно менять.</Text>

      {blocks.map((block, blockIndex) => (
        <View key={block.key} style={styles.block}>
          <Text style={[styles.blockTitle, block.isWarmup && styles.warmupTitle]}>
            {block.name}
          </Text>

          <View style={styles.setsHeader}>
            <Text style={[styles.headerText, { flex: 0.5 }]}>#</Text>
            <Text style={styles.headerText}>Вес</Text>
            <Text style={styles.headerText}>Повт.</Text>
            <Text style={[styles.headerText, { flex: 0.8 }]}>✓</Text>
          </View>

          {block.sets.map((set, setIndex) => (
            <View key={setIndex} style={[styles.setRow, set.done && styles.setRowDone]}>
              <Text style={[styles.setText, { flex: 0.5 }]}>{setIndex + 1}</Text>

              <TextInput
                style={styles.setInput}
                value={String(set.weight)}
                onChangeText={(v) => updateWeight(blockIndex, setIndex, v)}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.setInput}
                value={String(set.reps)}
                onChangeText={(v) => updateReps(blockIndex, setIndex, v)}
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={[styles.doneButton, { flex: 0.8 }]}
                onPress={() => toggleSet(blockIndex, setIndex)}
              >
                <Text style={styles.setText}>
                  {set.isAmrap ? (set.done ? "✅MAX" : "⬜MAX") : (set.done ? "✅" : "⬜")}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}

      {allMainDone && (
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Завершить тренировку 🔥</Text>
        </TouchableOpacity>
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
  loading: { color: "#888", fontSize: 16, textAlign: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#FFD700", marginBottom: 8 },
  hint: { color: "#444", fontSize: 13, marginBottom: 24 },
  restText: { color: "#888", fontSize: 16, textAlign: "center", marginTop: 60, lineHeight: 28 },
  block: {
    marginBottom: 28,
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  blockTitle: { color: "#FFD700", fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  warmupTitle: { color: "#888" },
  setsHeader: { flexDirection: "row", marginBottom: 8 },
  headerText: { color: "#555", fontSize: 12, flex: 1, textAlign: "center" },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#333",
  },
  setRowDone: { borderColor: "#FFD700", backgroundColor: "#1a1500" },
  setText: { color: "#fff", fontSize: 14, flex: 1, textAlign: "center" },
  setInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "#222",
    borderRadius: 6,
    padding: 4,
    marginHorizontal: 4,
  },
  doneButton: { alignItems: "center" },
  finishButton: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  finishButtonText: { fontSize: 16, fontWeight: "bold", color: "#000" },
});