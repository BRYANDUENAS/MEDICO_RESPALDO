import React from 'react';
import { Accordion, Card, Nav } from '@themesberg/react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Routess } from '../../routes';
import '../../../src/assets/acordion.css'; // Asegúrate de que este archivo CSS esté en la misma carpeta

const AccordionComponent = ({ defaultKey, data }) => {
  const navigate = useNavigate();
  let route;
  switch (data.title) {
    case 'Configuracion':
      route = Routess.User.path;
      break;
    case 'Perfil':
      route = Routess.Settings.path;
      break;
    case 'Can view content type':
      route = Routess.Upgrade.path;
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

  return (
    <Accordion defaultActiveKey={defaultKey} className="custom-accordion">
      {data.children.map((item) => (
        <Card key={item.id} className="mb-2 custom-card">
          <Accordion.Item eventKey={item.eventKey}>
            <Accordion.Header className="custom-header">{data.title}</Accordion.Header>
            <Accordion.Body className="custom-body">
              <Nav.Item onClick={() => navigate(route)}>
                <Nav.Link className="custom-nav-link">
                  <span className="sidebar-icon"></span>
                  <span className="sidebar-text">{item.title}</span>
                </Nav.Link>
              </Nav.Item>
            </Accordion.Body>
          </Accordion.Item>
        </Card>
      ))}
    </Accordion>
  );
};

export default AccordionComponent;
