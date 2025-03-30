const express = require('express');    
require('../server/connection/connect');        
const user = require('./models/model');  
const app = express();
const coockie = require('cookie-parser');
const morgan = require('morgan');     
const jwt = require('jsonwebtoken');
const cors = require('cors');

const userRoutes = express.Router();
const authRoutes = express.Router();

app.use(express.json());
app.use(coockie());
app.use(morgan('dev'));
app.use(cors({
    origin : ['http://localhost:5173'] , credentials : true
}));

app.use('/users', userRoutes);
app.use('/auth' , authRoutes);

userRoutes.get('/get-users', async (req, res) => {
    const resp = await user.find({});
    return res.status(200).json({resp, message: 'Usuarios obtenidos correctamente'});
});

userRoutes.post('/create-users', async (req , res) => {
    try {
        const usuariosData = req.body;
        const {email}  = req.body;
        const usuario = await user.findOne({email});
        if(usuario){
            return res.status(401).json('email existente');
        };
        usuariosData.is_public = false;

        const nuevoUser = new user(usuariosData);
        const resp = await nuevoUser.save();
        return res.status(201).json({resp, message: 'Registrado exitosamente'} );
    } catch (error) {
        console.log(error);
    };
});

userRoutes.patch('/edit-users/:id' , async (req , res) => {
    try {
        const {id} = req.params;
        const usuariosData = req.body;
        const resp = await user.findByIdAndUpdate(id , usuariosData , {new : true});

        if(!resp){
            return res.status(404).json({resp , message: 'Recursos no encontrados'});
        };

        return res.status(200).json({resp, message: 'Usuario modificado'} );
    } catch (error) {
        console.log(error);
    };
});


userRoutes.delete('/delete-users/:id' , async (req, res) => {
    try {
        const {id} = req.params;
        const resp = await user.findByIdAndDelete(id);
        if(!resp){
            return res.status(404).json({resp , message : 'Usuario no encontrado'});
        };
        return res.status(200).json({resp , message : 'Eliminamos datos'});
    } catch (error) {
        console.log(error);
    };
});


authRoutes.post('/login-users' , async (req , res) => {
   try {
    const {email , password} = req.body;
    const usuario = await user.findOne({email});
    if(!usuario){
        return res.status(401).json({usuario , message : 'Email o contraseña incorrectos'});
    };
    if(password !== usuario.password){
        return res.status(401).json({usuario , message : 'Contraseña Incorrecta'});
    };

     const token = jwt.sign(
     {id: usuario._id  , 
      id: String(usuario._id),
      email: String(usuario.email),
      password: String(usuario.password), 
      name: String(usuario.name || ''),
      phone: String(usuario.phone || ''),
      company: String(usuario.company || ''),
      address: String(usuario.address || ''),
      admin: Boolean(usuario.admin)},
        'hola123' , {expiresIn : '1h'});
     res.cookie('llave', token , {httpOnly : true , maxAge : 36000000, sameSite: "lax" , secure: false} );

    return res.status(200).json({message: 'Has iniciado sesión correctamente' , token});

   } catch (error) {
     console.log(error);
   };
});

const  verificarUsuario = (req , res , next) => {
      const token = req.cookies.llave;
      if(!token){
         return res.status(404).json({message: 'No se encontro el token', token});
      };
      
      try {
        const decode = jwt.verify(token , 'hola123');
        req.usuario = decode;
        next();
      } catch (error) {
        return res.status(403).json({message: 'Token Invalido', token});
      };
};

authRoutes.get('/verify' , verificarUsuario , async (req , res) => {
      const {id , name , company , phone , email , password , address , admin} = req.usuario;
      return res.status(200).json({message: 'Se obtuvieron los datos',id , name , company , phone , email , password , address , admin});
});

authRoutes.get('/logout' , verificarUsuario ,  async (req , res) => {
       res.clearCookie('llave');
       return res.status(200).json({message: 'Se elimino el token correctamente'});
});

userRoutes.post('/create-contact' , verificarUsuario, async (req , res) => {
       try {
          const contactosData = req.body;
          const {email} = req.body;
          const contacto = await user.findOne({email});
          console.log(contactosData);
          
          if(contacto){

            return res.status(401).json({message: 'Email existente'});
          };

          if(req.usuario && req.usuario.name){
            contactosData.owner = req.usuario.name;

          }else{
            contactosData.owner = 'admin';
          };
            const newContact = new user(contactosData);
            const respuesta = await newContact.save();

            return res.status(201).json({message: 'Contacto creado con exito' , respuesta});

       } catch (error) {
          return res.status(500).json(error.message);
       };
});

userRoutes.get('/get-contacts' , async(req , res) => {
     try {
        const respuesta = await user.find({password: '' , is_visible: true}).sort({ name: 1 });
        console.log(respuesta);
        
        if (respuesta.length === 0) {
            return res.status(404).json({message: 'No hay contactos para mostrar'});
        };

        return res.status(200).json({message: 'Contactos obtenidos con exito', respuesta});
     } catch (error) {
        return res.status(500).json(error.message)
     };
});

userRoutes.get('/get-contacts-by-role', verificarUsuario, async (req, res) => {
    try {
      const isAdmin = req.usuario.admin;
        console.log(isAdmin);
      let contactos;
      if (isAdmin) {
        contactos = await user.find({ password: '' });
      } else {
        const namesUserLog = req.usuario.name;
        contactos = await user.find({ owner: namesUserLog });
      };
  
      if (contactos.length === 0) {
        return res.status(404).json({ message: 'No hay contactos creados', contactos });
      };
  
      return res.status(200).json(contactos);
    } catch (error) {
      return res.status(500).json(error.message);
    };
  });

app.listen(5500, () => {
    console.log('App corriendo en server', app);
});
