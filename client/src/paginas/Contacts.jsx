import axios from "axios";
import { useState, useEffect } from "react";
import Card from "../Components/Card";
import useAuth from "../auth/auth";

const Contact = () => {
  const [name, setName] = useState();
  const [company, setCompany] = useState();
  const [address, setAddress] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const API_URL = 'http://localhost:5500/users/';


  const sendForm = async (evento) => {
    evento.preventDefault();
    try {
      const resp = await axios.post(
        `${API_URL}create-contact`,
        { name, company, address, phone, email }
      );
      alert("Contacto creado correctamente.");
      if (resp.data.respuesta) {
        setContacts((prevContacts) => [...prevContacts, resp.data.respuesta]);
      }
      setName("");
      setCompany("");
      setAddress("");
      setPhone("");
      setEmail("");
    } catch (error) {
      alert("No se pudo crear el contacto.");
      console.log(error);
    }
  };

  const contactVisibility = async (id, newVisibility) => {
    try {
      await axios.patch( `${API_URL}edit-users/${id}`, {
        is_visible: newVisibility,
      });
      setContacts(
        contacts.map((contact) =>
          contact._id === id
            ? {
                ...contact,
                is_visible: newVisibility,
              }
            : contact
        )
      );
    } catch (error) {
      console.log("Error al actualizar la visibilidad", error);
    }
  };

  const contactPrivacity = async (id, newPrivacity) => {
    try {
      await axios.patch(`${API_URL}edit-users/${id}`, {
        is_public: newPrivacity,
      });
      setContacts(
        contacts.map((contact) =>
          contact._id === id
            ? {
                ...contact,
                is_public: newPrivacity,
              }
            : contact
        )
      );
    } catch (error) {
      console.log("Error al actualizar la visibilidad", error);
    }
  };

  const editContact = (
    id,
    newName,
    newCompany,
    newAddress,
    newPhone,
    newEmail,
    newOwner
  ) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact._id === id
          ? {
              ...contact,
              name: newName,
              company: newCompany,
              address: newAddress,
              phone: newPhone,
              email: newEmail,
              owner: newOwner,
            }
          : contact
      )
    );
  };
  
  const deleteContact = (id) => {
    setContacts(contacts.filter((contact) => contact._id !== id));
  };

  useEffect(() => {
    const getContacts = async () => {
      if (isAdmin === undefined) {
        setLoading(true);
        return;
      }
    
      try {
        const resp = await axios.get( `${API_URL}get-contacts-by-role`, { withCredentials: true });
        setContacts(resp.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Recurso no encontrado");
        } else {
          setError("Error al traer contactos");
        }
      }
    };
    
    if (isAdmin !== undefined) {
      getContacts();
    }
  }, [isAdmin]);
  
  return (
    <section className="container py-5">
      <h2 className=""> CREAR CONTACTO</h2>
      <hr />
      <form className="row w-100 justify-content-center mb-5" onSubmit={sendForm}>
        <div className="mb-3 p-0 col-7">
          <input
            type="text"
            className="w-100"
            placeholder="Correo Electrónico"
            onChange={(evento) => setEmail(evento.target.value)}
            value={email}
          />
        </div>
        <div className="mb-3 p-0 col-7">
          <input
            type="text"
            className="w-100"
            placeholder="Empresa"
            onChange={(evento) => setCompany(evento.target.value)}
            value={company}
          />
        </div>
        <div className="mb-3 p-0 col-7">
          <input
            type="text"
            className="w-100"
            placeholder="Nombre"
            onChange={(evento) => setName(evento.target.value)}
            value={name}
          />
        </div>
        <div className="mb-3 p-0 col-7">
          <input
            type="text"
            className="w-100"
            placeholder="Dirección"
            onChange={(evento) => setAddress(evento.target.value)}
            value={address}
          />
        </div>
        <div className="mb-3 p-0 col-7">
          <input
            type="text"
            className="w-100"
            placeholder="Teléfono"
            onChange={(evento) => setPhone(evento.target.value)}
            value={phone}
          />
        </div>

        <button type="submit" className="btn btn-primary col-7 fw-bold bg-dark">
          CREAR CONTACTO
        </button>
      </form>
      <h3>MIS CONTACTOS</h3>
      <hr />
      <div>
        {error ? (
          <p>{error}</p>
        ) : (
          contacts.map((contact) => (
            <Card
              key={contact._id}
              name={contact.name}
              company={contact.company}
              owner={contact.owner}
              email={contact.email}
              phone={contact.phone}
              address={contact.address}
              isPublic={contact.is_public}
              isVisible={contact.is_visible}
              id={contact._id}
              onDelete={deleteContact}
              onEdit={editContact}
              onVisible={contactVisibility}
              onPublic={contactPrivacity}
              disabled="d-block"
            />
          ))
        )};
      </div>
    </section>
  );
};

export default Contact;
