import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as CardsLib from '../../lib/cards';

export default function CardsScreen() {
  const [cards, setCards] = useState<CardsLib.Card[]>([]);
  const [userCards, setUserCards] = useState<CardsLib.UserCardRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(new Set());
  

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [{ data: allCards }, { data: userCardRows }] = await Promise.all([
        CardsLib.listCards(),
        CardsLib.listUserCards(),
      ]);
      setCards(allCards ?? []);
      setUserCards(userCardRows ?? []);
    } catch (e) {
      console.warn('Failed to load cards', e);
      Alert.alert('Error', 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  }

  async function onAdd() {
    if (selectedCardIds.size === 0) return;
    setLoading(true);
    try {
      // Add all selected cards
      for (const cardId of selectedCardIds) {
        const { error } = await CardsLib.addUserCard(cardId);
        if (error) {
          Alert.alert('Error', `Failed to add card: ${error.message}`);
          break;
        }
      }
      setModalVisible(false);
      setSelectedCardIds(new Set());
      await fetchAll();
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Failed to add cards');
    } finally {
      setLoading(false);
    }
  }

  async function onBulkDelete() {
    if (selectedForDelete.size === 0) return;
    Alert.alert(
      'Delete cards',
      `Delete ${selectedForDelete.size} card${selectedForDelete.size > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              for (const cardId of selectedForDelete) {
                const { error } = await CardsLib.removeUserCard(cardId);
                if (error) {
                  Alert.alert('Error', `Failed to delete card: ${error.message}`);
                  break;
                }
              }
              setSelectedForDelete(new Set());
              await fetchAll();
            } catch (e) {
              console.warn(e);
              Alert.alert('Error', 'Failed to delete cards');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }

  function toggleDeleteSelection(userCardId: string) {
    setSelectedForDelete(prev => {
      const next = new Set(prev);
      if (next.has(userCardId)) {
        next.delete(userCardId);
      } else {
        next.add(userCardId);
      }
      return next;
    });
  }

  const selectedIds = new Set(userCards.map((uc) => uc.card?.id ?? uc.card_id));
  const availableCards = cards.filter((c) => !selectedIds.has(c.id));

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return availableCards;
    const query = searchQuery.toLowerCase();
    return availableCards.filter(card => 
      card.name.toLowerCase().includes(query) || 
      card.brand.toLowerCase().includes(query)
    );
  }, [availableCards, searchQuery]);

  function toggleCardSelection(cardId: string) {
    setSelectedCardIds(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  }

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Your Cards</ThemedText>

      {selectedForDelete.size > 0 && (
        <View style={styles.selectedBanner}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>
            {selectedForDelete.size} selected
          </ThemedText>
        </View>
      )}

      <FlatList
        data={userCards}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <ThemedText>No cards added yet.</ThemedText>}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleDeleteSelection(item.id)}
            style={[styles.cardBox, selectedForDelete.has(item.id) && styles.cardBoxSelected]}
          >
            <View style={styles.checkbox}>
              <ThemedText style={{ fontSize: 24 }}>
                {selectedForDelete.has(item.id) ? '☑️' : '☐'}
              </ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">{item.card?.name ?? 'Unknown'}</ThemedText>
              <ThemedText>{item.card?.brand ?? ''}</ThemedText>
            </View>
          </TouchableOpacity>
        )}
      />

      {selectedForDelete.size > 0 && (
        <View style={{ marginBottom: 12 }}>
          <TouchableOpacity
            onPress={onBulkDelete}
            style={styles.bulkDeleteBtn}
          >
            <ThemedText style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              Delete ({selectedForDelete.size})
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 12 }} />
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        disabled={availableCards.length === 0}
        style={[styles.addBtn, availableCards.length === 0 && styles.disabled]}
      >
        <ThemedText style={{ color: '#fff' }}>{availableCards.length === 0 ? 'No cards available' : 'Add card'}</ThemedText>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title">Add cards</ThemedText>
          
          <TextInput
            placeholder="Search cards..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="#999"
          />

          <ThemedText style={{ marginBottom: 8 }}>
            {selectedCardIds.size > 0 ? `${selectedCardIds.size} card${selectedCardIds.size > 1 ? 's' : ''} selected` : 'Tap to select cards'}
          </ThemedText>

          <FlatList
            data={filteredCards}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleCardSelection(item.id)}
                style={[styles.option, selectedCardIds.has(item.id) && styles.optionSelected]}
              >
                <View style={{ flex: 1 }}>
                  <ThemedText>{item.name}</ThemedText>
                  <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>{item.brand}</ThemedText>
                </View>
                {selectedCardIds.has(item.id) && <ThemedText style={{ color: '#007AFF' }}>✓</ThemedText>}
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => <ThemedText>No cards found.</ThemedText>}
          />

          <View style={{ height: 12 }} />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={() => { setModalVisible(false); setSelectedCardIds(new Set()); setSearchQuery(''); }} style={styles.cancelBtn}>
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAdd} disabled={selectedCardIds.size === 0} style={[styles.saveBtn, selectedCardIds.size === 0 && styles.disabled]}>
              <ThemedText style={{ color: '#fff' }}>Add {selectedCardIds.size > 0 ? `(${selectedCardIds.size})` : ''}</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  cardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  cardBoxSelected: {
    borderColor: '#FF3333',
    backgroundColor: '#FFE6E6',
  },
  checkbox: {
    marginRight: 12,
    width: 30,
    alignItems: 'center',
  },
  selectedBanner: {
    backgroundColor: '#FF3333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  bulkDeleteBtn: {
    backgroundColor: '#FF3333',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeBtn: { padding: 8 },
  addBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  modalContainer: { flex: 1, padding: 20 },
  searchInput: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 12, 
    borderRadius: 8, 
    marginVertical: 12,
    fontSize: 16,
  },
  option: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  optionSelected: { borderColor: '#007AFF', backgroundColor: '#E8F0FF' },
  saveBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', flex: 1 },
  cancelBtn: { padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ddd', flex: 1 },
  disabled: { opacity: 0.5 },
});
