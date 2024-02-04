import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import MeteoView from "../components/MeteoView.jsx";
const image = {
  uri: "https://images.pexels.com/photos/912110/pexels-photo-912110.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="white" // Set status bar background color to black
        barStyle="light-content" // Set status bar text color to white
      />
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <MeteoView></MeteoView>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
