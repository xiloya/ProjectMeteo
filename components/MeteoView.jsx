import { DeviceEventEmitter } from "react-native";

import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Switch,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import storage from "../Storage";
const WeatherInfo = () => {
  const [weatherImage, setWeatherImage] = useState(
    require("../assets/rain.gif")
  );
  const [favoriteButton, setFavoriteButton] = useState(
    require("../assets/empty.png")
  );
  const [geoLocation, setGeoLocation] = useState({});
  const [location, setLocation] = useState("Enter a city");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [currentWeather, setCurrentWeather] = useState({
    weather: [{ description: "" }],
    main: { temp: "", feels_like: "" },
  });
  const [forecast, setForecast] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = "2d195320deb6060d2f817f29b65eed71";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}`;
  const addressApi = `https://api-adresse.data.gouv.fr/search/?q=${location}&limit=1`;

  const fetchWeather = async () => {
    try {
      const res = await axios.get(weatherUrl);
      let weatherDesc = res.data.weather[0].description;
      setWeatherImage(handleWeatherImage(weatherDesc));
      setCurrentWeather(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching weather data");
    }
  };

  const fetchForecast = async () => {
    try {
      const res = await axios.get(forecastUrl);
      const forecastData = processForecastData(res.data.list);
      setForecast(forecastData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching forecast data");
    }
  };

  const fetchLocation = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status == "granted") {
      // get geo location
      let location = await Location.getCurrentPositionAsync();
      console.log(location);
      setLat(location.coords.latitude);
      setLong(location.coords.longitude);
    } else {
      searchLocation("paris"); // paris by default
    }
  };

  const processForecastData = (forecastList) => {
    const uniqueDateTimeMap = new Map();

    const filteredForecast = forecastList.filter((item) => {
      const dateTime = item.dt_txt;
      if (!uniqueDateTimeMap.has(dateTime)) {
        uniqueDateTimeMap.set(dateTime, true);
        return true;
      }
      return false;
    });

    const formattedForecast = filteredForecast.map((item) => ({
      dateTime: item.dt_txt,
      description: item.weather[0].description,
      temperature: convertTemperature(parseInt(item.main.temp) - 273),
    }));

    return formattedForecast;
  };

  const convertTemperature = (temperature) => {
    return isCelsius ? temperature : (temperature * 9) / 5 + 32;
  };

  const handleWeatherImage = (weatherDesc) => {
    switch (weatherDesc) {
      case "overcast clouds":
      case "few clouds":
      case "fog":
      case "mist":
      case "haze":
        return require("../assets/cloud.gif");
        break;
      case "clear sky":
        return require("../assets/sun.gif");
        break;
      case "light rain":
      case "moderate rain":
      case "heavy rain":
      case "drizzle":
        return require("../assets/rain.gif");
        break;
      case "snow":
      case "sleet":
      case "freezing rain":
        return require("../assets/snow.gif");
        break;
      case "thunderstorm":
      case "thunderstorm with rain":
        return require("../assets/thunderstorm.gif");
        break;
      default:
        return require("../assets/sun.gif");
        break;
    }
  };

  const addToFavorites = async () => {
    try {
      const isFavorite = await checkIfFavorite();
      const key = "favorites";
      const existingData = await storage.load({ key });
      const locationToAdd = placeholder;
      if (!isFavorite) {
        const updatedData = {
          value: [...(existingData?.value || []), locationToAdd],
        };
        await storage.save({ key, data: updatedData });
        DeviceEventEmitter.emit("update");
        setFavoriteButton(require("../assets/filledStar.png"));
      } else {
        let value = [...(existingData?.value || [])];
        const index = value.indexOf(locationToAdd);

        if (index > -1) {
          value.splice(index, 1);
        }

        const updatedData = { value };
        await storage.save({ key, data: updatedData });
        DeviceEventEmitter.emit("update");
        setFavoriteButton(require("../assets/empty.png"));
      }
    } catch (error) {
      console.error("Error in addToFavorites:", error);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const allIds = await storage.load({ key: "favorites" });
      console.log(allIds);
      if (allIds.value.includes(location)) return true;
      return false;
    } catch (error) {
      return false;
    }
  };
  const [placeholder, setPlaceholder] = useState(
    "Enter a city or location name"
  );
  const searchLocation = async (text) => {
    try {
      const res = await axios.get(addressApi);
      setLat(res.data.features[0].geometry.coordinates[1]);
      setLong(res.data.features[0].geometry.coordinates[0]);
      setPlaceholder(res.data.features[0].properties.label);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching location data");
    }
  };

  useEffect(() => {
    const init = async () => {
      if (await checkIfFavorite()) {
        setFavoriteButton(require("../assets/filledStar.png"));
      } else {
        setFavoriteButton(require("../assets/empty.png"));
      }

      await fetchLocation();
      if (lat !== 0 && long !== 0) {
        await fetchWeather();
        await fetchForecast();
      }
    };
    init();
  }, [lat, long, isCelsius]);

  const renderForecastItem = ({ item }) => (
    <View style={styles.forecastItemContainer}>
      <Text style={styles.forecastDateTime}>
        {formatDateTime(item.dateTime)}
      </Text>
      <Image
        source={getWeatherIcon(item.description)}
        style={styles.forecastIcon}
      />
      <Text style={styles.forecastTemperature}>
        {item.temperature.toFixed(2)}°{isCelsius ? "C" : "F"}
      </Text>
    </View>
  );

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return `${formatDay(dateTime)} ${formatTime(dateTime)}`;
  };

  const formatDay = (date) => {
    const options = { weekday: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const formatTime = (date) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const getWeatherIcon = (weatherDesc) => {
    return handleWeatherImage(weatherDesc);
  };

  return (
    <View style={styles.weatherContent}>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Fahrenheit</Text>
        <Switch
          value={isCelsius}
          onValueChange={(value) => setIsCelsius(value)}
          thumbColor="#ffffff"
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
        <Text style={styles.switchLabel}>Celsius</Text>
      </View>
      <View style={styles.inputView}>
        <TextInput
          placeholder={placeholder}
          style={styles.inputClass}
          onChangeText={(text) => setLocation(text)}
          onSubmitEditing={() => searchLocation(location)}
        />

        <TouchableOpacity onPress={addToFavorites}>
          <Image
            onPress={addToFavorites}
            source={favoriteButton}
            style={{ marginLeft: 5, width: 40, height: 40 }}
          ></Image>
        </TouchableOpacity>
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Image source={weatherImage} style={{ width: 120, height: 120 }} />
          <Text style={styles.weatherStatus}>
            {currentWeather.weather[0].description}
          </Text>
          <Text id="temp" style={styles.currentWeatherValue}>
            {convertTemperature(
              parseInt(currentWeather.main.temp) - 273
            ).toFixed(2)}
            °{isCelsius ? "C" : "F"}
          </Text>
          <Text style={styles.feelsLike}>
            Feels Like:{" "}
            {convertTemperature(
              parseInt(currentWeather.main.feels_like) - 273
            ).toFixed(2)}
            °{isCelsius ? "C" : "F"}
          </Text>
          {forecast.length > 0 && (
            <View>
              <Text style={styles.forecastTitle}>5-Day Forecast:</Text>
              <FlatList
                horizontal
                data={forecast}
                keyExtractor={(item) => item.dateTime}
                renderItem={renderForecastItem}
              />
            </View>
          )}
        </>
      )}
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
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },
  inputClass: {
    height: 45,
    borderColor: "gray",
    fontSize: 15,
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
});

export default WeatherInfo;
