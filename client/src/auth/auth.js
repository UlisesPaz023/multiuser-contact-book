import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const [isauth, setIsauth] = useState(false);
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [userId, setUserid] = useState("");
    const [isAdmin, setIsadmin] = useState(false);
    const navigate = useNavigate();
    const API_URL = 'http://localhost:5500/auth/';

    const resetUserData = () => {
            setIsauth(false);
            setName("");
            setCompany("");
            setAddress("");
            setPhone("");
            setPassword("");
            setEmail("");
            setUserid("");
            setIsadmin("");
    };

    useEffect(() => {
        const authStatus = async () => {
            try {
                const resp = await axios.get(`${API_URL}verify`, { withCredentials: true });

                if (resp.status === 200) { 
                    setIsauth(true);
                    setName(resp.data.name);
                    setCompany(resp.data.company);
                    setAddress(resp.data.address);
                    setPhone(resp.data.phone);
                    setPassword(resp.data.password);
                    setEmail(resp.data.email);
                    setUserid(resp.data.id);
                    setIsadmin(resp.data.admin);
                    console.log(resp.data);
                } else {
                    resetUserData();
                }
            } catch (error) {
                console.error(error);
                resetUserData();
            }
        };

        authStatus();

    }, [navigate]);

    const logout = async () => {
          try {
             const resp = await axios.get(`${API_URL}logout`, {withCredentials: true} );
             if (resp.status === 200) {
                resetUserData();
                return true;
            } else {
                return false;
             }
          } catch (error) {
            console.log(error);
            resetUserData();
            return false;
          }
    };

    return {
        isauth,
        name, 
        company, 
        address, 
        email, 
        password,
        phone,
        setEmail,
        setName,
        setAddress,
        setPassword,
        setCompany,
        setPhone,
        userId,
        isAdmin,
        logout
    };
};

export default useAuth;
