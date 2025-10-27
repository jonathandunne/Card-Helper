import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';

export type Card = {
  id: string;
  name: string;
  brand: string;
  metadata?: any;
};

export type UserCardRow = {
  id: string;
  card_id?: string;
  card?: Card;
  created_at?: string;
};

// Static list of available cards
const STATIC_CARDS: Card[] = [
  {
    id: 'discover-student-cash-back',
    name: 'Discover it® Student Cash Back',
    brand: 'Discover',
    metadata: {
      rewards: { groceries: 1, dining: 1, travel: 1, gas: 1, streaming: 1, other: 1 }
    }
  },
  {
    id: 'capital-one-savor-student',
    name: 'Capital One Savor Student Cash Rewards',
    brand: 'Capital One',
    metadata: {
      rewards: { groceries: 3, dining: 3, travel: 1, gas: 1, streaming: 3, other: 1 }
    }
  },
  {
    id: 'capital-one-quicksilver-student',
    name: 'Capital One Quicksilver Student Cash Rewards',
    brand: 'Capital One',
    metadata: {
      rewards: { groceries: 1.5, dining: 1.5, travel: 1.5, gas: 1.5, streaming: 1.5, other: 1.5 }
    }
  },
  {
    id: 'boa-customized-student',
    name: 'Bank of America® Customized Cash Rewards for Students',
    brand: 'Bank of America',
    metadata: {
      rewards: { groceries: 3, dining: 3, travel: 3, gas: 3, streaming: 3, other: 1 }
    }
  },
  {
    id: 'boa-travel-student',
    name: 'Bank of America® Travel Rewards for Students',
    brand: 'Bank of America',
    metadata: {
      rewards: { groceries: 1.5, dining: 1.5, travel: 1.5, gas: 1.5, streaming: 1.5, other: 1.5 }
    }
  }
];

const getStorageKey = (userId: string) => `user_cards_${userId}`;

export async function listCards(): Promise<{ data: Card[] | null; error: any }> {
  // Return static cards
  return { data: STATIC_CARDS, error: null };
}

export async function listUserCards(): Promise<{ data: UserCardRow[] | null; error: any }> {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return { data: null, error: { message: 'Not authenticated' } };

    const stored = await AsyncStorage.getItem(getStorageKey(user.id));
    const cardIds: string[] = stored ? JSON.parse(stored) : [];

    const data: UserCardRow[] = cardIds.map(cardId => ({
      id: cardId, // Use cardId as id for simplicity
      card_id: cardId,
      card: STATIC_CARDS.find(c => c.id === cardId),
      created_at: new Date().toISOString() // Fake created_at
    }));

    return { data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function addUserCard(cardId: string): Promise<{ data: any; error: any }> {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return { data: null, error: { message: 'Not authenticated' } };

    const stored = await AsyncStorage.getItem(getStorageKey(user.id));
    const cardIds: string[] = stored ? JSON.parse(stored) : [];

    if (!cardIds.includes(cardId)) {
      cardIds.push(cardId);
      await AsyncStorage.setItem(getStorageKey(user.id), JSON.stringify(cardIds));
    }

    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function removeUserCard(userCardId: string): Promise<{ data: any; error: any }> {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return { data: null, error: { message: 'Not authenticated' } };

    const stored = await AsyncStorage.getItem(getStorageKey(user.id));
    const cardIds: string[] = stored ? JSON.parse(stored) : [];

    const updated = cardIds.filter(id => id !== userCardId);
    await AsyncStorage.setItem(getStorageKey(user.id), JSON.stringify(updated));

    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}
