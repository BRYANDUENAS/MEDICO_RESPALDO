import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/context/AuthContext';

// Crear el contexto
export const UserGroupsContext = createContext();

// Proveedor del contexto
export const UserGroupsProvider = ({ children }) => {
// Obtener el contexto del usuario para acceder al token
  const { user } = useContext(AuthContext);
  
    // Asegúrate de que el token está disponible
    const token = user?.token;

  const [userGroups, setUserGroups] = useState(() => {
    // Inicializa con datos del localStorage si están disponibles
    const storedGroups = localStorage.getItem('userGroups');
    return storedGroups ? JSON.parse(storedGroups) : [];
  });

  useEffect(() => {
    const fetchUserGroups = async () => {

      try {
        const response = await axios.get('http://127.0.0.1:8000/auth/groups/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setUserGroups(response.data);
        // Guarda los grupos en localStorage para persistencia
        localStorage.setItem('userGroups', JSON.stringify(response.data));
      } catch (err) {
      } finally {
      }
    };

    fetchUserGroups();
  }, [token]); // Dependencia en `token` para volver a cargar si cambia

  // Función para limpiar los grupos cuando el usuario cierre sesión
  const clearUserGroups = () => {
    setUserGroups([]);
    localStorage.removeItem('userGroups');
  };

  return (
    <UserGroupsContext.Provider value={{ userGroups,clearUserGroups }}>
      {children}
    </UserGroupsContext.Provider>
  );
};

// Hook para consumir el contexto
export const useUserGroups = () => useContext(UserGroupsContext);