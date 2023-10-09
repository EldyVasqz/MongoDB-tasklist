
const { MongoClient } = require("mongodb");
const express = require("express");

require("dotenv").config();
const uri =process.env.uri
const client = new MongoClient(uri, { useNewUrlParser: true });

const jwt = require("jsonwebtoken");
//se importa de Mongo db para consultar por ID
const { ObjectId } = require("mongodb");




const authMiddleware = (req, res, next) => {
    const headerToken = req.headers.authorization;
    console.log("Token",headerToken)
    if(!headerToken){
        return res.status(404).send("No se tiene un Token")
    }
    try {
        const decoded = jwt.verify(headerToken, process.env.SECRET_KEY);
        console.log("---->", decoded)
        req.user = decoded 
        next()
    } catch (error){
        res.status(400).send("Token no valido")
    }
}; 


const validarMetodo = (req, res, next) => { 
    const metodo = req.method
    console.log (metodo)
    if((metodo!="POST")&&(metodo!="GET")&&(metodo!="PUT")&&((metodo!="DELETE"))){ 
        return res.status(404).send({mensaje:"Metodo no admitido"})
    }
    next() 
};



 



//Cree un middleware a nivel de aplicacion para gestionar que solo lleguen solicitudes HTTP validos de lo contrario que devuelva un error
const validarTarea = async(req, res, next)=> {
  
    const idTarea = req.params.id;
    try{
       
        await client.connect();
        const db = client.db("ListaTareas");
        const collection = db.collection("Tareas");
       await collection.findOne({ _id: new ObjectId(idTarea) });
       next();
        }
        catch(error){
            console.log("Tarea no encontrada")
        }
};

//Cree un middleware que:
const validarErrores = (req, res, next) => {
    const tarea = req.body
    console.log(tarea)
    const metodo = req.method
    console.log(Object.keys(tarea).length)
    
    //1. Maneje solicitudes POST con cuerpo vacio y que no tengan informacion valida o atributos faltantes.  
    if (metodo==="POST") {
        if(!tarea){
            return res.status(404).send({mensaje:"Tarea no valida"})
        }
        if (Object.keys(tarea).length===0){
            return res.status(400).send({mensaje:"Tarea vacia"})
        }
        if (Object.keys(tarea).length<3){
            return res.status(404).send({mensaje:"Faltan atributos"})
        }
    
        next()  
    };
    
    //2. Maneje solicitudes PUT con cuerpo vacio y que no tengan informacion valida o atributos faltantes. 
    if (metodo==="PUT") {
        if(!tarea){
            return res.status(404).send({mensaje:"Tarea no valida"})
        }
        if (Object.keys(tarea).length===0){
            return res.status(400).send({mensaje:"Tarea vacia"})
        }
       
        next()
    };
    };
module.exports={authMiddleware, validarMetodo, validarTarea, validarErrores}