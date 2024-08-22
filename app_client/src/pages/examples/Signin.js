
import React, { useState,useEffect, useContext  } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faUser, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Routess } from "../../routes";
import BgImage from "../../assets/img/image_login.jpg";
import '../../css/login.css';
import { AuthContext } from "../../auth/context/AuthContext";

/* styles.css o cualquier archivo CSS que uses */

const  LoginPage=() => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook para redirigir
  const {login}= useContext(AuthContext);

  useEffect(() => {
    // Añadir la clase de animación cuando el componente se monta
    const rowElement = document.querySelector(".slide-in-row");
    if (rowElement) {
      rowElement.classList.add("slide-in");
    }
  }, []);

  const onLogin = async (event) => {
    event.preventDefault();
    await login(username, password);
    navigate(Routess.DashboardOverview.path, { replace: true });
  };

  return (
    <main  style={{ backgroundImage: `url(${BgImage})`,backgroundSize: 'cover',  // Asegura que la imagen cubra todo el área
    backgroundPosition: 'center 0px', // Centra la imagen
    backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
    height: '100vh', // Ajusta la altura del contenedor a la altura completa de la ventana
    width: '100vw',  // Ajusta el ancho del contenedor a todo el ancho de la ventana
    margin:0, // Elimina márgenes para asegurar que el contenedor cubra todo el viewport
    padding:0, }}>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container className="d-flex">
          {/*<p className="text-center">
            <Card.Link as={Link} to={Routess.DashboardOverview.path} className="text-gray-700">
              <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage
            </Card.Link>
          </p>*/}
          <Row className="justify-content-start form-bg-image slide-in-row">
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Plataforma centro Médico</h3>
                </div>
                <Form className="mt-4" onSubmit={onLogin}>
                  <Form.Group id="username" className="mb-4">
                    <Form.Label>Usuario</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUser} />
                      </InputGroup.Text>
                      <Form.Control
                        autoFocus
                        required
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="password" className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        required
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check type="checkbox">
                      <FormCheck.Input id="defaultCheck5" className="me-2" />
                      <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Remember me</FormCheck.Label>
                    </Form.Check>
                    <Card.Link className="small text-end">Lost password?</Card.Link>
                  </div>
                  <Button variant="primary" type="submit" className="w-100">
                    Ingresar
                  </Button>
                </Form>

                <div className="mt-3 mb-4 text-center">
                  <span className="fw-normal">or login with</span>
                </div>
                <div className="d-flex justify-content-center my-4">
                  <Button variant="outline-light" className="btn-icon-only btn-pill text-facebook me-2">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </Button>
                  <Button variant="outline-light" className="btn-icon-only btn-pill text-twitter me-2">
                    <FontAwesomeIcon icon={faTwitter} />
                  </Button>
                  <Button variant="outline-light" className="btn-icon-only btn-pil text-dark">
                    <FontAwesomeIcon icon={faGithub} />
                  </Button>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    Not registered?
                    <Card.Link as={Link} to={Routess.Signup.path} className="fw-bold">
                      {` Create account `}
                    </Card.Link>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default LoginPage;