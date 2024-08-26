import React, { createContext, useContext, useState, useEffect, updateMenuItem} from 'react';
import axios from 'axios';
import { AuthContext } from '../../src/auth/context/AuthContext';

// Crear el contexto
export const MenuContext = createContext();

// Proveedor del contexto
export const MenuProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/auth/menu-items/', {
          headers: {
            Authorization: `Token ${user?.token}`,
          },
        });
        setMenuItems(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchMenuItems();
    }
  }, [user?.token]);

  const addMenuItem = async (menuData) => {
    try {
      await axios.post('http://127.0.0.1:8000/auth/menu-items/', menuData, {
        headers: {
          Authorization: `Token ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });
      // Optionally, refresh the menu items after adding a new one
      await menuItems
    } catch (err) {
      console.error('Error adding menu item:', err);
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/auth/menu-items/${id}/`, {
        headers: {
          Authorization: `Token ${user?.token}`,
        },
      });
      // Optionally, refresh the menu items after deleting one
      const response = await axios.get('http://127.0.0.1:8000/auth/menu-items/', {
        headers: {
          Authorization: `Token ${user?.token}`,
        },
      });
      setMenuItems(response.data);
    } catch (err) {
      console.error('Error deleting menu item:', err);
    }
  };

  const updateMenuItem = async (id, menuData) => {
    try {
      await axios.put(`http://127.0.0.1:8000/auth/menu-items/${id}/`, menuData, {
        headers: {
          Authorization: `Token ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });
      // Refresh the menu items after updating one
      await menuItems;
    } catch (err) {
      console.error('Error updating menu item:', err);
    }
  };

  return (
    <MenuContext.Provider value={{ menuItems, loading, error, addMenuItem , deleteMenuItem, updateMenuItem}}>
      {children}
    </MenuContext.Provider>
  );
};

