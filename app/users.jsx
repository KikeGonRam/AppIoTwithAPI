import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, View, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://192.168.1.89:5000/admin/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Usuarios cargados:', data);
        setUsers(data);
      } else {
        setError(data.error || 'Error al obtener usuarios');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error en fetchUsers:', err);
    }
  };

  const deleteUser = (id, nombreCompleto) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de que deseas eliminar a ${nombreCompleto}? Esta acción no se puede deshacer.`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí',
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
                Alert.alert('Éxito', 'Usuario eliminado exitosamente', [{ text: 'OK' }]);
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
    console.log('Redirigiendo a editar usuario con ID:', id);
    router.push({ pathname: '/usersedit', params: { id: id.toString() } });
  };

  const selectUser = (id) => {
    console.log('ID seleccionado:', id);
    setSelectedUserId(selectedUserId === id ? null : id);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Lista de Usuarios
      </ThemedText>
      <ThemedText style={styles.userCount}>
        Usuarios registrados: {users.length}
      </ThemedText>

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <ThemedText style={styles.buttonText}>Crear Nuevo Usuario</ThemedText>
      </TouchableOpacity>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id_usuario.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.userItem}>
            <TouchableOpacity onPress={() => selectUser(item.id_usuario)}>
              <ThemedText style={styles.userName}>
                {item.nombre} {item.app} {item.apm}
              </ThemedText>
            </TouchableOpacity>

            {selectedUserId === item.id_usuario && (
              <ThemedView style={styles.details}>
                <ThemedText>Email: {item.email || 'No disponible'}</ThemedText>
                <ThemedText>Teléfono: {item.telefono || 'No disponible'}</ThemedText>
                <ThemedText>Fecha de Nacimiento: {item.fn || 'No disponible'}</ThemedText>
              </ThemedView>
            )}

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item.id_usuario)}>
                <ThemedText style={styles.actionText}>Editar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteUser(item.id_usuario, `${item.nombre} ${item.app} ${item.apm}`)}
              >
                <ThemedText style={styles.actionText}>Eliminar</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}
        ListEmptyComponent={<ThemedText>No hay usuarios</ThemedText>}
      />
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
  },
  userCount: {
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#A1CEDC',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userName: {
    fontSize: 16,
    color: '#333',
  },
  details: {
    marginTop: 10,
    paddingLeft: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
    marginTop: 10,
  },
  actionText: {
    color: '#A1CEDC',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});