import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

// Simple passcode hashing using SHA-256
export async function hashPasscode(passcode: string) {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, passcode);
}

// Save an encrypted value in secure store
export async function saveSecureValue(key: string, value: string) {
  return SecureStore.setItemAsync(key, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
}

export async function getSecureValue(key: string) {
  return SecureStore.getItemAsync(key);
}

export async function deleteSecureValue(key: string) {
  return SecureStore.deleteItemAsync(key);
}
