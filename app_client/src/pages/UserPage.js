import { useContext, useState } from "react";
import { Card, Button, Form, Table, Modal } from 'react-bootstrap';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from "../Providers/UserProvider";
import { UserGroupsContext } from "../gruposContext/UserGroupsContext";

export default () => {
    
  const { usersEmpleadosItems, usersClientesItems,loading, error,  addUserClientItem,addUserEmployeeItem} = useContext(UserContext);
  const { userGroups } = useContext(UserGroupsContext);

  const [selectedOption, setSelectedOption] = useState('Clientes');

  const [showClientModal, setShowClientModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const [clientData, setClientData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    detalleCita: '',
    tipoCliente: '' // ID del grupo seleccionado
  });

  const [employeeData, setEmployeeData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    cargo: '', // ID del grupo seleccionado
  });


  // Maneja los cambios en los campos del formulario de cliente
  const handleClientInputChange = (e) => {
    const { name, value } = e.target;
    setClientData(prevState => ({ ...prevState, [name]: value }));
  };

  // Maneja los cambios en los campos del formulario de empleado
  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prevState => ({ ...prevState, [name]: value }));
  };

  // Lógica para guardar un nuevo cliente
  const handleSaveClient = async () => {
    const newClientData = {
      user: {
        username: clientData.username,
        first_name: clientData.first_name,
        last_name: clientData.last_name,
        email: clientData.email,
      },
      ficha_medica: clientData.detalleCita,
      group_name: clientData.tipoCliente
    };
    
    try {
      await addUserClientItem(newClientData);
      toast.success('Cliente guardado exitosamente');
      handleClientModalClose();
    } catch (error) {
      toast.error('Error al guardar el cliente');
    }
  };

  // Lógica para guardar un nuevo empleado
  const handleSaveEmployee = async () => {
    const newEmployeeData = {
      user: {
        username: employeeData.username,
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        email: employeeData.email,
      },
      cargo: 'Administrador',
      group_name: 'Administrador'
    };
    
    try {
      await addUserEmployeeItem(newEmployeeData);
      toast.success('Empleado guardado exitosamente');
      handleEmployeeModalClose();
    } catch (error) {
      toast.error('Error al guardar el empleado');
    }
  };

  // Maneja el cambio en la selección de radio buttons
  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleClientModalShow = () => setShowClientModal(true);
  const handleClientModalClose = () => setShowClientModal(false);

  const handleEmployeeModalShow = () => setShowEmployeeModal(true);
  const handleEmployeeModalClose = () => setShowEmployeeModal(false);

  // ESTE ES EL COMPONENTE DONDE SE MUESTRA LA TABLA DINAMICA CON LOS MENUS QUE EXISTEN
  // Y TAMBIEN ESTAN LOS MODALES QUE SON LLAMADOS DEPENDIENDO DE LA ACCION QUE SE REALICE
  return (
    <div className="container mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-2">Configuración de Usuarios</h2>          
           {/* Radio Buttons */}
           <Form>
            <div className="mb-3">
              <Form.Check type="radio" label="Empleados" name="userType" value="Empleados"
                checked={selectedOption === 'Empleados'}
                onChange={handleRadioChange}
                inline 
              />
              <Form.Check type="radio" label="Clientes"  name="userType" value="Clientes"
                checked={selectedOption === 'Clientes'}
                onChange={handleRadioChange}
                inline 
              />
            </div>
          </Form>
          
          {!loading && !error && selectedOption === 'Clientes' && (
        <div>
            <Button variant="secondary" className="text-dark me-2 mb-3"  onClick={handleClientModalShow}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              <span>Nuevo Cliente</span>
            </Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nombre de Usuario</th>
                  <th>Email</th>
                  <th>Detalle Medico</th>
                  {/* Añadir más columnas si es necesario */}
                </tr>
              </thead>
              <tbody>
                {usersClientesItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.user.first_name + ' ' + item.user.last_name}</td>
                    <td>{item.user.email}</td>
                    <td>{item.ficha_medica}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
          )}

          {!loading && !error && selectedOption === 'Empleados' && (
             <div >
             <Button variant="secondary" className="text-dark me-2 mb-3"  onClick={handleEmployeeModalShow}>
               <FontAwesomeIcon icon={faPlus} className="me-2" />
               <span>Nuevo Empleado</span>
             </Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nombre de Usuario</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Posición</th>
                </tr>
              </thead>
              <tbody>
                {usersEmpleadosItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.user.first_name +' '+ item.user.last_name }</td>
                    <td>{item.user.username}</td>
                    <td>{item.user.email}</td>
                    <td>{item.cargo}</td> 
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
          )}
        </Card.Body>
      </Card>
       {/* Modal para Nuevo Cliente */}
       <Modal show={showClientModal} onHide={handleClientModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ingrese el nombre" 
                name="first_name" 
                value={clientData.first_name} 
                onChange={handleClientInputChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ingrese el apellido" 
                name="last_name" 
                value={clientData.last_name} 
                onChange={handleClientInputChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Ingrese el email" 
                name="email" 
                value={clientData.email} 
                onChange={handleClientInputChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ingrese el username" 
                name="username" 
                value={clientData.username} 
                onChange={handleClientInputChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Detalle de la cita</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Ingrese el detalle de la cita" 
                name="detalleCita" 
                value={clientData.detalleCita} 
                onChange={handleClientInputChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Cliente</Form.Label>
              <Form.Select 
                name="tipoCliente" 
                value={clientData.tipoCliente} 
                onChange={handleClientInputChange}>
                {userGroups
                  .filter(group => group.name === 'Paciente')
                  .map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClientModalClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveClient}>
            Guardar Cliente
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Nuevo Empleado */}
      <Modal show={showEmployeeModal} onHide={handleEmployeeModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ingrese el nombre" 
                name="first_name" 
                value={employeeData.first_name} 
                onChange={handleEmployeeInputChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ingrese el apellido" 
                name="last_name" 
                value={employeeData.last_name} 
                onChange={handleEmployeeInputChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Ingrese el email" 
                name="email" 
                value={employeeData.email} 
                onChange={handleEmployeeInputChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ingrese el username" 
                name="username" 
                value={employeeData.username} 
                onChange={handleEmployeeInputChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cargo</Form.Label>
              <Form.Select 
                name="cargo" 
                value={employeeData.cargo} 
                onChange={handleEmployeeInputChange}>
                {userGroups
                  .filter(group => group.name !== 'Paciente')
                  .map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEmployeeModalClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEmployee}>
            Guardar Empleado
          </Button>
        </Modal.Footer>
      </Modal>
      <Toaster />
    </div>
  );
};