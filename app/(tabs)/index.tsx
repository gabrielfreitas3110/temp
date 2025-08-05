import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing } from "react-native";
import { MENU_DATA } from "@/data/menu-data";

interface Item {
  id: string;
  title: string;
  color: string;
}

interface INavigation {
  navigate: (data: string, params: { title?: string, firstPage?: string }) => void;
}

type SearchInfo = { pages: number[]; total: number };

const ImgSource = require("@/assets/images/menu-icon.png");

export default function Index() {
  const navigation = useNavigation<INavigation>();
  const [search, setSearch] = useState("");
  const characterAnim = useRef(new Animated.Value(0)).current;

  const handlePress = (title: string, itemId: string) => {
    const item = MENU_DATA.find((i) => i.id === itemId);
    const info = searchResults[itemId];
    const currentPage = item?.pages[info?.pages?.[0] - 1]; 
    const firstPage = info?.pages?.[0]?.toString() ?? "";

    
    if(!!currentPage?.link) return navigation.navigate(currentPage?.link, { title, ...currentPage.params });;
    
    if(!search && title === "Exercícios e aplicações") return navigation.navigate("questionsMenu", { title })

    if (title !== "Equipe") return navigation.navigate("slides", { title, firstPage });
    navigation.navigate("grid", { title });
  };

  const normalizeText = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const searchResults = useMemo(() => {
    if (!search.trim()) return {};
    const termoLimpo = normalizeText(search);

    return MENU_DATA.reduce((acc, item) => {
      let total = 0;
      const pages: number[] = [];

      item?.pages?.forEach((p) => {
        const textoLimpo = normalizeText(p.texto);

        let count = 0;
        let pos = textoLimpo.indexOf(termoLimpo);
        while (pos !== -1) {
          count++;
          pos = textoLimpo.indexOf(termoLimpo, pos + termoLimpo.length);
        }

        if (count > 0) {
          pages.push(p.numero);
          total += count;
        }
      });

      if (total > 0) acc[item.id] = { pages, total };
      return acc;
    }, {} as Record<string, SearchInfo>);
  }, [search]);

  const dataToShow = useMemo(() => {
    if (!search.trim()) return MENU_DATA;
    return MENU_DATA.filter((item) => searchResults[item.id]);
  }, [search, searchResults]);

  const renderItem = ({ item }: any) => {
    const info = searchResults[item.id];

    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress(item.title, item.id)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[item.color, darkenColor(item.color, 0.6)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.item}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.buttonText}>{item.title}</Text>

            {info && (
              <Text style={styles.matchText}>
                {info.pages.length === 1
                  ? `Encontrado na página ${info.pages[0]}`
                  : `Encontrado ${info.total}× (páginas ${info.pages.join(
                      ", "
                    )})`}
              </Text>
            )}
          </View>
          <Image source={ImgSource} style={styles.image} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    Animated.timing(characterAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const animatedStyle = {
    opacity: characterAnim,
    transform: [
      {
        translateY: characterAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [150, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.main}>
        <View style={styles.characterImageContainer}>
          <Animated.Image
            source={require("@/assets/images/character-icon.png")}
            style={[styles.characterImage, animatedStyle]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pesquisar termo..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
          {!!search.length && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              style={styles.clearButton}
            >
              <Image
                source={require("@/assets/images/x-icon.png")}
                style={styles.clearIcon}
              />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={dataToShow}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const darkenColor = (hex: string, factor: number) => {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.floor((num >> 16) * factor);
  const g = Math.floor(((num >> 8) & 0x00ff) * factor);
  const b = Math.floor((num & 0x0000ff) * factor);
  return `rgb(${r}, ${g}, ${b})`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  button: { marginVertical: 10 },
  item: {
    flexDirection: "row",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  matchText: {
    color: "#f1f1f1",
    marginTop: 4,
    fontSize: 14,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 40,
    marginLeft: 10,
  },
  characterImageContainer: { alignItems: "center", marginBottom: 25 },
  characterImage: { width: 100, height: 100, borderRadius: 75 },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "#000",
  },
  searchContainer: {
    position: "relative",
    justifyContent: "center",
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: 8,
    padding: 5,
  },
  clearIcon: {
    width: 13,
    height: 13,
    tintColor: "#888",
  },
});
