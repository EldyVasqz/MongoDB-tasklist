const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
const uri =process.env.uri
const client = new MongoClient(uri, { useNewUrlParser: true });
const router = express.Router();

//se importa de Mongo db para consultar por ID
const { ObjectId } = require("mongodb");

router.use(express.json());

const {authMiddleware}=require("./middlewares/middlewares")


router.get("/rutaAdmin", 
authMiddleware, (req, res)=>{
    res.send({mensaje:"Bienvenido administrador", user : req.user})
});

//Cree un middleware para gestionar los parametros y si no que devuelva un error
const validarPagina = (req, res, next) => {
    const metodo=req.method
    if(metodo==="GET")
    { const pagina = req.originalUrl
       
        if(pagina!="/tareas" && pagina!="/tareas/completas" && pagina!="/tareas/incompletas" && pagina!="/tareas/rutaAdmin" && pagina!=paginaParms){
            res.status(404).send({mensaje:"Pagina no encontrada"})
        }} 
   
    next()

}

//router.use (validarPagina)

router.use(express.json());

router.get('/',async (req, res) => {
    try{
    await client.connect();
  const db = client.db("ListaTareas");
  const collection = db.collection("Tareas");
  const document = await collection.find({}).toArray();
  res.send(document);
}
catch(error){
    console.log(error)
}
  });

  //Cree una solicitud GET a una ruta especifica para tareas completas
router.get('/completas',async(req, res) => {
    try{
    await client.connect();
    const db = client.db("ListaTareas");
    const collection = db.collection("Tareas");
    const document = await collection.find({isCompleted:true}).toArray()
    res.send(document);
}
catch(error){
    console.log(error)
}
});

 //Cree una solicitud GET a una ruta especifica para tareas incompletas
router.get('/incompletas', async(req, res) => {
    try{
    await client.connect();
    const db = client.db("ListaTareas");
    const collection = db.collection("Tareas");
    const document = await collection.find({isCompleted:false}).toArray()
    res.send(document);
}
catch(error){
    console.log(error)
}
});

router.get('/:id', async(req, res) => {
    try{
    const idTarea = req.params.id;
    await client.connect();
    const db = client.db("ListaTareas");
    const collection = db.collection("Tareas");
    const document = await collection.findOne({ _id: new ObjectId(idTarea) });
    res.send(document);
    }
    catch(error){
        console.log(error)
    }
});  


module.exports=router; 

