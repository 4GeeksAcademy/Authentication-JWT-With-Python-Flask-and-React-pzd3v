import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  //Función que se activa al dar clic en el botón
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("3. Estatus de respuesta:", response.status);

      const data = await response.json();

      if (response.ok) {
        alert("¡Usuario creado con éxito!");
        navigate("/login"); // Cambié /signup por /login para que tenga sentido
      } else {
        // Usamos console.log para ver qué mandó el back realmente
        console.log("4. Error del backend:", data);
        alert(data.msg || data.message || "Error al registrarse");
      }
    } catch (error) {
      console.error("5. ERROR DE CONEXIÓN:", error);
      alert("No se pudo conectar con el servidor. Revisa si el backend está corriendo.");
    }
  };

  return (
    <div className="container border border-dark my-5 p-5 rounded">
      <form onSubmit={handleSubmit}> {/* Conectamos la función al formulario */}
        <div className="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group my-2">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}; history

export default Signup;
