import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { signInWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onEmailLogin() {
    setLoading(true);
    setError(null);
    // Basic validation: require email and password
    if (!email || !email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!password) {
      setError('Password is required');
      setLoading(false);
      return;
    }
    try {
      const res = await signInWithEmail(email, password, remember);
      if (res.error) setError(res.error.message || 'Login failed');
      else router.replace('/');
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setRemember((r) => !r)}>
          <Text>{remember ? '☑' : '☐'} Remember password</Text>
        </TouchableOpacity>
      </View>
      <Button title={loading ? 'Signing in...' : 'Sign in'} onPress={onEmailLogin} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Create account" onPress={() => router.push('./signup')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 12, borderRadius: 6 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  error: { color: 'red', marginBottom: 8 },
});
