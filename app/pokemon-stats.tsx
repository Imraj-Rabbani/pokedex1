import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { usePokemonSpecies } from "@/lib/pokeapi";
import { getTypeColor } from "@/constants/pokemon";
import { colors } from "@/lib/theme";

function InfoCard({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <View style={styles.infoCard}>
      <Text style={[styles.infoLabel, { color: tint }]}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function GenderBar({ ratio }: { ratio: number }) {
  if (ratio === -1) {
    return (
      <View style={styles.genderContainer}>
        <Text style={styles.genderLabel}>Gender</Text>
        <Text style={styles.genderless}>Genderless</Text>
      </View>
    );
  }

  const female = (ratio / 8) * 100;
  const male = 100 - female;

  return (
    <View style={styles.genderContainer}>
      <Text style={styles.genderLabel}>Gender Ratio</Text>
      <View style={styles.genderBarBg}>
        <View style={[styles.genderMale, { flex: male }]} />
        <View style={[styles.genderFemale, { flex: female }]} />
      </View>
      <View style={styles.genderLegend}>
        <Text style={[styles.genderText, { color: "#6890F0" }]}>
          ♂ {male.toFixed(1)}%
        </Text>
        <Text style={[styles.genderText, { color: "#F85888" }]}>
          ♀ {female.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
}

export default function PokemonStatsModal() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const { species, loading, error } = usePokemonSpecies(id!);

  const tint = getTypeColor(type ?? "normal");

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !species) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? "Not found"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        <Text style={[styles.genus, { color: tint }]}>{species.genus}</Text>
        <Text style={styles.flavor}>{species.flavorText}</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: tint }]}>Profile</Text>
      <View style={styles.grid}>
        <InfoCard label="Generation" value={species.generation} tint={tint} />
        <InfoCard
          label="Habitat"
          value={species.habitat ?? "Unknown"}
          tint={tint}
        />
        <InfoCard
          label="Capture Rate"
          value={String(species.captureRate)}
          tint={tint}
        />
        <InfoCard
          label="Base Happiness"
          value={String(species.baseHappiness)}
          tint={tint}
        />
        <InfoCard label="Growth Rate" value={species.growthRate} tint={tint} />
        <InfoCard
          label="Egg Groups"
          value={species.eggGroups.join(", ") || "None"}
          tint={tint}
        />
      </View>

      <GenderBar ratio={species.genderRatio} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
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
  headerSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  genus: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  flavor: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 28,
  },
  infoCard: {
    width: "47%",
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.primary,
    textTransform: "capitalize",
  },
  genderContainer: {
    gap: 10,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  genderBarBg: {
    height: 10,
    borderRadius: 5,
    flexDirection: "row",
    overflow: "hidden",
  },
  genderMale: {
    backgroundColor: "#6890F0",
  },
  genderFemale: {
    backgroundColor: "#F85888",
  },
  genderless: {
    fontSize: 15,
    color: colors.text.tertiary,
    fontStyle: "italic",
  },
  genderLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
