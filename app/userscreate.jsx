import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, View, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function UsersCreateScreen() {
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

  const createUser = async () => {
    try {
      const response = await fetch('http://192.168.1.89:5000/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', 'Usuario creado exitosamente', [
          {
            text: 'OK',
            onPress: () => router.push('/users'),
          },
        ]);
      } else {
        setError(data.error || 'Error al crear usuario');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error(err);
    }
  };

  const renderInputWithIcon = (icon, iconType, placeholder, key, secureTextEntry = false, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <View style={styles.iconContainer}>
        {iconType === 'Ionicons' && <Ionicons name={icon} size={20} color="#1D3D47" />}
        {iconType === 'MaterialIcons' && <MaterialIcons name={icon} size={20} color="#1D3D47" />}
        {iconType === 'FontAwesome' && <FontAwesome name={icon} size={20} color="#1D3D47" />}
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={form[key]}
        onChangeText={(text) => setForm({ ...form, [key]: text })}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Crear Nuevo Usuario
      </ThemedText>

      <View style={styles.form}>
        {renderInputWithIcon(
          "person", 
          "Ionicons", 
          "Nombre", 
          "nombre"
        )}
        {renderInputWithIcon(
          "person-outline", 
          "Ionicons", 
          "Apellido Paterno", 
          "app"
        )}
        {renderInputWithIcon(
          "person-add", 
          "Ionicons", 
          "Apellido Materno", 
          "apm"
        )}
        {renderInputWithIcon(
          "calendar", 
          "MaterialIcons", 
          "Fecha de Nacimiento (YYYY-MM-DD)", 
          "fn"
        )}
        {renderInputWithIcon(
          "phone", 
          "FontAwesome", 
          "Teléfono", 
          "telefono",
          false,
          "phone-pad"
        )}
        {renderInputWithIcon(
          "email", 
          "MaterialIcons", 
          "Email", 
          "email",
          false,
          "email-address"
        )}
        {renderInputWithIcon(
          "lock", 
          "FontAwesome", 
          "Contraseña", 
          "password",
          true
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={16} color="red" />
            <ThemedText style={styles.error}> {error}</ThemedText>
          </View>
        ) : null}

        <TouchableOpacity 
          style={styles.button} 
          onPress={createUser}
        >
          <Ionicons name="person-add" color="#fff" size={20} style={styles.buttonIcon} />
          <ThemedText style={styles.buttonText}>Crear Usuario</ThemedText>
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
    marginBottom: 30,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#E6F0F4',
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#A1CEDC',
    padding: 15,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginLeft: 5,
  },
});