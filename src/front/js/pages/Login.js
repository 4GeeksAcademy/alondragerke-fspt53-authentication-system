import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, InputGroup } from "react-bootstrap";
import getState from "/workspaces/alondragerke-fspt53-authentication-system/src/front/js/store/flux.js";


const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    const { actions } = getState();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await actions.login(credentials.username, credentials.password); // Utilizar la acción de login
            if (userData && userData.access_token) {
                navigate('/private'); // Redirigir a la página privada después del inicio de sesión exitoso
            } else {
                // El inicio de sesión falló, puedes mostrar un mensaje de error o realizar alguna otra acción
                console.error('Login failed:', userData && userData.message ? userData.message : 'Unknown error'); // Mostrar el mensaje de error proporcionado por la acción de login, o un mensaje predeterminado
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="d-flex justify-content-center login-container">
            <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3 input-group">
                    <InputGroup.Text className="addon">Username</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        className="form-control focus-ring"
                        placeholder="john.doe"
                        aria-label="Username"
                        aria-describedby="username-input"
                        required
                    />
                </InputGroup>
                <InputGroup className="mb-3 input-group">
                    <InputGroup.Text className="addon">Password</InputGroup.Text>
                    <Form.Control
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="form-control focus-ring"
                        placeholder="123456"
                        aria-label="Password"
                        aria-describedby="password-input"
                        required
                    />
                </InputGroup>
                <Button className="login-page-btn" type="submit">Log in</Button>{' '}
            </Form>
        </div>
    );
};

export default Login;