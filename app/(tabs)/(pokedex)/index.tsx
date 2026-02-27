import { Text, View, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function PokedexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pokedex</Text>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/(pokedex)/25")}
      >
        <Text style={styles.buttonText}>View Pikachu (#25)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  text: {
    fontSize: 18,
  },
  button: {
    backgroundColor: "#e63946",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
