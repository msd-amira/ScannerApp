import { StyleSheet, Text, View } from 'react-native';
import ScanBarCode from "./src/views/ScanBarCode";

export default function App() {

  // Return the View
  return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.sectionTitle}>
            Scanner App
          </Text>
          <ScanBarCode/>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  wrapper: {
    paddingTop: '15%',
    paddingHorizontal: '5%'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});
