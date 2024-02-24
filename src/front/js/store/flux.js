const getState = ({ getStore, getActions, setStore } = {}) => {
    return {
        store: {},
        actions: {
            getMessage: async () => {
                try {
                    const resp = await fetch("https://glowing-space-fiesta-v6vqq7rgv9gvfpp4g-3001.app.github.dev/api/hello")
                    const data = await resp.json();
                    setStore((prevState) => ({ ...prevState, store: { ...prevState.store, message: data.message } }));
                    return data;
                } catch(error) {
                    console.log("Error loading message from backend", error);
                }
            },
            login: async (username, password) => {
                try {
                    const resp = await fetch("https://glowing-space-fiesta-v6vqq7rgv9gvfpp4g-3001.app.github.dev/api/auth/login", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, password })
                    });
                    const data = await resp.json();
                    if (resp.ok) {
                        localStorage.setItem('token', data.access_token); // Guardar el token JWT en el localStorage
                        console.log("access token:", data.access_token);
                    } else {
                        console.log("Login failed:", data.message);
                    }
                    return data;
                } catch (error) {
                    console.error("Error during login:", error);
                }
            },
            signup: async (userData) => {
                try {
                    const resp = await fetch("https://glowing-space-fiesta-v6vqq7rgv9gvfpp4g-3001.app.github.dev/api/auth/signup", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    });
                    const data = await resp.json();
                    console.log(data.message); // Handle the response message accordingly
                } catch (error) {
                    console.error("Error during signup:", error);
                }
            },
            editProfile: async (userData) => {
                try {
                    const token = localStorage.getItem('token'); // Obtener el token JWT del almacenamiento local
                    const resp = await fetch("https://glowing-space-fiesta-v6vqq7rgv9gvfpp4g-3001.app.github.dev/api/user/profile", {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // Incluir el token en el encabezado Authorization
                        },
                        body: JSON.stringify(userData)
                    });
                    const data = await resp.json();
                    console.log(data.message); // Handle the response message accordingly
                    return data;
                } catch (error) {
                    console.error("Error editing profile:", error);
                }
            },
            deleteUser: async (userId) => {
                try {
                    const token = localStorage.getItem('token'); // Obtener el token JWT del almacenamiento local
                    const resp = await fetch(`https://glowing-space-fiesta-v6vqq7rgv9gvfpp4g-3001.app.github.dev/api/user/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}` // Incluir el token en el encabezado Authorization
                        }
                    });
                    const data = await resp.json();
                    console.log(data.message); // Handle the response message accordingly
                    return data;
                } catch (error) {
                    console.error("Error deleting user:", error);
                }
            },
            logout: async () => {
                try {
                    const resp = await fetch("https://glowing-space-fiesta-v6vqq7rgv9gvfpp4g-3001.app.github.dev/api/auth/logout", {
                        method: 'POST'
                    });
                    const data = await resp.json();
                    console.log(data.message); // Handle the response message accordingly
                    // Clear user data from the store or perform any necessary cleanup
                    return data;
                } catch (error) {
                    console.error("Error during logout:", error);
                }
            }
        }
    };
};


export default getState;
