import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const DashboardUser = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Lógica de cierre de sesión
    router.push('/loginUser'); // Redirigir a la pantalla de inicio de sesión
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.welcomeContainer}>
        <ThemedText type="title" style={styles.title}>
          ¡Bienvenido a tu panel, Usuario!
        </ThemedText>
        
        <ThemedText style={styles.message}>
          Estás en el panel de usuario donde puedes ver los estados de los semaforos en tiempo real.
        </ThemedText>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.buttonText}>Cerrar sesión</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  welcomeContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#1D3D47',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DashboardUser;
