const getState = ({ getStore, getActions, setStore } = {}) => {
    return {
        store: {
            message: null,
            user: null,
            session: {
                isLoggedIn: false,
                username: null,
                token: localStorage.getItem('token') || null,
            }
        },
        actions: {
            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
                    const data = await resp.json();
                    setStore((prevState) => ({ ...prevState, store: { ...prevState.store, message: data.message } }));
                    return data;
                } catch(error) {
                    console.log("Error loading message from backend", error);
                }
            },

            login: async (username, password) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, password })
                    });
                    const data = await resp.json();
                    if (resp.ok) {
                        setStore(prevState => ({
                            ...prevState,
                            user: data, // Almacena la información del usuario autenticado en el estado del almacén
                            session: {
                                ...prevState.session,
                                isLoggedIn: true,
                                token: data.token // Actualiza el token en el estado del almacén
                            }
                        }));
                        localStorage.setItem('token', data.token); // Guarda el token JWT en el localStorage
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
                    const resp = await fetch(process.env.BACKEND_URL + "/api/signup", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    });
                    if (resp.ok) {
                        const data = await resp.json();
                        console.log("Data: ", data); // Handle the response message accordingly
                    } else {
                        // Si la respuesta no es exitosa, imprime un mensaje de error
                        console.error("Signup request failed with status:", resp.status);
                    }
                } catch (error) {
                    console.error("Error during signup:", error);
                }
            },

            getProfile: async () => {
                try {
                    const token = localStorage.getItem('token');
                    const resp = await fetch(process.env.BACKEND_URL + "/api/profile", {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (resp.ok) {
                        const userData = await resp.json();
                        // Actualizar el estado del almacén con la información del perfil obtenida
                        setStore(prevState => ({
                            ...prevState,
                            user: userData,
                            session: {
                                ...prevState.session,
                                isLoggedIn: true
                            }
                        }));
                        return userData;
                    } else {
                        console.error("Error fetching user profile:", resp.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            },
          
            logout: async () => {
                try {
                    const token = localStorage.getItem('token'); // Obtener el token del localStorage
                    const resp = await fetch(process.env.BACKEND_URL + "/api/logout", {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}` // Incluir el token en el encabezado Authorization
                        }
                    });
                    if (resp.ok) {
                        setStore(prevState => ({
                            ...prevState,
                            user: null,
                            session: {
                                ...prevState.session,
                                isLoggedIn: false,
                                username: null,
                                token: null
                            }
                        }));
                        localStorage.removeItem('token');

                        const data = await resp.json();
                        console.log(data.message);
                        return data;
                    } else {
                        console.error("Error during logout:", resp.statusText);
                    }
                } catch (error) {
                    console.error("Error during logout:", error);
                }
            }
        }
    };
};


export default getState;
