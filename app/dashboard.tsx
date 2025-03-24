import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState({
    users: 87,
    semaphores: 42,
    activeAlerts: 3

    
  });

  // Animaciones
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Animación de entrada
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
      })
    ]).start();
  }, []);

  const handleLogout = () => {
    router.push('/');
  };

  const goToUsers = () => {
    router.push('/users');
  };

  const goToConfig = () => {
    // Implementar ruta a configuración
    console.log('Ir a configuración');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          <ThemedText type="title" style={styles.title}>
            Dashboard Admin
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Bienvenido, administrador. Aquí puedes gestionar la app.
          </ThemedText>

          {/* Estadísticas principales */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <ThemedText style={styles.statNumber}>{stats.users}</ThemedText>
              <ThemedText style={styles.statLabel}>Usuarios</ThemedText>
            </View>
            <View style={styles.statBox}>
              <ThemedText style={styles.statNumber}>{stats.semaphores}</ThemedText>
              <ThemedText style={styles.statLabel}>Semáforos</ThemedText>
            </View>
            <View style={[styles.statBox, stats.activeAlerts > 0 ? styles.alertBox : null]}>
              <ThemedText style={styles.statNumber}>{stats.activeAlerts}</ThemedText>
              <ThemedText style={styles.statLabel}>Alertas</ThemedText>
            </View>
          </View>

          {/* Sección de Usuarios */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Usuarios</ThemedText>
            <ThemedText style={styles.sectionDesc}>Gestiona los usuarios registrados</ThemedText>
            <TouchableOpacity 
              style={styles.sectionButton} 
              onPress={goToUsers}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Ir a Gestión de Usuarios</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Sección de Configuración */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Configuración</ThemedText>
            <ThemedText style={styles.sectionDesc}>Ajusta las opciones de la app</ThemedText>
            <TouchableOpacity 
              style={styles.sectionButton}
              onPress={goToConfig}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Ir a Configuración</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Sección de Semáforos */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Semáforos</ThemedText>
            <ThemedText style={styles.sectionDesc}>Monitorea y configura semáforos inteligentes</ThemedText>
            <TouchableOpacity 
              style={styles.sectionButton}
              onPress={() => console.log('Ir a semáforos')}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Ver Semáforos</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>Cerrar Sesión</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
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
    marginBottom: 10,
    fontSize: 28,
  },
  subtitle: {
    color: '#666',
    marginBottom: 25,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  alertBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fee2e2',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D3D47',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1D3D47',
    marginBottom: 8,
  },
  sectionDesc: {
    color: '#666',
    marginBottom: 12,
  },
  sectionButton: {
    backgroundColor: '#A1CEDC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  logoutButton: {
    backgroundColor: '#1D3D47',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});