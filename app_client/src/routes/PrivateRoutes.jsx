import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './../auth/context/AuthContext'; // Asegúrate de que la ruta es correcta
import { Routess } from './../routes'; // Asegúrate de que la ruta es correcta

export const PrivateRoutes = () => {
  const { logged } = useContext(AuthContext);
  return logged ? <Outlet /> : <Navigate to={Routess.Signin.path} replace />;
};