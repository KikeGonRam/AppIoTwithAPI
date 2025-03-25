import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Animated, Keyboard, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function RegisterUser() {
  const [name, setName] = useState('');
  const [app, setApp] = useState('');
  const [apm, setApm] = useState('');
  const [fn, setFn] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const errorFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (error) {
      Animated.timing(errorFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(errorFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [error]);

  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleRegister = async () => {
    Keyboard.dismiss();

    if (!name || !app || !apm || !fn || !telefono || !email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos');
      shakeForm();
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      shakeForm();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://192.168.1.89:5000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          app,
          apm,
          fn,
          telefono,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setName('');
        setApp('');
        setApm('');
        setFn('');
        setTelefono('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        Alert.alert('Éxito', 'Usuario creado exitosamente', [
          {
            text: 'OK',
            onPress: () => router.push('/dashboardUser'),
          },
        ]);
      } else {
        setError(data.error || 'Error al registrarse');
        shakeForm();
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      shakeForm();
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View
        style={[
          styles.formContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { translateX: shakeAnim }],
          },
        ]}
      >
        <ThemedText type="title" style={styles.title}>
          Registro de Usuario
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError('');
          }}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Apellido Paterno"
          value={app}
          onChangeText={(text) => {
            setApp(text);
            setError('');
          }}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Apellido Materno"
          value={apm}
          onChangeText={(text) => {
            setApm(text);
            setError('');
          }}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
          value={fn}
          onChangeText={(text) => {
            setFn(text);
            setError('');
          }}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={telefono}
          onChangeText={(text) => {
            setTelefono(text);
            setError('');
          }}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setError('');
          }}
          secureTextEntry
          placeholderTextColor="#999"
        />

        {error ? (
          <Animated.View style={{ opacity: errorFadeAnim }}>
            <ThemedText style={styles.error}>{error}</ThemedText>
          </Animated.View>
        ) : null}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    color: '#1D3D47',
    marginBottom: 30,
    fontSize: 24,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#A1CEDC',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
});