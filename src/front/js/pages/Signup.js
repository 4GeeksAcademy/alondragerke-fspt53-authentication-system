import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from "react-router-dom"; 
import { Button, Form, InputGroup } from "react-bootstrap"; 


const Signup = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        birth_date: "",
        country: "",
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await actions.signup(userData);
            setUserData({
                first_name: '',
                last_name: '',
                birth_date: '',
                country: '',
                username: '',
                email: '',
                password: ''
            });
            console.log('Redirigiendo al usuario a la página de inicio de sesión');
            navigate('/login');
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
        <div className="d-flex justify-content-center signin-container">
            <Form onSubmit={handleSubmit} >
                <InputGroup className="mb-3 input-group">
                    <InputGroup.Text className="addon">First name</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="first_name"
                        value={userData.first_name}
                        onChange={handleChange}
                        className="form-control focus-ring"
                        placeholder="John"
                        aria-label="First name"
                        aria-describedby="first_name-input"
                        required
                    />
                </InputGroup>
                <InputGroup className="mb-3 input-group">
                    <InputGroup.Text className="addon">Last name</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="last_name"
                        value={userData.last_name}
                        onChange={handleChange}
                        className="form-control focus-ring"
                        placeholder="Doe"
                        aria-label="Last name"
                        aria-describedby="last_name-input"
                        required
                    />
                </InputGroup>
                <InputGroup className="mb-3 input-group">
                    <InputGroup.Text className="addon">Birth date</InputGroup.Text>
                    <Form.Control
                        type="date"
                        name="birth_date"
                        value={userData.birth_date}
                        onChange={handleChange}
                        className="form-control focus-ring"
                        id="form-control-date"
                        placeholder="12-08-1980"
                        aria-label="Birth date"
                        aria-describedby="birth_date-input"
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
