import { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  View, 
  Alert, 
  Animated, 
  ActivityIndicator,
  ScrollView,
  Platform,
  Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

// Obtener dimensiones de la pantalla
const { width } = Dimensions.get('window');

const ITEMS_PER_PAGE = 6;

// Evitar errores en Web
if (Platform.OS === 'web') {
  console.warn('Este componente no está optimizado para la web.');
}

// Componente separado para el ítem de usuario
const UserItem = ({ 
  item, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete,
  index 
}) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const fullName = `${item.nombre} ${item.app} ${item.apm}`;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: 1,
      delay: index * 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.userItem,
        {
          opacity: animValue,
          transform: [
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.userHeader} 
        onPress={onSelect}
        activeOpacity={0.8}
      >
        <View style={styles.userAvatar}>
          <FontAwesome name="user" size={15} color="#3B82F6" />
        </View>
        <ThemedText style={styles.userName} numberOfLines={1}>
          {fullName}
        </ThemedText>
        <Ionicons 
          name={isSelected ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#64748B" 
        />
      </TouchableOpacity>

      {isSelected && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="mail-outline" size={16} color="#64748B" style={styles.detailIcon} />
            <ThemedText style={styles.detailText}>
              {item.email || 'No disponible'}
            </ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={16} color="#64748B" style={styles.detailIcon} />
            <ThemedText style={styles.detailText}>
              {item.telefono || 'No disponible'}
            </ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" style={styles.detailIcon} />
            <ThemedText style={styles.detailText}>
              {item.fn || 'No disponible'}
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={onEdit}
              activeOpacity={0.8}
            >
              <MaterialIcons name="edit" size={16} color="#FFFFFF" />
              <ThemedText style={styles.actionButtonText}>Editar</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={onDelete}
              activeOpacity={0.8}
            >
              <MaterialIcons name="delete" size={16} color="#FFFFFF" />
              <ThemedText style={styles.actionButtonText}>Eliminar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Animaciones para la pantalla
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('http://192.168.1.89:5000/admin/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.reverse());
        setError('');
        setCurrentPage(1);
      } else {
        setError(data.error || 'Error al obtener usuarios');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error en fetchUsers:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const deleteUser = (id, nombreCompleto) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de eliminar a ${nombreCompleto}? Esta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.1.89:5000/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
              });
              const data = await response.json();
              if (response.ok) {
                fetchUsers();
                setSelectedUserId(null);
                Alert.alert('Éxito', 'Usuario eliminado correctamente');
              } else {
                setError(data.error || 'Error al eliminar usuario');
              }
            } catch (err) {
              setError('Error de conexión');
              console.error('Error en deleteUser:', err);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleCreate = () => {
    router.push('/userscreate');
  };

  const handleEdit = (id) => {
    router.push({ pathname: '/usersedit', params: { id: id.toString() } });
  };

  const selectUser = (id) => {
    setSelectedUserId(selectedUserId === id ? null : id);
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Gestión de Usuarios
          </ThemedText>
          <ThemedText style={styles.userCount}>
            {users.length} {users.length === 1 ? 'usuario' : 'usuarios'} registrados
          </ThemedText>
        </View>

        <TouchableOpacity 
          style={styles.createButton} 
          onPress={handleCreate}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <ThemedText style={styles.buttonText}>Nuevo Usuario</ThemedText>
        </TouchableOpacity>

        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={20} color="#EF4444" />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <FlatList
            data={paginatedUsers}
            keyExtractor={(item) => item.id_usuario.toString()}
            renderItem={({ item, index }) => (
              <UserItem
                item={item}
                index={index}
                isSelected={selectedUserId === item.id_usuario}
                onSelect={() => selectUser(item.id_usuario)}
                onEdit={() => handleEdit(item.id_usuario)}
                onDelete={() => deleteUser(item.id_usuario, `${item.nombre} ${item.app} ${item.apm}`)}
              />
            )}
            refreshing={refreshing}
            onRefresh={fetchUsers}
          />
        )}

        <View style={styles.pagination}>
          <TouchableOpacity
            style={styles.pageButton}
            onPress={prevPage}
            disabled={currentPage === 1}
          >
            <Ionicons name="arrow-back" size={20} color={currentPage === 1 ? '#B8B8B8' : '#3B82F6'} />
          </TouchableOpacity>

          <ThemedText style={styles.pageNumber}>
            Página {currentPage} de {totalPages}
          </ThemedText>

          <TouchableOpacity
            style={styles.pageButton}
            onPress={nextPage}
            disabled={currentPage === totalPages}
          >
            <Ionicons name="arrow-forward" size={20} color={currentPage === totalPages ? '#B8B8B8' : '#3B82F6'} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userCount: {
    fontSize: 16,
    color: '#777',
    filter: 'brightness(0.8)',
  },
  createButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  userItem: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userAvatar: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 20,
  },
  userName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  details: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  pageButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    elevation: 2,
  },
  pageNumber: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 10,
  },
});
