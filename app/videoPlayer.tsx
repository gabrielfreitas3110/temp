import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import * as ScreenOrientation from 'expo-screen-orientation';

const { width, height } = Dimensions.get("window");

const VideoPlayer = () => {
  const navigation = useNavigation<any>();
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const onFullScreenUpdate = async (status: any) => {
    const { fullscreenUpdate } = status;
  
    if (fullscreenUpdate === 1) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Material Suplementar (Vídeo)</Text>
      </View>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={require("../assets/videos/experimento-pilha-de-limao.mp4")}
          style={styles.video}
          useNativeControls
          onLoadStart={() => setIsLoading(true)}
          onReadyForDisplay={() => setIsLoading(false)}
          shouldPlay
          onFullscreenUpdate={onFullScreenUpdate}
          resizeMode={"contain" as ResizeMode}
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="red" />
          </View>
        )}
        <Text style={styles.videoTitle}>Experimento: Pilha de Limão</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#284f7f",
    zIndex: 100,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  loadingContainer: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
  },
  videoContainer: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    paddingTop: 36,
  },
  video: {
    width: width - 32,
    height: (width - 32) * 9 / 16,
    borderRadius: 10
  },
  videoTitle: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: "bold",
    color: "#3e3e3e",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
  },
});

export default VideoPlayer;
