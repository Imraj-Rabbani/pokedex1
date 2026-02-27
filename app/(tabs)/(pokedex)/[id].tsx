import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { usePokemonDetail } from "@/lib/pokeapi";
import { getTypeColor, STAT_LABELS, STAT_MAX } from "@/constants/pokemon";
import { colors, getStatColor } from "@/lib/theme";
import type { PokemonStat } from "@/types/pokemon";

function StatBar({ stat, tint }: { stat: PokemonStat; tint: string }) {
  const label = STAT_LABELS[stat.name] ?? stat.name;
  const ratio = Math.min(stat.value / STAT_MAX, 1);

  return (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color: tint }]}>{label}</Text>
      <Text style={styles.statValue}>{stat.value}</Text>
      <View style={styles.statBarBg}>
        <View
          style={[
            styles.statBarFill,
            { flex: ratio, backgroundColor: getStatColor(stat.value) },
          ]}
        />
        <View style={{ flex: 1 - ratio }} />
      </View>
    </View>
  );
}

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { pokemon, loading, error } = usePokemonDetail(id!);

  useEffect(() => {
    if (pokemon) {
      navigation.setOptions({
        title: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      });
    }
  }, [pokemon, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? "Not found"}</Text>
      </View>
    );
  }

  const primaryColor = getTypeColor(pokemon.types[0]);
  const total = pokemon.stats.reduce((sum, s) => sum + s.value, 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <Text style={styles.headerNumber}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
        {pokemon.artwork && (
          <Image
            source={{ uri: pokemon.artwork }}
            style={styles.artwork}
            contentFit="contain"
            transition={300}
          />
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.typesRow}>
          {pokemon.types.map((type) => (
            <View
              key={type}
              style={[styles.typeBadge, { backgroundColor: getTypeColor(type) }]}
            >
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {(pokemon.weight / 10).toFixed(1)} kg
            </Text>
            <Text style={styles.metricLabel}>Weight</Text>
          </View>
          <View style={[styles.metric, styles.metricBorder]}>
            <Text style={styles.metricValue}>
              {(pokemon.height / 10).toFixed(1)} m
            </Text>
            <Text style={styles.metricLabel}>Height</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>
              {pokemon.abilities.map((a) => a.replace(/-/g, " ")).join(", ")}
            </Text>
            <Text style={styles.metricLabel}>Abilities</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: primaryColor }]}>
          Base Stats
        </Text>
        <View style={styles.statsContainer}>
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.name} stat={stat} tint={primaryColor} />
          ))}
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, styles.bold, { color: primaryColor }]}>
              TOT
            </Text>
            <Text style={[styles.statValue, styles.bold]}>{total}</Text>
            <View style={styles.statBarBg} />
          </View>
        </View>

        <Pressable
          style={[styles.moreButton, { backgroundColor: primaryColor }]}
          onPress={() =>
            router.push({
              pathname: "/pokemon-stats",
              params: { id: String(pokemon.id), type: pokemon.types[0] },
            })
          }
        >
          <Text style={styles.moreButtonText}>More Info</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
  header: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerNumber: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.inverseSubtle,
  },
  artwork: {
    width: 200,
    height: 200,
    marginTop: 4,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  typesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  metricsRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  metric: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  metricBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
    textAlign: "center",
    color: colors.text.primary,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  statsContainer: {
    gap: 10,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    width: 36,
    fontSize: 13,
    fontWeight: "600",
  },
  statValue: {
    width: 36,
    fontSize: 13,
    textAlign: "right",
    marginRight: 10,
    color: colors.text.primary,
  },
  statBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.statBar.background,
    flexDirection: "row",
    overflow: "hidden",
  },
  statBarFill: {
    height: 6,
    borderRadius: 3,
  },
  bold: {
    fontWeight: "700",
  },
  moreButton: {
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  moreButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "700",
  },
});
