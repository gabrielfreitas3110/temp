import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Image, TouchableOpacity } from "react-native";
import { useEffect, useMemo, useState } from "react";
import * as Speech from "expo-speech";
import { StatusBar } from "expo-status-bar";
import { useRouter, usePathname } from "expo-router";
export default function TabLayout() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const pathname = usePathname();

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

    const text =
      pathname === "/about"
        ? "Ao estudante e professor Autoria Maraína Medeiros Fernandes Revisão Sheila Cristina Canobre Revisão Fábio Augusto do Amaral Revisão Simone Machado Goulart Programação Gabriel Augusto Costa de Freitas Este aplicativo tem por finalidade dispor ao professor de Química um material educativo virtual com enfoque nos conteúdos básicos de eletroquímica. Além disso, o app foi elaborado levando-se em consideração uma abordagem contextualizada e linguagem científica. Nossa missão é dispor ao docente e discente uma ferramenta capaz de dar suporte ao trabalho docente e, ao mesmo tempo, podendo ser utilizada como estratégia de ensino-aprendizagem virtual sem a presença efetiva do professor. Home Sobre"
        : "equipe, reações de oxirredução, pilhas e eletrólise, exercícios e aplicações, gabarito, material suplementar e referências. Home Sobre";

    speechController.start(text || "Texto não disponível", () =>
      setIsSpeaking(false)
    );
    setIsSpeaking(true);
  };

  useEffect(() => {
    if (isSpeaking) {
      speechController.stop();
      setIsSpeaking(false);
    }
  }, [pathname]);

  return (
    <>
      <StatusBar hidden />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ffffff",
          tabBarInactiveTintColor: "#7288a3",
          headerStyle: {
            backgroundColor: "#284f7f",
          },
          headerShadowVisible: false,
          headerTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#284f7f",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerTitle: "Eletroquímica no Cotidiano",
            headerTitleAlign: "center",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={24}
              />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={handleLerTexto}
                style={{ marginRight: 15 }}
              >
                <Image
                  source={
                    isSpeaking
                      ? require("@/assets/images/no-sound-icon.png")
                      : require("@/assets/images/sound-icon.png")
                  }
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: "Sobre",
            headerTitleAlign: "center",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={
                  focused ? "information-circle" : "information-circle-outline"
                }
                color={color}
                size={24}
              />
            ),
            headerLeft: () => {
              const navigation = useNavigation<any>();
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate("index")}
                  style={{ marginLeft: 15, marginRight: 10 }}
                >
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
              );
            },
            headerRight: () => (
              <TouchableOpacity
                onPress={handleLerTexto}
                style={{ marginRight: 15 }}
              >
                <Image
                  source={
                    isSpeaking
                      ? require("@/assets/images/no-sound-icon.png")
                      : require("@/assets/images/sound-icon.png")
                  }
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
