import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";

// Type adı şekli düzeltilecek
type typeitem = {
  id: string;
  poster_path: string;
  title: string;
};

type SearchScreenProp = NativeStackScreenProps<
  InsideStackParamList,
  "SearchScreen"
>;

const SearchScreen = ({ navigation }: SearchScreenProp) => {
  const [searchQuery, setSearchQuery] = useState(""); // State type belirtilecek
  const [movieResults, setMovieResults] = useState([]); // State type belirtilecek
  const [showResults, setShowResults] = useState(false); // State type belirtilecek
  const textInputRef = useRef(null);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus(); // Bu hatayı çözümleyeceğiz
    }
  }, []);

  const apiKey = "23e3cc0416f703df9256c5e82ba0e5fb"; // .env dosyasına alınacak

  const search = async (mediaType: string) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${mediaType}?api_key=${apiKey}&query=${searchQuery}`
      );
      if (!response.ok) {
        throw new Error("Arama sırasında bir hata oluştu.");
      }
      const data = await response.json();

      if (mediaType === "movie") {
        setMovieResults(data.results);
      }
      setShowResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    if (text.length > 0) {
      search("movie");
    } else {
      setShowResults(false);
    }
  };

  return (
    <ScrollView className="bg-black">
      <View className="bg-black">
        <Text className="color-white text-2xl">Moview'de Ara</Text>
        <TextInput
          ref={textInputRef}
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-3 pl-2"
          onChangeText={handleSearchChange}
          placeholder="Aramak istediğiniz şey"
          placeholderTextColor="white"
          value={searchQuery}
        />
        {showResults && (
          <View>
            <FlatList
              data={movieResults}
              keyExtractor={(item: typeitem) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AddReview", { movieid: item.id })
                  }
                  className="flex-row items-center m-2"
                >
                  <Image
                    className="w-28 h-40 bg-red-500 m-1"
                    source={{
                      uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
                    }}
                  />
                  <Text className="color-white m-1">{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default SearchScreen;