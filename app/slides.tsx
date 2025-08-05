import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MENU_DATA } from "@/data/menu-data";
import * as Speech from "expo-speech";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const slides = MENU_DATA;

const texto = "Olá! Este é um exemplo de acessibilidade com leitura de texto.";

const Slides = () => {
  const navigation = useNavigation<any>();
  const { title, firstPage } = useLocalSearchParams<{
    title?: string;
    firstPage?: string;
  }>();
  const initialIndex = firstPage ? parseInt(firstPage, 10) - 1 : 0;
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

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

    const pagesList = slides?.find((value) => value?.title === title)?.pages;
    const text =
      title === "Exercícios e aplicações"
        ? pagesList?.[currentIndex + 1]?.texto
        : pagesList?.[currentIndex]?.texto;

    speechController.start(text || "Erro ao detectar texto", () =>
      setIsSpeaking(false)
    );
    setIsSpeaking(true);
  };

  const renderItem = ({
    item,
  }: {
    item: { id: string; imgUrl: ImageSourcePropType };
  }) => (
    <View style={styles.slide}>
      <Image source={item.imgUrl} style={{ flex: 1, objectFit: "contain" }} />
    </View>
  );

  const handleViewableItemsChanged = (viewableItems: { index: number }[]) => {
    if (viewableItems.length > 0) {
      if (isSpeaking) {
        speechController.stop();
        setIsSpeaking(false);
      }

      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);
      Animated.spring(animatedValue, {
        toValue: newIndex,
        useNativeDriver: false,
      }).start();
    }
  };

  const animatedDots =
    slides
      ?.find((value) => value?.title === title)
      ?.images?.map((_, index) => {
        const dotWidth = animatedValue.interpolate({
          inputRange: [index - 0.5, index, index + 0.5],
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });

        const dotColor = animatedValue.interpolate({
          inputRange: [index - 0.5, index, index + 0.5],
          outputRange: ["#888", "#284f7f", "#888"],
          extrapolate: "clamp",
        });

        return { dotWidth, dotColor };
      }) || [];

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

      {title === "Material Suplementar" && (
        <TouchableOpacity
          style={styles.videoButtonContainer}
          onPress={() => navigation.navigate("videoPlayer")}
        >
          <LinearGradient
            colors={["#ff5731", "#af442c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.videoButton}
          >
            <Text style={styles.playerText}>Assistir video</Text>
            <AntDesign name="play" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {title && (
        <FlatList
          data={slides?.find((value) => value?.title === title)?.images || []}
          initialScrollIndex={initialIndex || 0}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          getItemLayout={(_, index) => ({
            length: viewportWidth,
            offset: viewportWidth * index,
            index,
          })}
          onViewableItemsChanged={(data) =>
            handleViewableItemsChanged(data?.viewableItems as any)
          }
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />
      )}

      {title !== "Referências" && (
        <View style={styles.pagination}>
          {animatedDots.map((dot: any, index: any) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { width: dot.dotWidth, backgroundColor: dot.dotColor },
              ]}
            />
          ))}
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
    height: viewportHeight - 50,
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
  videoButtonContainer: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: -20,
    width: 130,
  },
  videoButton: {
    backgroundColor: "#ff5731",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  playerText: {
    color: "white",
    fontWeight: 500,
  },
  soundIcon: {
    width: 24,
    height: 24,
    tintColor: "#ffffff",
  },
});

export default Slides;
