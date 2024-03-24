import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from "react-router-dom"; // Importa useNavigate en lugar de useHistory


const Private = () => {
    const navigate = useNavigate();
    const { actions, store } = useContext(Context);
    const [editedUserData, setEditedUserData] = useState({});
    const userData = store.user;

    useEffect(() => {
        getProfile();
    }, []);
    
    const getProfile = async () => {
        try {
            await actions.getProfile();
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };
    
    const handleLogout = async () => {
        try {
            await actions.logout(); // Utiliza la acción de logout
            navigate("/");
        } catch (error) {
            console.error('Error during logout:', error);
            // Manejar cualquier error que ocurra durante el logout
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
                        <p>First Name: {userData.first_name}</p>
                        <p>Last Name: {userData.last_name}</p>
                        <p>Birth Date: {userData.birth_date}</p>
                        <p>Country: {userData.country}</p>
                        <p>Username: {userData.username}</p>
                        <p>Email: {userData.email}</p>
                    </div>
                )}
                <button className="btn logout" onClick={handleLogout}>Logout</button>{' '}
            </div>
        </div>
	);
};

export default Private;