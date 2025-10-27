import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '../../contexts/AuthContext';
import * as CardsLib from '../../lib/cards';

export default function CardsScreen() {
  const { user, loading: authLoading } = useAuth();
  const [cards, setCards] = useState<CardsLib.Card[]>([]);
  const [userCards, setUserCards] = useState<CardsLib.UserCardRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  

  useEffect(() => {
    if (!authLoading) fetchAll();
  }, [authLoading]);

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
    if (!selectedCardId) return;
    setLoading(true);
    try {
      const { error } = await CardsLib.addUserCard(selectedCardId);
      if (error) {
        Alert.alert('Error', error.message || 'Failed to add card');
      } else {
        setModalVisible(false);
        setSelectedCardId(null);
        await fetchAll();
      }
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Failed to add card');
    } finally {
      setLoading(false);
    }
  }

  async function onRemove(userCardId: string) {
    Alert.alert('Remove card', 'Remove this card from your list?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            const { error } = await CardsLib.removeUserCard(userCardId);
            if (error) Alert.alert('Error', error.message || 'Failed to remove card');
            else await fetchAll();
          } catch (e) {
            console.warn(e);
            Alert.alert('Error', 'Failed to remove card');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  }

  const selectedIds = new Set(userCards.map((uc) => uc.card?.id ?? uc.card_id));
  const availableCards = cards.filter((c) => !selectedIds.has(c.id));

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
        <ThemedText type="title">Cards</ThemedText>
        <ThemedText>Please sign in to manage your cards.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Your Cards</ThemedText>

      <FlatList
        data={userCards}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <ThemedText>No cards added yet.</ThemedText>}
        renderItem={({ item }) => (
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">{item.card?.name ?? 'Unknown'}</ThemedText>
              <ThemedText>{item.card?.brand ?? ''}</ThemedText>
            </View>
            <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeBtn}>
              <ThemedText style={{ color: '#ff3333' }}>Remove</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      />

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
          <ThemedText type="title">Add a card</ThemedText>

          <FlatList
            data={availableCards}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCardId(item.id)}
                style={[styles.option, selectedCardId === item.id && styles.optionSelected]}
              >
                <ThemedText>{item.name} • {item.brand}</ThemedText>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => <ThemedText>No available cards to add.</ThemedText>}
          />

          <View style={{ height: 12 }} />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={() => { setModalVisible(false); setSelectedCardId(null); }} style={styles.cancelBtn}>
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAdd} disabled={!selectedCardId} style={[styles.saveBtn, !selectedCardId && styles.disabled]}>
              <ThemedText style={{ color: '#fff' }}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  removeBtn: { padding: 8 },
  addBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  modalContainer: { flex: 1, padding: 20 },
  option: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, marginBottom: 8 },
  optionSelected: { borderColor: '#007AFF', backgroundColor: '#E8F0FF' },
  saveBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', flex: 1 },
  cancelBtn: { padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ddd', flex: 1 },
  disabled: { opacity: 0.5 },
});
