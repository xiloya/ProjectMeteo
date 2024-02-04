
import SearchBar from '../components/SearchBar';
import { View, StyleSheet } from 'react-native';

const Home = () => {
  const handleSearch = (searchTerm) => {

    console.log(`Recherche en cours pour : ${searchTerm}`);
  };

  return (
        <View>
          <SearchBar onSearch={handleSearch} />
        </View>

  );
};

const styles = StyleSheet.create({
    
})
export default Home;
