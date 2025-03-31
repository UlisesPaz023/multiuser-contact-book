import express from "express";
import "../server/connection/connect"; // Si solo importa el archivo, no necesita asignarse a una variable
import User from "./models/model";
import cookie from "cookie-parser";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import { JwtPayload} from "jsonwebtoken";
const app = express();

declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayload | string;
    }
  }
};

const userRoutes = express.Router();
const authRoutes = express.Router();

app.use(express.json());
app.use(cookie());
app.use(morgan('dev'));
app.use(cors({
    origin : ['http://localhost:5173'] , credentials : true
}));

app.use('/users', userRoutes);
app.use('/auth' , authRoutes);

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

userRoutes.get('/get-users', asyncHandler(async (req: Request, res: Response) => {
  const resp = await User.find({});
  return res.status(200).json({ resp, message: 'Usuarios obtenidos correctamente' });
}));

userRoutes.post('/create-users', asyncHandler( async(req: Request, res: Response) => {
    try {
        const userData = req.body;
        const {email}  = req.body;
        const usuario = await User.findOne({email});
        if(usuario){
            return res.status(401).json('email existente');
        };
        userData.is_public = false;

        const nuevoUser = new User(userData);
        const resp = await nuevoUser.save();
        return res.status(201).json({resp, message: 'Registrado exitosamente'} );
    } catch (error) {
        console.log(error);
    };
}));

userRoutes.patch('/edit-users/:id' , asyncHandler( async(req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const userData = req.body;
        const resp = await User.findByIdAndUpdate(id , userData , {new : true});

        if(!resp){
            return res.status(404).json({resp , message: 'Recursos no encontrados'});
        };

        return res.status(200).json({resp, message: 'Usuario modificado'} );
    } catch (error) {
        console.log(error);
    };
}));


userRoutes.delete('/delete-users/:id', asyncHandler( async(req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const resp = await User.findByIdAndDelete(id);
        if(!resp){
            return res.status(404).json({resp , message : 'Usuario no encontrado'});
        };
        return res.status(200).json({resp , message : 'Eliminamos datos'});
    } catch (error) {
        console.log(error);
    };
}));


authRoutes.post('/login-users' , asyncHandler( async(req: Request, res: Response) => {
   try {
    const {email , password}: {email: string, password: string} = req.body;
    const usuario = await User.findOne({email});
    if(!usuario){
        return res.status(401).json({usuario , message : 'Email o contraseña incorrectos'});
    };
    if(password !== usuario.password){
        return res.status(401).json({usuario , message : 'Contraseña Incorrecta'});
    };

     const token = jwt.sign(
     {
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
}));

const verifyUser = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.llave;
  if (!token) {
    return next(res.status(404).json({ message: 'No se encontró el token', token }));
  }

  try {
    const decode = jwt.verify(token, 'hola123') as jwt.JwtPayload;
    req.usuario = decode; // Asigna el token decodificado a req.usuario
    next(); // Continúa con el siguiente middleware
  } catch (error) {
    return next(res.status(403).json({ message: 'Token inválido', token }));
  }
};

authRoutes.get('/verify' , verifyUser , asyncHandler( async(req: Request, res: Response) => {
      const {id , name , company , phone , email , password , address , admin} = req.usuario as jwt.JwtPayload;
      return res.status(200).json({message: 'Se obtuvieron los datos',id , name , company , phone , email , password , address , admin});
}));

authRoutes.get('/logout' , verifyUser , asyncHandler( async(req: Request, res: Response) => {
       res.clearCookie('llave');
       return res.status(200).json({message: 'Se elimino el token correctamente'});
}));

userRoutes.post('/create-contact' , verifyUser, asyncHandler( async(req: Request, res: Response) => {
       try {
          const contactData = req.body;
          const {email} = req.body;
          const contacto = await User.findOne({email});
          console.log(contactData);
          
          if(contacto){

            return res.status(401).json({message: 'Email existente'});
          };

          if (req.usuario && typeof req.usuario !== 'string' && req.usuario.name) {
            contactData.owner = req.usuario.name;
          } else {
            contactData.owner = 'admin';
          };
            const newContact = new User(contactData);
            const respuesta = await newContact.save();

            return res.status(201).json({message: 'Contacto creado con exito' , respuesta});

       } catch (error) {
          if (error instanceof Error) {
            return res.status(500).json(error.message);
          } else {
            return res.status(500).json("Ocurrió un error desconocido");
          };
       };
}));

userRoutes.get('/get-contacts' , asyncHandler( async(req: Request, res: Response) => {
     try {
        const respuesta = await User.find({password: '' , is_visible: true}).sort({ name: 1 });
        console.log(respuesta);
        
        if (respuesta.length === 0) {
            return res.status(404).json({message: 'No hay contactos para mostrar'});
        };

        return res.status(200).json({message: 'Contactos obtenidos con exito', respuesta});
     } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json(error.message);
      } else {
        return res.status(500).json("Ocurrió un error desconocido");
      };
     };
}));

userRoutes.get('/get-contacts-by-role', verifyUser, asyncHandler( async(req: Request, res: Response) => {
    try {
      const isAdmin = (req.usuario as JwtPayload).admin;
        console.log(isAdmin);
      let contactos;
      if (isAdmin) {
        contactos = await User.find({ password: '' });
      } else {
        const namesUserLog = (req.usuario as JwtPayload).name;
        contactos = await User.find({ owner: namesUserLog });
      };
  
      if (contactos.length === 0) {
        return res.status(404).json({ message: 'No hay contactos creados', contactos });
      };
  
      return res.status(200).json(contactos);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json(error.message);
      } else {
        return res.status(500).json("Ocurrió un error desconocido");
      }
    };
  }));

app.listen(5500, () => {
    console.log('App corriendo en server', app);
});
