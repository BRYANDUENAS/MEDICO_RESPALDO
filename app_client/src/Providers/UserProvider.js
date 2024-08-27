import React, { createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/context/AuthContext';

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  
  const baseUrl= 'http://127.0.0.1:8000';

  const { user } = useContext(AuthContext);
  const [usersEmpleadosItems, setUsersEmpleadosItems] = useState([]);  
  const [usersClientesItems, setUsersClientesItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersEmpleadosItems = async () => {
      try {
        const response = await axios.get(`${baseUrl}/auth/empleados/`, {
          headers: {
            Authorization: `Token ${user?.token}`,
          },
        });
        setUsersEmpleadosItems(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    const fetchUsersClientesItems = async () => {
        try {
          const response = await axios.get(`${baseUrl}/auth/clientes/`, {
            headers: {
              Authorization: `Token ${user?.token}`,
            },
          });
          setUsersClientesItems(response.data);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };

    if (user?.token) {
        fetchUsersClientesItems();
        fetchUsersEmpleadosItems();
    }
  }, [user?.token]); 



  const addUserClientItem = async (userClientData) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/clientes/`, userClientData, {
        headers: {
          Authorization: `Token ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });
      // Optionally, refresh the menu items after adding a new one
      await usersClientesItems
      console.log(response)
    } catch (err) {
      console.error('Error adding client:', err);
    }
  };




  const addUserEmployeeItem = async (userEmployeeData) => {
    console.log(user?.token)
    console.log(userEmployeeData.user.username)
    console.log(userEmployeeData)
    const params={
        user: {
          username: userEmployeeData.user.username,
          first_name: userEmployeeData.user.first_name,
          last_name: userEmployeeData.user.last_name,
          email: userEmployeeData.user.email,
        },
        cargo: userEmployeeData.cargo,
        group_name: userEmployeeData.group_name
      }
      try {
        const response = await axios.post('http://127.0.0.1:8000/auth/empleados/', params, {
          headers: {
            Authorization: `Token ${user?.token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Response:', response.data);
      } catch (err) {
        console.error('Error adding employee item:', err.response ? err.response.data : err.message);
        if (err.response && err.response.data) {
          console.error('Error details (full):', JSON.stringify(err.response.data, null, 2));
        }
      }      
  };
  return (
    <UserContext.Provider value={{ usersEmpleadosItems, usersClientesItems,loading, error, addUserClientItem,addUserEmployeeItem}}>
      {children}
    </UserContext.Provider>
  );
};

