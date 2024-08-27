import React, { useState, useContext } from "react";
import SimpleBar from 'simplebar-react';
import { useNavigate } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { Nav } from '@themesberg/react-bootstrap';
import { AuthContext } from "../auth/context/AuthContext";
import { Routess } from "../routes"; 
import AccordionComponent from "../pages/components/Accordion";

const Sidebar = ({ showSidebar }) => {
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate(); 
  
  // Función para renderizar los ítems del menú
  const renderMenu = () => {
    if (!user) return null; 

    return user.user.menu_items.map((menuItem) => {
      let route;
      switch (menuItem.title) {
        case 'Configuracion':
          route = Routess.Menu.path;
          break;
        case 'Perfil':
          route = Routess.Settings.path;
          break;
        case 'Usuario':
          route = Routess.Usuario.path;
          break;
        case 'Can change user':
          route = Routess.Transactions.path;
          break;
        case 'Settings':
          route = Routess.Settings.path;
          break;
        default:
          route = '/'; 
      }

      // Verificar si tiene submenús
      if (menuItem.children && menuItem.children.length > 0) {
        return (
          <CollapsableNavItem key={menuItem.id} menu={menuItem} eventKey={menuItem.id} />
        );
      } else {
        return (
          <NavItem
            key={menuItem.id}
            title={menuItem.title}
            onClick={() => navigate(route)}
          />
        );
      }
    });
  };

  // Componente para ítems del menú sin hijos (enlaces simples)
  const NavItem = ({ title, onClick }) => (
    <Nav.Item onClick={onClick}>
      <Nav.Link>
        <span className="sidebar-icon"></span>
        <span className="sidebar-text">{title}</span>
      </Nav.Link>
    </Nav.Item>
  );

  // Componente para ítems del menú con submenús (acordeón)
  const CollapsableNavItem = ({ eventKey, menu }) => (
    <AccordionComponent defaultKey={eventKey} data={menu} />
  );

  return (
    <div>            
      {/* Sidebar con CSSTransition para controlar su visibilidad */}
      <CSSTransition timeout={300} classNames="sidebar-transition">
        <SimpleBar className={`collapse sidebar d-md-block bg-primary text-white`} style={{ zIndex: 1000 }}>
          <div className="sidebar-inner px-4 pt-3">
            <Nav className="flex-column pt-3 pt-md-0">
              {renderMenu()} {/* Renderizamos el menú dinámico */}
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </div>
  );
};

export default Sidebar;
