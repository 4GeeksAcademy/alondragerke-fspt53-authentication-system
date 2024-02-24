import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom"; // Importa useNavigate en lugar de useHistory
import getState from "/workspaces/alondragerke-fspt53-authentication-system/src/front/js/store/flux.js"; // Importa el objeto getState


const Private = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const { actions } = getState();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("Token:", token);
                const response = await fetch('/api/auth/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (!response.ok) {
                    // Si la respuesta no es exitosa, lanzamos un error con la respuesta del servidor
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
    
                const userData = await response.json();
                console.log("User Data:", userData);
                setUserData(userData);
            } catch (error) {
                // Manejar errores de red o errores en la respuesta del servidor
                console.error('Error fetching user data:', error.message);
            }
        };
    
        fetchData();
    }, []);
    

    const handleEditProfile = () => {
        // Redirige al usuario a la página de edición de perfil
        navigate("/edit-profile");
    };

    const handleDeleteAccount = async () => {
        try {
            const userId = userData.id; // Obtener el ID del usuario actual
            await actions.deleteUser(userId); // Utilizar la acción de deleteUser para eliminar la cuenta
            // Redirige al usuario a la página de inicio de sesión u otra página adecuada
            navigate("/login");
        } catch (error) {
            console.error('Error deleting account:', error);
            // Maneja cualquier error que ocurra durante la eliminación de cuenta
        }
    };

    const handleLogout = async () => {
        try {
            await actions.logout(); // Utiliza la acción de logout
            // Redirige al usuario a la página de inicio de sesión u otra página adecuada
            navigate("/login");
        } catch (error) {
            console.error('Error during logout:', error);
            // Maneja cualquier error que ocurra durante el logout
        }
    };

	return (
        <div className="d-flex justify-content-center login-container">
            <div>
                <h1 className="logout-title">Welcome to your private page!</h1>
                <br></br>
                <br></br>
                {userData && (
                    <div className="user-info">
                        <p>First Name: {userData.firstName}</p>
                        <p>Last Name: {userData.lastName}</p>
                        <p>Birth Date: {userData.birthDate}</p>
                        <p>Country: {userData.country}</p>
                        <p>Username: {userData.username}</p>
                        <p>Email: {userData.email}</p>
                    </div>
                )}
                <Button className="edit-profile-btn" onClick={handleEditProfile}>Edit Profile</Button>{' '}
                <Button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</Button>{' '}
                <Button className="logout-btn" onClick={handleLogout}>Logout</Button>{' '}
            </div>
        </div>
	);
};

export default Private;