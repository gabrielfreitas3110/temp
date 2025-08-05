import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { teamGrid } from "./grid";
import * as Speech from "expo-speech";
import { MENU_DATA } from "@/data/menu-data";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
const FIRST_INDEX = 0;

const Member = () => {
  const navigation = useNavigation<any>();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
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

    const text = MENU_DATA[FIRST_INDEX].pages[Number(id)].texto;

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
        <Text style={styles.headerTitle}>Equipe (Membro)</Text>
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

      {id && (
        <View style={styles.slide}>
          <Image
            source={teamGrid?.find((value) => value?.id === id)?.pageImage}
            style={{ flex: 1, objectFit: "contain" }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#284f7f",
    zIndex: 100,
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  slide: {
    width: viewportWidth,
    height: viewportHeight - 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  soundIcon: {
    width: 24,
    height: 24,
    tintColor: "#ffffff",
  },
});

export default Member;
