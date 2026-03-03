export const initialStore = () => {
  return {
    message: null,
    token: null,
    planets: [], // <--- Para guardar todos los planetas
    people: [], // <--- Para guardar todos los personajes
    favorites: [], // <--- Para guardar los favoritos del usuario logueado
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "save_token":
      return {
        ...store,
        token: action.payload,
      };

    case "login":
      return {
        ...store,
        token: action.payload, // Aquí guardamos el token que viene del fetch
      };

    // Caso para llenar la lista de planetas
    case "load_planets":
      return { ...store, planets: action.payload };

    // Caso para llenar la lista de personajes
    case "load_people":
      return { ...store, people: action.payload };

    // Caso para actualizar los favoritos
    case "set_favorites":
      return { ...store, favorites: action.payload };
    
    case "del_favorite":
      return {...store, favorites: action.payload}

    default:
      return store;
  }
}
