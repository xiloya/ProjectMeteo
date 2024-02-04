import { StyleSheet, View } from "react-native";
import MeteoView from "./sceen/home.sceen.jsx";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import FavoriteScreen from "./sceen/favoris.screen.jsx";
const Drawer = createDrawerNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="SkyView">
        <Drawer.Screen name="SkyView" component={MeteoView} />
        <Drawer.Screen name="Favorites" component={FavoriteScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 150,
  },
});
