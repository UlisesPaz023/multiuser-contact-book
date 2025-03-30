import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {

    const [ name , setName] = useState();
    const [ company , setCompany] = useState();
    const [ address , setAddress ] = useState();
    const [ phone , setPhone ] = useState();
    const [ password  , setPassword] = useState();
    const [ email , setEmail] = useState();
    const navigate = useNavigate();

    const sendForm = async(evento) => {
          evento.preventDefault();
          try {
            await axios.post('http://localhost:5500/users/create-users' , {name , company , address , phone , password , email})
            alert('Su registro a sido exitoso')
            navigate("/login")
          } catch (error) {
            alert('Su registro no se pudo completar')
            console.log(error);
          }
    };
     
    return (
        <section className="container py-5">
            <h2 className="text-center">REGISTRAR</h2>
            <hr />
            <form className="row justify-content-center" onSubmit={sendForm}>
                <div className="mb-3 p-0 col-7">
                    <input type="text" className="w-100" placeholder="Nombre" onChange= { (evento) => setName( evento.target.value)} value = {name}/>
                </div>
                <div className="mb-3 p-0 col-7">
                    <input type="text" className="w-100" placeholder="Correo Electrónico" onChange= { (evento) => setEmail( evento.target.value)} value = {email}/>
                </div>
                <div className="mb-3 p-0 col-7">
                    <input type="text" className="w-100" placeholder="Empresa" onChange= { (evento) => setCompany( evento.target.value)} value = {company} />
                </div>
                <div className="mb-3 p-0 col-7">
                    <input type="text" className="w-100" placeholder="Dirección" onChange= { (evento) => setAddress( evento.target.value)} value = {address}/>
                </div>
                <div className="mb-3 p-0 col-7">
                    <input type="text" className="w-100" placeholder="Teléfono" onChange= { (evento) => setPhone( evento.target.value)} value = {phone}/>
                </div>
                <div className="mb-3 p-0 col-7">
                    <input type="password" className="w-100" placeholder="Contraseña" onChange= { (evento) => setPassword( evento.target.value)} value = {password} />
                </div>
                <button type="submit" className="col-7 bg-dark fw-bold btn btn-primary"> ENVIAR </button>
                <p className="text-center mt-2">¿Ya tienes una cuenta? Entonces, <Link to="/login">INGRESÁ</Link></p>
            </form>
        </section>
    );
};


export default Register;