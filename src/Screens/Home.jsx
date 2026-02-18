import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import axios from 'axios';

const Home = () => {

  useEffect(() => {
    testApi();
  }, []);

  const testApi = async () => {
    try {
      const res = await axios.get(
        "https://saavn.sumit.co/api/search/songs",
        {
          params: { query: "arijit" }
        }
      );

      console.log("API SUCCESS:");
      console.log(res.data);

    } catch (error) {
      console.log("API ERROR:");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
