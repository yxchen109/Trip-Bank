import {StyleSheet,  Text, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Page() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // console.log(router)
  return (
    <SafeAreaView style={styles.container}>
        <Text>主題：{params.book_id}</Text>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
});