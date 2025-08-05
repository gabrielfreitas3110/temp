import { Dimensions, Image, Text, View, StyleSheet } from 'react-native';

const ImgSource = require("@/assets/images/background-about.png");

const { width, height } = Dimensions.get('window');

export default function AboutScreen() {
  return (
    <View style={{...styles.container}}>
        <Image source={ImgSource} style={{width: '100%', objectFit: 'contain'}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    flex: 1,
  },
  text: {
    color: '#fff',
  },
});
