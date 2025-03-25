import { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Animated, Keyboard, View, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const router = useRouter();

  // Referencias para animaciones de foco
  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;

  // Animaciones principales
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const formScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Animación de entrada mejorada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(formScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const handleFocus = (animRef) => {
    Animated.timing(animRef, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (animRef) => {
    Animated.timing(animRef, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      shakeForm();
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://192.168.1.89:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Token:', data.token);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Credenciales incorrectas');
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
            transform: [
              { translateY: slideAnim },
              { translateX: shakeAnim },
              { scale: formScale }
            ] 
          }
        ]}
      >
        {/* Logo/Icono */}
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons 
            name="shield-lock" 
            size={80} 
            color="#3B82F6" 
            style={styles.logo}
          />
        </View>

        <ThemedText type="title" style={styles.title}>
          Acceso Administrador
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Ingresa tus credenciales para continuar
        </ThemedText>

        {/* Campo Email */}
        <Animated.View style={[
          styles.inputContainer,
          { borderColor: emailAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#e2e8f0', '#3B82F6']
            }),
            shadowOpacity: emailAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.2]
            })
          }
        ]}>
          <Ionicons 
            name="mail-outline" 
            size={20} 
            color="#64748b" 
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            onFocus={() => handleFocus(emailAnim)}
            onBlur={() => handleBlur(emailAnim)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Animated.View>

        {/* Campo Contraseña */}
        <Animated.View style={[
          styles.inputContainer,
          { borderColor: passwordAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#e2e8f0', '#3B82F6']
            }),
            shadowOpacity: passwordAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.2]
            })
          }
        ]}>
          <Ionicons 
            name="lock-closed-outline" 
            size={20} 
            color="#64748b" 
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            onFocus={() => handleFocus(passwordAnim)}
            onBlur={() => handleBlur(passwordAnim)}
            secureTextEntry={secureEntry}
            autoCapitalize="none"
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setSecureEntry(!secureEntry)}
          >
            <Ionicons 
              name={secureEntry ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
        </Animated.View>

        {error ? (
          <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
            <Ionicons name="warning-outline" size={16} color="#ef4444" />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </Animated.View>
        ) : null}

        <TouchableOpacity 
          style={[
            styles.button, 
            isLoading && styles.buttonDisabled
          ]} 
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <Ionicons name="log-in-outline" size={20} color="white" />
              <ThemedText style={styles.buttonText}>
                Iniciar Sesión
              </ThemedText>
            </View>
          )}
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
    backgroundColor: '#f8fafc',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  title: {
    color: '#1e293b',
    marginBottom: 8,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748b',
    marginBottom: 32,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    color: '#ef4444',
    marginLeft: 8,
    fontSize: 14,
  },
  forgotPassword: {
    marginTop: 24,
    padding: 8,
  },
  forgotPasswordText: {
    color: '#64748b',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});