import useGlobalReducer from "../hooks/useGlobalReducer";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  //Función que se activa al dar clic en el botón
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

  const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok){
    alert("¡Usuario creado con éxito! Redirigiendo al login...")
    navigate("/signup");
  }else{
    const data = await response.json();
    alert(data.message) || "Erorr al registrarse";
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
            onChange={(e)=>setemail(e.target.value)}
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
            onChange={(e)=>setpassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};history

export default Signup;
