
import React, { useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';


export const GeneralInfoForm = () => {
  const [birthday, setBirthday] = useState("");

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Información General</h5>
        <Form>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="firstName">
                <Form.Label>Nombres</Form.Label>
                <Form.Control required type="text" placeholder="Ingrese los nombres" />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="lastName">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control required type="text" placeholder="Ingrese los apellidos" />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="emal">
                <Form.Label>Correo electronico</Form.Label>
                <Form.Control required type="email" placeholder="name@hotmail.com" />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="username">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control required type="text" placeholder="Username" />
              </Form.Group>
            </Col>            
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group className="mb-2">
                <Form.Label>Tipo de usuario</Form.Label>
                <Form.Select id="state" defaultValue="0">
                  <option value="0">Administrador</option>
                  <option value="AL">Doctor</option>
                  <option value="AK">Enfermero</option>   
                  <option value="A">Paciente</option>  
                  <option value="K">Recepcionista</option>                 
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="phone">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control required type="number" placeholder="0987654321" />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="primary" type="submit">Save All</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
