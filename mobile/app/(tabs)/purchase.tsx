import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as CardsLib from '@/lib/cards';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';

// Purchase categories supported by the UI. The app expects card metadata to include
// a `rewards` object mapping category keys to numeric reward rates (higher is better).
const CATEGORIES = [
  { key: 'groceries', label: 'Groceries' },
  { key: 'dining', label: 'Dining' },
  { key: 'gas', label: 'Gas' },
  { key: 'travel', label: 'Travel' },
  { key: 'transit', label: 'Transit' },
  { key: 'drugstores', label: 'Drugstores' },
  { key: 'onlineShopping', label: 'Online Shopping' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'streaming', label: 'Streaming' },
  { key: 'wholesale', label: 'Wholesale' },
  { key: 'wireless', label: 'Wireless' },
  { key: 'departmentStores', label: 'Department Stores' },
  { key: 'homeImprovement', label: 'Home Improvement' },
  { key: 'other', label: 'Other' },
];

export default function PurchaseScreen() {
  const colorScheme = useColorScheme();
  const [userCards, setUserCards] = useState<CardsLib.UserCardRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('groceries');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUserCards();
    }, [])
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

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Purchase Category</ThemedText>

      <TouchableOpacity 
        onPress={() => setDropdownOpen(!dropdownOpen)}
        style={[
          styles.dropdownButton,
          { borderColor: Colors[colorScheme ?? 'light'].tabIconDefault, backgroundColor: Colors[colorScheme ?? 'light'].background }
        ]}
      >
        <ThemedText style={{ fontSize: 16 }}>
          {CATEGORIES.find(c => c.key === selectedCategory)?.label || 'Select Category'}
        </ThemedText>
        <IconSymbol 
          name={dropdownOpen ? 'chevron.up' : 'chevron.down'} 
          size={18} 
          color={Colors[colorScheme ?? 'light'].tint} 
        />
      </TouchableOpacity>

      {dropdownOpen && (
        <View style={[
          styles.dropdownMenu,
          { borderColor: Colors[colorScheme ?? 'light'].tabIconDefault, backgroundColor: Colors[colorScheme ?? 'light'].background }
        ]}>
          <ScrollView scrollEnabled={true} nestedScrollEnabled={true}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.key}
                onPress={() => {
                  setSelectedCategory(category.key);
                  setDropdownOpen(false);
                }}
                style={[
                  styles.dropdownItem,
                  { borderBottomColor: Colors[colorScheme ?? 'light'].tabIconDefault },
                  selectedCategory === category.key && { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' }
                ]}
              >
                <ThemedText style={selectedCategory === category.key ? { fontWeight: 'bold', color: '#007AFF' } : undefined}>
                  {category.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={{ height: 12 }} />

      <ThemedText type="subtitle">Your cards (best → worst rewards)</ThemedText>

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
            <ThemedText style={{ fontWeight: 'bold', fontSize: 16 }}>{(item as any).reward ?? 0}%</ThemedText>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 12,
  },
  dropdownMenu: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    height: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  dropdownItemSelected: {
    backgroundColor: '#E8F0FF',
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
});
