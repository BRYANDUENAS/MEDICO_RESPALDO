
import React, { useContext, useState } from "react";
import { Col, Row, Card, Form, Button, InputGroup } from '@themesberg/react-bootstrap';
import { UserGroupsContext } from "../gruposContext/UserGroupsContext";


export const GeneralInfoForm = () => {
  const { userGroups} = useContext(UserGroupsContext);

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
                  <option value="0">Seleccione un grupo</option>
                  {(() => {
                    try {
                      return userGroups.map(group => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ));
                    } catch (error) {
                      console.error("Error al mapear grupos de usuarios:", error);
                      return <option value="0" disabled>Error cargando grupos</option>;
                    }
                  })()}
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
        </Form>
      </Card.Body>
    </Card>
  );
};
