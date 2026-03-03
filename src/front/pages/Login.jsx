import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";

const Login = () => {

    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: "login", payload: data.token })
                alert("Token almacenado con exito")
                navigate("/profile") // Pa' profile 
            } else {
                alert(data.msg || "Credenciales incorrectas")
            }
        }
        catch (error) {
            alert("No se pudo conectar con el servidor. Revisa si el backend está corriendo.", error);

        }
    }


    return (
        <div className='container mt-5'>
            <form onSubmit={handleLogin}>
                <input className='form-control mb-2' type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className='form-control mb-2' type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="btn btn-success w-100">Entrar</button>
            </form>
        </div>
    )
}

export default Login