
const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
const uri =process.env.uri
const client = new MongoClient(uri, { useNewUrlParser: true });
const router = express.Router();
const jwt = require("jsonwebtoken");
//se importa de Mongo db para consultar por ID
const { ObjectId } = require("mongodb");

router.use(express.json());
const {validarMetodo, validarTarea, validarErrores }=require("./middlewares/middlewares")

router.use(validarMetodo);

//Cree una solitud POST a una ruta especifica para crear tareas
router.post('/', validarErrores, async(req, res) => {
    const nuevaTarea=req.body;
    try{
    await client.connect();
    const db = client.db("ListaTareas");
    const collection = db.collection("Tareas");
    const document = await collection.insertOne(nuevaTarea);
    res.send(document);
}catch(error){
    console.log(error)
}
});

//Cree una solicitud POST para el proceso de autenticacion
router.post('/login', (req, res) => {
    const userName = req.body.user; 
    const passUser = req.body.pass;
    try{
    if(userName === "Arely" && passUser === "1234"){
        const payload = {
            rol: "admin",
            user: "user",
            name: "Arely"
        }    
        const token = jwt.sign(payload, process.env.SECRET_KEY);
        res.status(200).send({mensaje:"Bienvenido a la aplicacion", token})
    } else {
        res.status(400).send("Credenciales incorrectas")
    }
}catch(error){
    console.log(error)
}

}); 


//Cree una solitud DELETE a una ruta especifica para eliminar tareas
router.delete('/:id', validarTarea, async(req, res) => {
    const idEliminar=req.params.id
    try{
    await client.connect();
    const db = client.db("ListaTareas");
    const collection = db.collection("Tareas");
    await collection.deleteOne({ _id: new ObjectId(idEliminar)});
 
       res.status(201).json({mensaje:'Tarea Eliminada'})
    }catch(error){
        console.log(error)
    }
})

//Cree una solitud PUT a una ruta especifica para editar o actualizar tareas
router.put('/:id', validarErrores, validarMetodo, async (req, res) => {
    const idUpdate=req.params.id
    const newTask=req.body
    console.log("id",idUpdate)
    console.log("tarea nueva",newTask)
    try{
    await client.connect();
    const db = client.db("ListaTareas");
    await db.collection("Tareas").updateOne({ _id: new ObjectId(idUpdate) }, { $set: { ...newTask } });
    res.status(201).json({mensaje:'Tarea Actualizada'})
    }catch(error){
        console.log(error)
    }
    })


module.exports=router;  

