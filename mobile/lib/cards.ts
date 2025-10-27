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

export async function listCards(): Promise<{ data: Card[] | null; error: any }> {
  const res = await supabase.from('cards').select('*').order('name', { ascending: true });
  return res as any;
}

export async function listUserCards(): Promise<{ data: UserCardRow[] | null; error: any }> {
  // select user_cards with embedded card
  const res = await supabase.from('user_cards').select('id, card:cards(id, name, brand, metadata, created_at)').order('created_at', { ascending: false });
  return res as any;
}

export async function addUserCard(cardId: string): Promise<{ data: any; error: any }> {
  // include user_id so RLS checks can validate equality with auth.uid()
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return { data: null, error: { message: 'Not authenticated' } };
  const payload = { user_id: user.id, card_id: cardId };
  const res = await supabase.from('user_cards').insert([payload]);
  return res as any;
}

export async function removeUserCard(userCardId: string): Promise<{ data: any; error: any }> {
  const res = await supabase.from('user_cards').delete().match({ id: userCardId });
  return res as any;
}
