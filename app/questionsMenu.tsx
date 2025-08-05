import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";

interface INavigation {
  navigate: (data: string, params: { title: string }) => void;
  goBack: () => void;
}

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const QuestionsMenu = () => {
  const navigation = useNavigation<INavigation>();
  const { title } = useLocalSearchParams<{ title?: string }>();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speechController = useMemo(
    () => ({
      start: (text: string, onDone: () => void) => {
        Speech.stop();
        Speech.speak(text, {
          language: "pt-BR",
          pitch: 1.0,
          rate: 1.0,
          onDone: onDone,
          onStopped: onDone,
          onError: onDone,
        });
      },
      stop: () => Speech.stop(),
    }),
    []
  );

  const handleLerTexto = () => {
    if (isSpeaking) {
      speechController.stop();
      setIsSpeaking(false);
      return;
    }

    const text = "Quiz de mútipla escolha questões 1 a 3 REsoistas rápidas para fixar o conteúdo. Ver perguntas Perguntas abertas Questões 4 a 8 Responda com suas próprias palavras e aprofunde o entendimento. Ver perguntas";

    speechController.start(text || "Erro ao detectar texto", () =>
      setIsSpeaking(false)
    );
    setIsSpeaking(true);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (isSpeaking) {
          speechController.stop();
          setIsSpeaking(false);
        }
      };
    }, [isSpeaking])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || "not found"}</Text>
        <TouchableOpacity onPress={handleLerTexto}>
          <Image
            source={
              isSpeaking
                ? require("@/assets/images/no-sound-icon.png")
                : require("@/assets/images/sound-icon.png")
            }
            style={styles.soundIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.main}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧠 Quiz de múltipla escolha</Text>
          <Text style={styles.cardDescription}>
            Questões 1 a 3 • Respostas rápidas para fixar o conteúdo.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("quiz", { title: "Exercícios e aplicações" })
            }
          >
            <Text style={styles.buttonText}>Ver perguntas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>✍️ Perguntas abertas</Text>
          <Text style={styles.cardDescription}>
            Questões 4 a 8 • Responda com suas próprias palavras e aprofunde o
            entendimento.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("slides", {
                title: "Exercícios e aplicações",
              })
            }
          >
            <Text style={styles.buttonText}>Ver perguntas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    maxHeight: viewportHeight,
  },
  main: {
    padding: 25,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#284f7f",
    marginBottom: 40,
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  soundIcon: {
    width: 24,
    height: 24,
    tintColor: "#ffffff",
  },
});

export default QuestionsMenu;
