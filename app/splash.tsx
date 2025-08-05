import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { hideAsync } from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet } from "react-native";

type Props = {
  onComplete: (status: boolean) => void;
};

export const Splash = ({ onComplete }: Props) => {
  const [lastStatus, setStatus] = useState<AVPlaybackStatus>(
    {} as AVPlaybackStatus
  );

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (lastStatus.isLoaded !== status.isLoaded) {
        hideAsync();
      }

      if (status.didJustFinish) {
        onComplete(true);
      }
    }
  };

  return (
    <>
      <StatusBar hidden={true} />
      <Video
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        source={require("@/assets/images/splash.mp4")}
        isLooping={false}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        shouldPlay={true}
      />
    </>
  );
};
