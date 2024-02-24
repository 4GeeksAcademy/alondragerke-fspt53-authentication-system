import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate en lugar de useHistory
import { Button, Form, InputGroup } from "react-bootstrap"; // Importa los componentes necesarios de react-bootstrap
import getState from "/workspaces/alondragerke-fspt53-authentication-system/src/front/js/store/flux.js";


const Signup = () => {
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        country: "",
        username: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const { actions } = getState();


    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await actions.signup(userData); // Utilizar la acción de signup
            if (response && response.message) {
                console.log(response.message); // Manejar el mensaje de respuesta según sea necesario
                navigate("/login"); // Redirigir al usuario a la página de inicio de sesión después del registro exitoso
            } else {
                // El registro falló, puedes mostrar un mensaje de error o realizar alguna otra acción
                console.error('Signup failed:', response && response.error ? response.error : 'Unknown error'); // Mostrar el mensaje de error proporcionado por la acción de signup, o un mensaje predeterminado
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };
    

    return (
        <div className="d-flex justify-content-center signin-container">
            <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3 input-group">
                    <InputGroup.Text className="addon">First name</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        className="form-control focus-ring"
                        placeholder="John"
                        aria-label="First name"
                        aria-describedby="firstName-input"
                        required
                    />
                </InputGroup>
                <InputGroup className="mb-3 input-group">
                    <InputGroup.Text className="addon">Last name</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                        className="form-control focus-ring"
                        placeholder="Doe"
                        aria-label="Last name"
                        aria-describedby="lastName-input"
                        required
                    />
                </InputGroup>
                <InputGroup className="mb-3 input-group">
                    <InputGroup.Text className="addon">Birth date</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="birthDate"
                        value={userData.birthDate}
                        onChange={handleChange}
                        className="form-control focus-ring"
                        placeholder="12/08/1980"
                        aria-label="Birth date"
                        aria-describedby="birthDate-input"
                        required
                    />
                </InputGroup>
                <InputGroup className="mb-3 input-group">
                    <InputGroup.Text className="addon">Country</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="country"
                        value={userData.country}
                        onChange={handleChange}
                        className="form-control focus-ring"
                        placeholder="United States"
                        aria-label="Country"
                        aria-describedby="country-input"
                        required
                    />
                </InputGroup>
                <InputGroup className="mb-3 input-group">
                    <InputGroup.Text className="addon">Username</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        className="form-control focus-ring"
                        placeholder="john.doe"
                        aria-label="Username"
                        aria-describedby="username-input"
                        required
                    />
                </InputGroup>
                <InputGroup className="mb-3 input-group">
                    <InputGroup.Text className="addon">Email</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className="form-control focus-ring"
                        placeholder="john.doe@gmail.com"
                        aria-label="Email"
                        aria-describedby="email-input"
                        required
                    />
                </InputGroup>
                <InputGroup className="mb-3 input-group">
                    <InputGroup.Text className="addon">Password</InputGroup.Text>
                    <Form.Control
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        className="form-control focus-ring"
                        placeholder="123456"
                        aria-label="Password"
                        aria-describedby="password-input"
                        required
                    />
                </InputGroup>
                <Button className="login-page-btn" type="submit">Sign in</Button>{' '}
            </Form>
        </div>
    );
};

export default Signup;
