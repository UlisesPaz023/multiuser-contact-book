import axios from "axios";
import { useNavigate } from 'react-router-dom';
import useAuth from "../auth/auth";


const UserLog = () => {
    const { userId, name, company, email, password, address, phone, setEmail, setName, setCompany, setPassword, setAddress, setPhone } = useAuth();
    const navigate = useNavigate();

    const sendForm = async (evento) => {
        evento.preventDefault();

        try {
            await axios.patch(`http://localhost:5500/users/edit-users/${userId}`, { name, company, email, password, address, phone });
            alert('Usuario Actualizado');
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const handlechange = (evento, campo) => {
        const valor = evento.target.value;
        switch (campo) {
            case "email":
                setEmail(valor);
                break;
            case "company":
                setCompany(valor);
                break;
            case "address":
                setAddress(valor);
                break;
            case "password":
                setPassword(valor);
                break;
            case "phone":
                setPhone(valor);
                break;
            case "name":
                setName(valor);
                break;

            default:
                break;
        }
    };

    return (
        <section className="container py-5">
            <h2 className="text-center">EDITÁ TU PERFIL</h2>
            <hr/>
            <form className="row justify-content-center" onSubmit={sendForm}>
                <div className="mb-3 p-0 col-7">
                    <input type="text" className="w-100" placeholder="email electronico" onChange={(evento) => handlechange(evento , 'email')} value={email} />
                </div>
                <div className="mb-3 p-0 col-7">
                    <input type="text" className="w-100" placeholder="company" onChange={(evento) => handlechange(evento , 'company')} value={company} />
                </div>
                <div className="mb-3 p-0 col-7">
                    <input type="text" className="w-100" placeholder="name" onChange={(evento) => handlechange(evento , 'name')} value={name} />
                </div>
                <div className="mb-3 p-0 col-7">
                    <input type="text" className="w-100" placeholder="Dirección" onChange={(evento) => handlechange(evento , 'address')} value={address} />
                </div>
                <div className="mb-3 p-0 col-7">
                    <input type="text" className="w-100" placeholder="phone" onChange={(evento) => handlechange(evento , 'phone')} value={phone} />
                </div>
                <div className="mb-3 p-0 col-7">
                    <input type="password" className="w-100" placeholder="Contraseña" onChange={(evento) => handlechange(evento , 'password')} value={password} />
                </div>
                <button type="submit" className="btn btn-primary col-7 bg-dark fw-bold">ENVIAR</button>
            </form>
        </section>
    );
};

export default UserLog;