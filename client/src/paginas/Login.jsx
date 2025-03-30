import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const sendForm = async (evento) => {
        evento.preventDefault();
        
        try {
            await axios.post('http://localhost:5500/auth/login-users', { password, email }, { withCredentials: true });
            alert('Su login ha sido exitoso');
            navigate('/');
        } catch (error) {
            alert('Error, no se pudo completar su login');
            console.log(error);
        }
    };

    return (
        <section className="container py-5">
                <h2 className="text-center">INICIO DE SESIÓN</h2>
                <hr />
                <form className="row justify-content-center col " onSubmit={sendForm}>
                    <div className="p-0 mb-3 col-7">
                        <input 
                            type="text" 
                            className="w-100" 
                            placeholder="Correo Electrónico" 
                            onChange={(evento) => setEmail(evento.target.value)} 
                            value={email} 
                        />
                    </div>
                    <div className="p-0 mb-3 col-7">
                        <input 
                            type="password" 
                            className="w-100" 
                            placeholder="Contraseña" 
                            onChange={(evento) => setPassword(evento.target.value)} 
                            value={password} 
                        />
                    </div>
                    <button type="submit" className="col-7 btn btn-primary bg-dark fw-bold">ENVIAR</button>
                    <p className="text-center mt-2" > ¿No tienes tienes una cuenta? Entonces,  <Link to="/registro">REGISTRATE</Link></p>
                </form>
        </section>
    );
};

export default Login;
