import React, { useContext, useState } from "react";
import { Card, Form, Button, Row, Col, Table, Alert, Spinner, Modal } from 'react-bootstrap';
import { MenuContext } from "../../src/menu/menuContext";
import { UserGroupsContext } from "../gruposContext/UserGroupsContext";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from 'react-hot-toast';

export default () => {

  //LLAMADO DE CONTEXTOS NECESARIOS PARA EL CRUD DE MENUS//
  const { menuItems, loading, error, addMenuItem, deleteMenuItem, updateMenuItem } = useContext(MenuContext);
  const { userGroups } = useContext(UserGroupsContext);

  // GENERARMOS LAS VARIABLES Y ESTADOS QUE VAN A INTERVENIR EN EL CRUD DE MENUS //
  const [menuName, setMenuName] = useState('');
  const [menuURL, setMenuURL] = useState('');
  const [menuLevel, setMenuLevel] = useState('');
  const [menuOrder, setMenuOrder] = useState('');
  const [assignedGroups, setAssignedGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [menuToEdit, setMenuToEdit] = useState(null);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">Error al cargar los datos: {error.message}</Alert>;
  }

  // METODO PARA ASIGNAR LOS GRUPOS EN UN ARREGLO YA SEA PARA CREAR O EDITAR//
  const handleGroupSelection = (groupId) => {
    const newGroups = assignedGroups.includes(groupId)
      ? assignedGroups.filter(g => g !== groupId)
      : [...assignedGroups, groupId];
    setAssignedGroups(newGroups);
  };


  // LOGICA PARA AÑADIR UN NUEVO MENU//
  const handleAddMenu = async (e) => {
    e.preventDefault();
    try {
      const menuData = {
        title: menuName,
        url: menuURL,
        nivel: menuLevel,
        order: menuOrder,
        groups: assignedGroups,
      };
      await addMenuItem(menuData);
      toast.success('Menú agregado con éxito');
      handleCloseModal();
    } catch (error) {
      toast.error('Error al agregar el menú');
    }
  };


  //LOGICA PARA ACTUALIZAR UN MENU//
  const handleUpdateMenu = async (e) => {
    e.preventDefault();
    const menuData = {
      title: menuName,
      url: menuURL,
      nivel: menuLevel,
      order: menuOrder,
      groups: assignedGroups,
    };
    try {
      await updateMenuItem(menuToEdit.id, menuData);  // Aquí se llama a la función del contexto
      toast.success('Menú actualizado con éxito');
      handleCloseModal();
    } catch (error) {
      toast.error('Error al actualizar el menú');
    }
  };

  // AL APLASTAREL BOTON EDITAR EN LA TABLA ACTUALIZAMOS EL ESTADO DEL OBJETO DE TIPO MENU QUE SE ENVIARA//
  const handleEdit = (item) => {
    setMenuToEdit(item);
    setMenuName(item.title);
    setMenuURL(item.url);
    setMenuLevel(item.nivel);
    setMenuOrder(item.order);
    setAssignedGroups(item.groups || []);
    setIsEditing(true);
    setShowModal(true);
  };


  // CUANDO DAMOS CLICK EN NUEVO MENU DEJAMOS UN OBJETO DE TIPO MENU 
  //   EN BLANCO PARA ENVIAR AL API LLENADO POR EL USUARIO
  const handleAddNewMenu = () => {
    setMenuName('');
    setMenuURL('');
    setMenuLevel('');
    setMenuOrder('');
    setAssignedGroups([]);
    setIsEditing(false);
    setShowModal(true);
  };


  //METODO PARA CERRAR EL MODAL Y LIMPIAR LOS VALORES //
  const handleCloseModal = () => {
    setShowModal(false);
    setMenuName('');
    setMenuURL('');
    setMenuLevel('');
    setMenuOrder('');
    setAssignedGroups([]);
  };


  // METODO DONDE SE HABRE UN MODAL QUE SI EL USUARIO DA ACEPTAR PROXIMAMENTE SE ELIMNA EL MENU //
  const handleDelete = (id) => {
    setMenuToDelete(id);
    setShowConfirmDeleteModal(true);
  };


  // METODO DONDE SI EL USUARIO CONFIRMA LA ELIMINACION SE ELIMINA EL MENU//
  const confirmDelete = async () => {
    try {
      await deleteMenuItem(menuToDelete);
      toast.success('Menú eliminado con éxito');
    } catch (error) {
      toast.error('Error al eliminar el menú');
    }
    setShowConfirmDeleteModal(false);
    setMenuToDelete(null);
  };


  //EL USUARIO CANCELO EL METODO ELIMINAR ENTONCES NO SE ELIMINA EL MENU//
  const cancelDelete = () => {
    setShowConfirmDeleteModal(false);
    setMenuToDelete(null);
  };



  // ESTE ES EL COMPONENTE DONDE SE MUESTRA LA TABLA DINAMICA CON LOS MENUS QUE EXISTEN
  // Y TAMBIEN ESTAN LOS MODALES QUE SON LLAMADOS DEPENDIENDO DE LA ACCION QUE SE REALICE
  return (
    <div className="container mt-4">


      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-2">Configuración de Menú</h2>
          <div className="py-3">
            <Button variant="secondary" className="text-dark me-2" onClick={handleAddNewMenu}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              <span>Nuevo Menú</span>
            </Button>
          </div>
          <Table striped bordered hover responsive className="mt-4">
            <thead>
              <tr>
                <th>Título</th>
                <th>URL</th>
                <th>Nivel</th>
                <th>Orden</th>
                <th>Grupos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* AQUI ITERAMOS LOS MENUS DE NIVEL 1 */}
              {menuItems.map((item) => (
                <React.Fragment key={item.id}>
                  <tr>
                    <td>{item.title}</td>
                    <td>{item.url}</td>
                    <td>{item.nivel}</td>
                    <td>{item.order}</td>
                    <td>{Array.isArray(item.groups) ? item.groups.join(', ') : ''}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                  {/* AQUI ITERAMOS LOS MENUS DE NIVEL 2 */}
                  {item.children && item.children.length > 0 && item.children.map((child) => (
                    <tr key={child.id}>
                      <td style={{ paddingLeft: '20px' }}>{child.title}</td>
                      <td>{child.url}</td>
                      <td>{child.nivel}</td>
                      <td>{child.order}</td>
                      <td>{Array.isArray(child.groups) ? child.groups.join(', ') : ''}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(child)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(child.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>

          {/* AQUI TENEMOS EL MODAL QUE DEPENDE DE LA ACCION SI ES CREAR O EDITAR SE ABRE
              CON DISTINTA FUNCIONALIDAD, EOS YA LO CONTROLA EL STATE */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{isEditing ? "Editar Menú" : "Nuevo Menú"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={isEditing ? handleUpdateMenu : handleAddMenu}>
                <Row className="mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="menuName">
                      <Form.Label>Nombre del Menú</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese el nombre del menú"
                        value={menuName}
                        onChange={(e) => setMenuName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="menuURL">
                      <Form.Label>URL del Menú</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="/ejemplo-url/"
                        value={menuURL}
                        onChange={(e) => setMenuURL(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="menuLevel">
                      <Form.Label>Nivel del Menú</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese el nivel del menú"
                        value={menuLevel}
                        onChange={(e) => setMenuLevel(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="menuOrder">
                      <Form.Label>Orden del Menú</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Ingrese el orden del menú"
                        value={menuOrder}
                        onChange={(e) => setMenuOrder(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Grupos Asignados</Form.Label>
                      {userGroups.map(group => (
                        <Form.Check
                          key={group.id}
                          type="checkbox"
                          label={group.name}
                          checked={assignedGroups.includes(group.id)}
                          onChange={() => handleGroupSelection(group.id)}
                        />
                      ))}
                    </Form.Group>
                  </Col>
                </Row>
                {isEditing ? (
                  <Button variant="primary" type="submit" className="w-100 mt-3">
                    Actualizar Menú
                  </Button>
                ) : (
                  <Button variant="success" type="submit" className="w-100 mt-3">
                    Agregar Menú
                  </Button>
                )}
              </Form>
            </Modal.Body>
          </Modal>

          {/* ESTE MODAL ES PARA CONFIRMAR SI SE DESEA ELIMINAR O NO EL MENU SELECCIONADO */}
          <Modal show={showConfirmDeleteModal} onHide={cancelDelete}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>¿Está seguro de que desea eliminar este menú?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={cancelDelete}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
      <Toaster />
    </div>
  );
};
