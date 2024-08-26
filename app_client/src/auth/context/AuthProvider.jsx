import axios from 'axios'; // Importamos axios
import { useReducer, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { types } from "../types/types";
import { authReducer } from "./authReducer";
import { UserGroupsContext } from '../../gruposContext/UserGroupsContext';

const init=()=>{
   const user= JSON.parse(localStorage.getItem('user'));
   return{
    logged: !!user,
    user:user || null,
   }
}

export default function AuthProvider({children}) {
  const [authState, dispatch] = useReducer(authReducer,{}, init);

  const login = async (username = '', password = '') => {
    try {
      // Realizamos la petición POST con axios
      const response = await axios.post('http://127.0.0.1:8000/auth/login/', {
        username: username,
        password: password
      });

      // Si la autenticación es exitosa, recibimos la data del usuario
      const data = response.data;
      // Almacenas el usuario en localStorage
      localStorage.setItem('user', JSON.stringify(data));

      // Disparas la acción de login
      const action = { type: types.login, payload: data};
      dispatch(action);

    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      // Aquí puedes manejar errores, como mostrar un mensaje de error al usuario
    }
  };

  
  const logout=()=>{
    localStorage.removeItem('user');
    const action={type:types.logout}
    dispatch(action)         
  }


  return (
    <AuthContext.Provider value={{
        ...authState,
        login,
        logout
    }}>
        {children}
    </AuthContext.Provider>
  )
}
