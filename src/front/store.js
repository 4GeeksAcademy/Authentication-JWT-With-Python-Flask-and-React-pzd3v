export const initialStore=()=>{
  return{
    message: null,
    token: null // <--- LÍNEA NUEVA: Aquí guardaremos el "pasaporte"
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'save_token':
      return {
        ...store,
        token: action.payload
      };

    default:
      throw Error('Unknown action.');
  }    
}
