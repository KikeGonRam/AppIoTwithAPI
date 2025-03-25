import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function user() {
    const router = useRouter();

    // Animaciones
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;


      useEffect(() => {
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
        ]).start();
      }, []);


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
                        { scale: scaleAnim }, // Aplicamos la animación de escala
                      ],
                    }}
                  ></Animated.View>

            <ThemedText type="title" style={styles.title}>
                ¡Bienvenido!
            </ThemedText>

            <ThemedText style={styles.subtitle}>
                Explora nuestra app y disfruta de una experiencia increíble
            </ThemedText>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => router.push('/loginUser')}
                      activeOpacity={0.7}
                    >
                      <ThemedText style={styles.buttonText}>Login</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => router.push('/RegisterUser')}
                      activeOpacity={0.7}
                    >
                      <ThemedText style={styles.buttonText}>Register</ThemedText>
                    </TouchableOpacity>
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
  title: {
    color: '#1D3D47',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#A1CEDC',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});