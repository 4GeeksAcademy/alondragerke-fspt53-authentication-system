import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Don't change, here is where we initialize our context, by default it's just going to be null.
export const Context = React.createContext(null);

// This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		//this will be passed as the contenxt value
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);

        // useEffect se utiliza para realizar tareas después de la renderización
        useEffect(() => {
            // Función para cargar datos del backend al iniciar la aplicación
            const fetchData = async () => {
                try {
                    // Llama a la acción getMessage para cargar datos desde el backend
                    await state.actions.getMessage();
                } catch (error) {
                    console.error("Error fetching data:", error);
                    // Manejo de errores
                }
            };

            // Llama a la función fetchData al montar el componente por primera vez
            fetchData();

            // La siguiente línea de código define qué sucede cuando el componente se desmonta
            // En este caso, no hay ninguna limpieza necesaria, por lo que no es necesario definir nada aquí
            return () => {
                // Código de limpieza (si es necesario)
            };
        }, []);

		// The initial value for the context is not null anymore, but the current state of this component,
		// the context will now have a getStore, getActions and setStore functions available, because they were declared
		// on the state of this component
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;
