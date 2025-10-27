import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as CardsLib from '@/lib/cards';
import { useAuth } from '../../contexts/AuthContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';

// Purchase categories supported by the UI. The app expects card metadata to include
// a `rewards` object mapping category keys to numeric reward rates (higher is better).
const CATEGORIES = [
  { key: 'groceries', label: 'Groceries' },
  { key: 'dining', label: 'Dining' },
  { key: 'travel', label: 'Travel' },
  { key: 'gas', label: 'Gas' },
  { key: 'streaming', label: 'Streaming' },
  { key: 'other', label: 'Other' },
];

export default function PurchaseScreen() {
  const colorScheme = useColorScheme();
  const { user, loading: authLoading } = useAuth();
  const [userCards, setUserCards] = useState<CardsLib.UserCardRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('groceries');
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!authLoading) fetchUserCards();
  }, [authLoading]);

  useFocusEffect(
    useCallback(() => {
      if (!authLoading && user) fetchUserCards();
    }, [authLoading, user])
  );

  async function fetchUserCards() {
    setLoading(true);
    try {
      const res = await CardsLib.listUserCards();
      setUserCards(res.data ?? []);
    } catch (e) {
      console.warn('Failed to load user cards', e);
    } finally {
      setLoading(false);
    }
  }

  // Compute a sorted list of user's cards by reward rate for the selected category.
  const sortedByRewards = useMemo(() => {
    // extract reward value from card metadata: card.metadata?.rewards?.[category]
    return [...userCards]
      .map((uc) => ({
        ...uc,
        reward: ((uc.card as any)?.metadata?.rewards?.[selectedCategory] as number) ?? 0,
      }))
      .sort((a, b) => (b.reward ?? 0) - (a.reward ?? 0));
  }, [userCards, selectedCategory]);

  if (authLoading || loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Purchases</ThemedText>
        <ThemedText>Please sign in to view your cards and rewards.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Choose category</ThemedText>

      <View style={styles.categoriesRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.key}
            onPress={() => setSelectedCategory(c.key)}
            style={[styles.categoryBtn, selectedCategory === c.key && styles.categorySelected]}
          >
            <ThemedText style={selectedCategory === c.key ? { color: '#fff' } : undefined}>{c.label}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 12 }} />

      <ThemedText type="subtitle">Your cards (best → worst rewards)</ThemedText>

      <TouchableOpacity onPress={() => setExpanded((s) => !s)} style={styles.dropdownHeader}>
        <ThemedText>{selectedCategory.toUpperCase()}</ThemedText>
        <IconSymbol name={expanded ? 'chevron.up' : 'chevron.down'} size={18} color={Colors[colorScheme ?? 'light'].tint} />
      </TouchableOpacity>

      {expanded && (
        <FlatList
          data={sortedByRewards}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => <ThemedText>No cards available for this category.</ThemedText>}
          renderItem={({ item }) => (
            <View style={styles.cardRow}>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">{item.card?.name ?? 'Unknown'}</ThemedText>
                <ThemedText>{(item.card as any)?.brand ?? ''}</ThemedText>
              </View>
              <ThemedText>{(item as any).reward ?? 0}%</ThemedText>
            </View>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  categoriesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  categoryBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginRight: 8, marginBottom: 8 },
  categorySelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  cardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
});
