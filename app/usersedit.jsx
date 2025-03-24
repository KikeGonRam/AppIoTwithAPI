import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, View, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function UsersEditScreen() {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    nombre: '',
    app: '',
    apm: '',
    fn: '',
    telefono: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://192.168.1.89:5000/admin/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        const user = data.find(u => u.id_usuario === parseInt(id));
        if (user) {
          setForm({
            nombre: user.nombre,
            app: user.app,
            apm: user.apm,
            fn: user.fn,
            telefono: user.telefono,
            email: user.email,
            password: '',
          });
        } else {
          setError('Usuario no encontrado');
        }
      } else {
        setError(data.error || 'Error al obtener usuario');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error en fetchUser:', err);
    }
  };

  const updateUser = async () => {
    try {
      const response = await fetch(`http://192.168.1.89:5000/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', 'Usuario actualizado exitosamente', [
          {
            text: 'OK',
            onPress: () => router.push('/users'),
          },
        ]);
      } else {
        setError(data.error || 'Error al actualizar usuario');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error en updateUser:', err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Editar Usuario
      </ThemedText>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={form.nombre}
          onChangeText={(text) => setForm({ ...form, nombre: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido Paterno"
          value={form.app}
          onChangeText={(text) => setForm({ ...form, app: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido Materno"
          value={form.apm}
          onChangeText={(text) => setForm({ ...form, apm: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
          value={form.fn}
          onChangeText={(text) => setForm({ ...form, fn: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={form.telefono}
          onChangeText={(text) => setForm({ ...form, telefono: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Nueva Contraseña (opcional)"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry
        />
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
        <TouchableOpacity style={styles.button} onPress={updateUser}>
          <ThemedText style={styles.buttonText}>Actualizar Usuario</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    color: '#1D3D47',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#A1CEDC',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});