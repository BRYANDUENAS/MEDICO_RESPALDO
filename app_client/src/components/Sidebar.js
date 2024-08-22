import React, { useState, useContext } from "react";
import SimpleBar from 'simplebar-react';
import { useLocation, useNavigate } from "react-router-dom"; // Importar useNavigate
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Nav, Button } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routess } from "../routes"; // Importar las rutas
import { AuthContext } from "../auth/context/AuthContext";
import Accordion from "../pages/components/Accordion";

export default (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const { user } = useContext(AuthContext); // Accedemos al usuario desde el contexto
  const navigate = useNavigate(); // Hook de navegación
  
  console.log(user.user_permissions);

  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  // Función para renderizar los items de menú
  const renderMenu = () => {
    if (!user) {
      return null; // Si no hay usuario, no mostramos el menú
    }

    return user.user_permissions.map((menuItem, idx) => {
      // Lógica para mapear el menú con las rutas definidas en Routess
      let route;
      switch (menuItem.codename) {
        case 'mostra_logo':
          route = Routess.User.path;
          break;
        case 'delete_user':
          route = Routess.Settings.path;
          break;
        case 'view_user':
          route = Routess.Upgrade.path;
          break;
        case 'mostrar_dashboard':
          route = Routess.Transactions.path;
          break;
        case 'Settings':
          route = Routess.Settings.path;
          break;
        default:
          route = '/'; // Ruta por defecto en caso de que no coincida ningún menú
      }

      return (
        <NavItem
          key={idx}
          title={menuItem.codename}
          onClick={() => navigate(route)} // Navegamos a la ruta correspondiente
        />
      );
    });
  };

  // Componente NavItem que maneja la navegación al hacer clic
  const NavItem = ({ title, onClick }) => {
    const navItemClassName = "active";
    return (
      <Nav.Item className={navItemClassName} onClick={onClick}>
        <Nav.Link>
          <span className="sidebar-icon"></span>
          <span className="sidebar-text">{title}</span>
        </Nav.Link>
      </Nav.Item>
    );
  };

  const CollapsableNavItem = ({ eventKey, title }) => (
    <Accordion as={Nav.Item} defaultActiveKey={pathname.indexOf(eventKey) !== -1 ? eventKey : ""}>
      <Accordion.Item eventKey={eventKey}>
        <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
          <span>
            <span className="sidebar-icon"><FontAwesomeIcon /></span>
            <span className="sidebar-text">{title}</span>
          </span>
        </Accordion.Button>
        <Accordion.Body className="multi-level">
          <Nav className="flex-column">
          </Nav>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  return (
    <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
      <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
        <div className="sidebar-inner px-4 pt-3">
          <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
            <Button as={Link} variant="secondary" size="xs" to="/sign-out" className="text-dark">
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Sign Out
            </Button>
            <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
              <FontAwesomeIcon icon={faTimes} />
            </Nav.Link>
          </div>
          <Nav className="flex-column pt-3 pt-md-0">
            {renderMenu()} {/* Renderizamos el menú dinámico */}
          </Nav>
        </div>
      </SimpleBar>
    </CSSTransition>
  );
};
