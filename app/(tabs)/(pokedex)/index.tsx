import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { usePokemonList, SPRITE_URL } from "@/lib/pokeapi";
import type { PokemonListItem } from "@/types/pokemon";

export default function PokedexScreen() {
  const router = useRouter();
  const { pokemon, loading, loadMore } = usePokemonList();

  const renderItem = ({ item }: { item: PokemonListItem }) => (
    <Pressable
      style={styles.row}
      onPress={() => router.push(`/(pokedex)/${item.id}`)}
    >
      <Image
        source={{ uri: `${SPRITE_URL}/${item.id}.png` }}
        style={styles.sprite}
        contentFit="contain"
        transition={200}
      />
      <View style={styles.info}>
        <Text style={styles.id}>#{String(item.id).padStart(3, "0")}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={pokemon}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? (
          <ActivityIndicator style={styles.loader} size="small" />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sprite: {
    width: 56,
    height: 56,
  },
  info: {
    marginLeft: 12,
    gap: 2,
  },
  id: {
    fontSize: 13,
    color: "#888",
  },
  name: {
    fontSize: 17,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  loader: {
    paddingVertical: 20,
  },
});
