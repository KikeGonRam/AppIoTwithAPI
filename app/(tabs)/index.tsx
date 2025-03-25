import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const button1Anim = useRef(new Animated.Value(0)).current;
  const button2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada principal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animaciones escalonadas para los botones
      Animated.stagger(150, [
        Animated.spring(button1Anim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(button2Anim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  // Interpolación para la animación de los botones
  const button1Y = button1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const button2Y = button2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
            { scale: scaleAnim },
          ],
          width: '100%',
          }}
        >
        {/* Logo/Icono animado */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [{
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              }],
            }
          ]}
        >
          <MaterialCommunityIcons 
            name="shield-account" 
            size={80} 
            color="#3B82F6" 
          />
        </Animated.View>

        <ThemedText type="title" style={styles.title}>
          ¡Bienvenido!
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Explora nuestra app y disfruta de una experiencia increíble
        </ThemedText>

        {/* Botón Administrador con animación escalonada */}
        <Animated.View style={{ transform: [{ translateY: button1Y }] }}>
          <TouchableOpacity
            style={[styles.button, styles.adminButton]}
            onPress={() => router.push('/login')}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="lock-closed" size={20} color="white" />
              <ThemedText style={styles.buttonText}>Administrador</ThemedText>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Botón Usuarios con animación escalonada */}
        <Animated.View style={{ transform: [{ translateY: button2Y }] }}>
          <TouchableOpacity
            style={[styles.button, styles.userButton]}
            onPress={() => router.push('/user')}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="people" size={20} color="white" />
              <ThemedText style={styles.buttonText}>Usuarios</ThemedText>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <ThemedText style={styles.footerText}>
          Inicia sesión o regístrate para más opciones
        </ThemedText>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#1e293b',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 40,
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  adminButton: {
    backgroundColor: '#3B82F6',
  },
  userButton: {
    backgroundColor: '#10B981',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});