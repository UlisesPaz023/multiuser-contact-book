import { useEffect, useState } from "react";
import Card from "../Components/Card";
import axios from "axios";

const Home = () => {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    const userData = async () => {
      try {
        const resp = await axios.get("http://localhost:5500/users/get-contacts", { withCredentials: true });
        setContacts(resp.data.respuesta);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Recurso no Encontrado");
        } else {
          console.log("Error al traer contactos");
        }
      }
    };
    
    userData();
  }, []);

  return (
    <section className="container py-5 px-0">
      <h2>TODOS LOS CONTACTOS</h2>
      <hr />
      <div>
        {/* Renderizado condicional de los contactos. */}
        {
          contacts.length === 0 ? (
            <p>No hay contactos para mostrar</p>
          ) : (
            contacts.map(contact => (
              <Card
                key={contact._id} 
                name={contact.name} 
                company={contact.company} 
                owner={contact.owner} 
                email={contact.email} 
                phone={contact.phone} 
                address={contact.address} 
                id = {contact.id}
                disabled = "d-none"
              />
            ))
          )
        };
      </div>
    </section>
  );
};

export default Home;
