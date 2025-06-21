// Importar frameworks necesarios para ejecutar la app

const express = require('express'); //SW
const mongoose = require('mongoose'); //mongoDB
const bodyParser = require('body-parser'); //json
const cors = require('cors'); //permitir solicitudes
const bcrypt = require('bcrypt'); //incriptar contraseñas

//Crear una instancia de la app express 
const app = express();
//Definir el puerto donde se ejecutará el servidor
const PORT =3000;

//habilitar cors para permitir peticiones
app.use(cors());
//sentencia que permite a express entienda el formato json
app.use(bodyParser.json());

//detectar archivos estaticos de la carpeta public
app.use(express.static('public'));

//conexion a mongoDB
mongoose.connect('mongodb://localhost:27017/gestion_de_agua',{ 
    useNewUrlParser: true, //usa el parser del url
    useUnifiedTopology: true //motor de monitoreo 
})

//si la conexion es exitosa , muestra mensaje 
.then(() => console.log('Conexión exitosa a MongoDB'))
//si hay un error en la conexion, muestra mensaje
.catch(err => console.error(err));

//esquemas y modelos 

//define el esquema para los usuarios 
const UsuarioSchema=new mongoose.Schema({
    nombre:String,
    email:String,
    password:String
});
//Crear el modelo usuario basado en el esquema anterior 
const Usuario=mongoose.model('Usuario', UsuarioSchema);

//Definir esquema de vehiculos
const VehiculoSchema =new mongoose.Schema({
    modelo:String,
    capacidad:String
});
const Vehiculo= mongoose.model('Vehiculo', VehiculoSchema);

//Definir esquema de empleados
const EmpleadoSchema = new mongoose.Schema({
    nombre:String,
    rol:String
});
 const Empleado = mongoose.model('Empleado', EmpleadoSchema);

 //Definir esquema cliente
const ClienteSchema = new mongoose.Schema({
    nombre:String,
    apellido:String
});
const Cliente = mongoose.model('Cliente', ClienteSchema);
 //Definir esquema Distribuidor
const DistribuidorSchema = new mongoose.Schema({
    nombre:String,
    apellido:String
});
const Distribuidor = mongoose.model('Distribuidor', DistribuidorSchema);

 //Definir esquema cliente
const AguaSchema = new mongoose.Schema({
    litros:String,
    fecha:String
});
const Agua = mongoose.model('Agua', AguaSchema);
//Rutas de autenticación
app.post ('/registro', async(req, res)=>{
    //extrae el email y el password}
    const{nombre,email,password}=req.body;
    //Encripta la contraseña
    const hashedPassword=await bcrypt.hash(password,10);
    //Crea un nuevo usuario con datos recibidos
    const nuevoUsuario=new Usuario({nombre,email,password:hashedPassword});
    //Guarda el usuario en la base
    await nuevoUsuario.save();
    //Responde con un mensaje de exito
    res.status(201).send('Usuario registrado ');
});

//ruta para iniciar sesión
app.post('/login', async(req, res)=>{
    //extrae el email y el password del cuerpo de la solicitud 
    const {email, password} = req.body; 
    //Busca el usuario por el email dado
    const usuario = await Usuario.findOne({email});
    //si no existe el usuario, responde con un error
    if(!usuario)return res.status(401).send('Usuario no encontrado');
    //Compara la contraseña proporcionada 
    const valid = await bcrypt.compare(password, usuario.password);
    //si la contraseña no es valida responde con error 401 
    if(!valid)return res.status(401).send('Contraseña incorrecta');
    //si todo es correcto, responde con un mensaje de exito
    res.send('Bienvenido ' + usuario.nombre);
});

//ruta para todos los registros de agua
app.get('/api/agua_recibida', async (req, res) => {
    //busca todos los vehiculo en la base de datos
    const agua = await Agua.find();
    //devuelve la lista de vehiculo en formato JSON
    res.json(agua);
});

//Crear un nuevo vehiculo
app.post('/api/agua_recibida', async (req, res) => {
    //Crea un nuevo vehiculo
    const nuevo = new Agua(req.body);
    //Guarda el vehiculo en la base de datos
    await nuevo.save();
    //Responde con un mensaje de éxito
    res.status(201).send('agua creado');
});

