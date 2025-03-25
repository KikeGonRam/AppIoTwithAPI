import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

export default function DashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState({
    users: 87,
    semaphores: 42,
    activeAlerts: 3
  });

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const statAnim1 = useRef(new Animated.Value(0)).current;
  const statAnim2 = useRef(new Animated.Value(0)).current;
  const statAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada escalonada
    Animated.sequence([
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
      ]),
      Animated.stagger(150, [
        Animated.spring(statAnim1, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(statAnim2, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(statAnim3, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ])
    ]).start();
  }, []);

  const handleLogout = () => {
    router.push('/');
  };

  const goToUsers = () => {
    router.push('/users');
  };

  const goToConfig = () => {
    router.push('/config');
  };

  const goToSemaphores = () => {
    router.push('/semaphores');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText type="title" style={styles.title}>
                Panel de Control
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Bienvenido, administrador
              </ThemedText>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
            >
              <Ionicons name="person-circle-outline" size={28} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {/* Estadísticas principales */}
          <View style={styles.statsContainer}>
            <Animated.View 
              style={[
                styles.statBox,
                { 
                  transform: [{
                    scale: statAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1]
                    })
                  }] 
                }
              ]}
            >
              <View style={styles.statIconContainer}>
                <FontAwesome name="users" size={20} color="#3B82F6" />
              </View>
              <ThemedText style={styles.statNumber}>{stats.users}</ThemedText>
              <ThemedText style={styles.statLabel}>Usuarios</ThemedText>
            </Animated.View>

            <Animated.View 
              style={[
                styles.statBox,
                { 
                  transform: [{
                    scale: statAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1]
                    })
                  }] 
                }
              ]}
            >
              <View style={styles.statIconContainer}>
                <MaterialCommunityIcons name="traffic-light" size={20} color="#10B981" />
              </View>
              <ThemedText style={styles.statNumber}>{stats.semaphores}</ThemedText>
              <ThemedText style={styles.statLabel}>Semáforos</ThemedText>
            </Animated.View>

            <Animated.View 
              style={[
                styles.statBox, 
                stats.activeAlerts > 0 ? styles.alertBox : null,
                { 
                  transform: [{
                    scale: statAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1]
                    })
                  }] 
                }
              ]}
            >
              <View style={styles.statIconContainer}>
                <Ionicons 
                  name="notifications" 
                  size={20} 
                  color={stats.activeAlerts > 0 ? "#EF4444" : "#64748B"} 
                />
              </View>
              <ThemedText style={[
                styles.statNumber,
                stats.activeAlerts > 0 ? styles.alertText : null
              ]}>
                {stats.activeAlerts}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Alertas</ThemedText>
              {stats.activeAlerts > 0 && (
                <View style={styles.alertBadge} />
              )}
            </Animated.View>
          </View>

          {/* Tarjetas de Acción */}
          <View style={styles.cardsContainer}>
            {/* Usuarios */}
            <TouchableOpacity 
              style={styles.card}
              onPress={goToUsers}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: '#DBEAFE' }]}>
                  <FontAwesome name="users" size={20} color="#3B82F6" />
                </View>
                <ThemedText type="subtitle" style={styles.cardTitle}>Gestión de Usuarios</ThemedText>
              </View>
              <ThemedText style={styles.cardDesc}>
                Administra los usuarios registrados en el sistema
              </ThemedText>
              <View style={styles.cardArrow}>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            {/* Semáforos */}
            <TouchableOpacity 
              style={styles.card}
              onPress={goToSemaphores}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: '#D1FAE5' }]}>
                  <MaterialCommunityIcons name="traffic-light" size={20} color="#10B981" />
                </View>
                <ThemedText type="subtitle" style={styles.cardTitle}>Control de Semáforos</ThemedText>
              </View>
              <ThemedText style={styles.cardDesc}>
                Monitorea y configura semáforos inteligentes
              </ThemedText>
              <View style={styles.cardArrow}>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            {/* Configuración */}
            <TouchableOpacity 
              style={styles.card}
              onPress={goToConfig}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: '#E0E7FF' }]}>
                  <Ionicons name="settings" size={20} color="#6366F1" />
                </View>
                <ThemedText type="subtitle" style={styles.cardTitle}>Configuración</ThemedText>
              </View>
              <ThemedText style={styles.cardDesc}>
                Ajusta las preferencias del sistema
              </ThemedText>
              <View style={styles.cardArrow}>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Botón de Cerrar Sesión */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
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
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#1E293B',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
  },
  profileButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  statIconContainer: {
    backgroundColor: '#F1F5F9',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  alertText: {
    color: '#EF4444',
  },
  alertBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  cardsContainer: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: '600',
  },
  cardDesc: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  cardArrow: {
    alignSelf: 'flex-end',
  },
  logoutButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});