import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ Allergy Scanner</Text>
      <Text style={styles.subtitle}>Scan products. Stay safe.</Text>
      <Link href="/(tabs)/login" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
    padding: 20,
  },
  title: {
    fontSize: 36,
    color: '#facc15',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#facc15',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: '#020617',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
