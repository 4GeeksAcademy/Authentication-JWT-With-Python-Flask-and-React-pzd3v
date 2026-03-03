import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate, Link} from "react-router-dom";

const Profile = () => {
    const { store, dispatch } = useGlobalReducer();

    // 1. Cargar favoritos del usuario desde el Backend
    const loadFavorites = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/favorites`, {
                headers: {
                    "Authorization": "Bearer " + store.token
                }
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({ type: "set_favorites", payload: data });
            }
        } catch (error) {
            console.error("Error cargando favoritos:", error);
        }
    };

    // 2. Unificada: Agregar favorito (Planeta o Personaje)
    const handleAddFavorite = async (id, type) => {
        const endpoint = type === "planet" ? `/favorite/planet/${id}` : `/favorite/people/${id}`;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + store.token
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert(`¡${type} guardado con éxito!`);
                loadFavorites(); // Recargamos la lista para ver el cambio
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error("Error al añadir favorito:", error);
        }
    };

    // 3. Eliminar favorito
    const handleDeleteFavorite = async (id, type) => {
        const endpoint = type === "planet" ? `/favorite/planet/${id}` : `/favorite/people/${id}`;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + store.token
                }
            });

            if (response.ok) {
                loadFavorites(); // Recargamos para que desaparezca de la lista
            }
        } catch (error) {
            console.error("Error al eliminar favorito:", error);
        }
    };

    useEffect(() => {

        if (store.token) {
            loadFavorites();

            // Solo pedimos los datos base si el store está vacío
            if (store.planets.length === 0) {
                fetch(`${import.meta.env.VITE_BACKEND_URL}/planets`)
                    .then(res => res.json())
                    .then(data => dispatch({ type: "load_planets", payload: data }));
            }
            if (store.people.length === 0) {
                fetch(`${import.meta.env.VITE_BACKEND_URL}/people`)
                    .then(res => res.json())
                    .then(data => dispatch({ type: "load_people", payload: data }));
            }
        }
    }, [store.token]);

    // 🛡️ 1. LÓGICA INVERSA CORREGIDA: Si NO hay token, mostramos aviso
    if (!store.token) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger p-5 shadow">
                    <h2>🔒 Acceso Restringido</h2>
                    <p className="lead">Debes iniciar sesión para ver tu perfil y favoritos.</p>
                    <Link to="/login" className="btn btn-primary mt-3">Ir al Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="text-primary mb-4">Mis Favoritos ❤️</h2>
            <div className="row mb-5">
                {store.favorites && store.favorites.length > 0 ? (
                    store.favorites.map((fav) => {
                        // Buscamos el detalle cruzando los IDs (usamos == por seguridad de tipos)
                        const planetDetail = store.planets.find(p => p.id == fav.planet_id);
                        const personDetail = store.people.find(p => p.id == fav.people_id);

                        return (
                            <div key={fav.id} className="col-md-3">
                                <div className="card shadow-sm mb-3 p-3 border-danger">
                                    <h5 className="card-title text-center">
                                        {planetDetail ? `🪐 ${planetDetail.name}` :
                                            personDetail ? `👤 ${personDetail.name}` :
                                                "Buscando nombre..."}
                                    </h5>
                                    <button
                                        className="btn btn-sm btn-outline-danger w-100"
                                        onClick={() => handleDeleteFavorite(
                                            fav.planet_id || fav.people_id,
                                            fav.planet_id ? "planet" : "people"
                                        )}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-12 text-muted">Aún no tienes favoritos guardados.</div>
                )}
            </div>

            <hr />

            <h4 className="mt-5">Explorar Galaxia</h4>
            <div className="d-flex flex-row overflow-scroll p-3 bg-light rounded">
                {store.planets.map((planet) => (
                    <div key={planet.id} className="card m-2 border-0 shadow-sm" style={{ minWidth: "15rem" }}>
                        <div className="card-body text-center">
                            <h5 className="card-title">{planet.name}</h5>
                            <p className="card-text small text-muted">Población: {planet.population}</p>
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleAddFavorite(planet.id, "planet")}
                            >
                                ❤️ Favorito
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h4 className="mt-5">Personajes</h4>
            <div className="d-flex flex-row overflow-scroll p-3 bg-light rounded">
                {store.people.map((people) => (
                    <div key={people.id} className="card m-2 border-0 shadow-sm" style={{ minWidth: "15rem" }}>
                        <div className="card-body text-center">
                            <h5 className="card-title">{people.name}</h5>
                            <p className="card-text small text-muted">Birth year: {people.birth_year}</p>
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleAddFavorite(people.id, "people")}
                            >
                                ❤️ Favorito
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Profile;