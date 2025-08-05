import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { MENU_DATA } from "@/data/menu-data";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

export const teamGrid = [
  {
    id: "1",
    photoImage: require("@/assets/images/equipe-grid-1.png"),
    pageImage: require("@/assets/images/equipe-membro-1.png"),
  },
  {
    id: "2",
    photoImage: require("@/assets/images/equipe-grid-2.png"),
    pageImage: require("@/assets/images/equipe-membro-2.png"),
  },
  {
    id: "3",
    photoImage: require("@/assets/images/equipe-grid-3.png"),
    pageImage: require("@/assets/images/equipe-membro-3.png"),
  },
  {
    id: "4",
    photoImage: require("@/assets/images/equipe-grid-4.png"),
    pageImage: require("@/assets/images/equipe-membro-4.png"),
  },
  {
    id: "5",
    photoImage: require("@/assets/images/equipe-grid-5.png"),
    pageImage: require("@/assets/images/equipe-membro-5.png"),
  },
];

interface INavigation {
  navigate: (data: string, params: { id: string }) => void;
  goBack: () => void;
}

const FIRST_INDEX = 0;

const Grid = () => {
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

  const handlePress = (id: string) => {
    navigation.navigate("member", { id });
  };

  const handleLerTexto = () => {
    if (isSpeaking) {
      speechController.stop();
      setIsSpeaking(false);
      return;
    }

    const text = MENU_DATA[FIRST_INDEX].pages[FIRST_INDEX].texto;

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

      <View style={styles.grid}>
        {teamGrid?.map((value) => (
          <TouchableOpacity
            key={value?.id}
            style={{ ...styles.button }}
            onPress={() => handlePress(value?.id)}
          >
            <Image source={value?.photoImage} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
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
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  grid: {
    width: viewportWidth,
    padding: 10,
    flexDirection: "row",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    marginVertical: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 15,
  },
  soundIcon: {
    width: 24,
    height: 24,
    tintColor: "#ffffff",
  },
});

export default Grid;
