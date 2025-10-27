import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoWrap}>
          <IconSymbol name="creditcard" size={36} color="#fff" />
        </View>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <ThemedText type="title">Card Helper</ThemedText>
          <ThemedText>
            Manage your cards, see which gives the best rewards per category, and quickly add or remove cards linked to your account.
          </ThemedText>
        </View>
      </View>

      <View style={{ height: 12 }} />

      <ThemedText type="subtitle">Quick actions</ThemedText>
      <ThemedText>Use the Tabs below to go to Purchases or Card management.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  hero: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  logoWrap: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#00AEEF', alignItems: 'center', justifyContent: 'center' },
});
