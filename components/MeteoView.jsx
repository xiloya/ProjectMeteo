import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Switch,
  TouchableOpacity,
} from "react-native";

const MeteoView = () => {
  return (
    <View style={styles.weatherContent}>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Fahrenheit</Text>
        <Switch
          thumbColor="#ffffff"
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
        <Text style={styles.switchLabel}>Celsius</Text>
      </View>
      <View style={styles.inputView}>
        <Text style={styles.inputClass}>City Name</Text>
        <TouchableOpacity>
          <Image
            source={require("../assets/empty.png")}
            style={{ marginLeft: 5, width: 40, height: 40 }}
          />
        </TouchableOpacity>
      </View>

      <Image
        source={require("../assets/sun.gif")}
        style={{ width: 120, height: 120 }}
      />
      <Text style={styles.weatherStatus}>Clear Sky</Text>
      <Text id="temp" style={styles.currentWeatherValue}>
        25.00°C
      </Text>
      <Text style={styles.feelsLike}>Feels Like: 25.00°C</Text>
      <View style={styles.pictureRow}>
        <Image
          source={require("../assets/cloud.gif")}
          style={[styles.picture, { marginHorizontal: 5 }]}
        />
        <Image
          source={require("../assets/thunderstorm.png")}
          style={[styles.picture, { marginHorizontal: 5 }]}
        />
        <Image
          source={require("../assets/rain.png")}
          style={[styles.picture, { marginHorizontal: 5 }]}
        />
        {/* Add more pictures as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherContent: {
    flex: 1,
    marginTop: 0,
    alignItems: "center",
    padding: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  switchLabel: {
    color: "white",
    marginRight: 5,
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputClass: {
    height: 45,
    borderColor: "gray",
    fontSize: 20,
    backgroundColor: "white",
    borderRadius: 100,
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 10,
    width: 300,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    marginTop: 20,
  },
  forecastItemContainer: {
    alignItems: "center",
    margin: 10,
  },
  forecastDateTime: {
    fontSize: 16,
    color: "white",
  },
  forecastIcon: {
    width: 50,
    height: 50,
    marginVertical: 10,
  },
  forecastTemperature: {
    fontSize: 16,
    color: "white",
  },
  weatherStatus: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 45,
    fontWeight: "bold",
    color: "white",
  },
  currentWeatherValue: {
    fontSize: 70,
    color: "white",
    marginBottom: 30,
  },
  feelsLike: {
    fontSize: 30,
    color: "white",
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },
  pictureRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  picture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 30,
    marginLeft: 30,
  },
});

export default MeteoView;