//Eliminar el vehiculo por id
app.delete('/api/agua_recibida/:id', async (req, res) => {
    //elimina el vehiculo por id
    await Agua.findByIdAndDelete(req.params.id);
    //responde con un mensaje de éxito
    res.send('agua eliminado');
});
//CRUD de Vehiculo
//ruta para todos los vehiculo
app.get('/api/vehiculos', async (req, res) => {
    //busca todos los vehiculo en la base de datos
    const vehiculos = await Vehiculo.find();
    //devuelve la lista de vehiculo en formato JSON
    res.json(vehiculos);
});

//Crear un nuevo vehiculo
app.post('/api/vehiculos', async (req, res) => {
    //Crea un nuevo vehiculo
    const nuevo = new Vehiculo(req.body);
    //Guarda el vehiculo en la base de datos
    await nuevo.save();
    //Responde con un mensaje de éxito
    res.status(201).send('Vehiculo creado');
});

//Eliminar el vehiculo por id
app.delete('/api/vehiculos/:id', async (req, res) => {
    //elimina el vehiculo por id
    await Vehiculo.findByIdAndDelete(req.params.id);
    //responde con un mensaje de éxito
    res.send('Vehiculo eliminado');
});

//CRUD de empleados
app.get('/api/empleados', async (req, res) => {
    //busca todos los empleados en la base de datos
    const empleados = await Empleado.find();
    //devuelve la lista de empleados en formato JSON
    res.json(empleados);
});

//Crear un nuevo empleado
app.post('/api/empleados', async (req, res) => {
    //Crea un nuevo empleado
    const nuevo = new Empleado(req.body);
    //Guarda el empleado en la base de datos
    await nuevo.save();
    //Responde con un mensaje de éxito
    res.status(201).send('Empleado creado');
});

//Eliminar el empleado por id
app.delete('/api/empleados/:id', async (req, res) => {
    //elimina el empleado por id
    await Empleado.findByIdAndDelete(req.params.id);
    //responde con un mensaje de éxito
    res.send('Empleado eliminado');
});


//Ruta para obtener todos los cliente
app.get('/api/clientes' , async(req, res) => { 
//Busca todos los cliente en la base de datos
const clientes=await Cliente.find();
//Devuelve la lista de cliente en formato JSON
res.json(clientes);    
});

//Ruta para crear un nuevo cliente
   app.post('/api/clientes', async (req,res)=> {
    //Crea un nuevo cliente  con los datos recibidos en la seleccion
   const nuevo =new Cliente (req.body);
   //guarda el cliente en la base de datos
   await nuevo.save();
   //responde con un mensaje de exito y codigo 201 (creado)
   res.status(201).send('Cliente creado');
});

//Eliminar el cliente por id
app.delete('/api/clientes/:id', async (req, res) => {
    //elimina el cliente por id
    await Cliente.findByIdAndDelete(req.params.id);
    //responde con un mensaje de éxito
    res.send('Cliente eliminado');
});




//Ruta para obtener todos los distribuidores
app.get('/api/distribuidores' , async(req, res) => { 
//Busca todos los distribuidores en la base de datos
const distribuidores=await Distribuidor.find();
//Devuelve la lista de distribuidores en formato JSON
res.json(distribuidores);    
});

//Ruta para crear un nuevo Distribuidor
   app.post('/api/distribuidores', async (req,res)=> {
    //Crea un nuevo distribuidor  con los datos recibidos en la seleccion
   const nuevo =new Distribuidor (req.body);
   //guarda el distribuidor en la base de datos
   await nuevo.save();
   //responde con un mensaje de exito y codigo 201 (creado)
   res.status(201).send('distribuidor creado');
});

//Eliminar el Distribuidor por id
app.delete('/api/distribuidores/:id', async (req, res) => {
    //elimina el Distribuidor por id
    await Distribuidor.findByIdAndDelete(req.params.id);
    //responde con un mensaje de éxito
    res.send('Distribuidor eliminado');
});


//Iniciar servidor 

//Inicia el servidor y lo pone a eschucar en el puerto definido
app.listen(PORT, () => {
    // Muestra en consola la URL esta corriendo el servidor
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
} );