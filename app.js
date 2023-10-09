const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const uri =process.env.uri

const client = new MongoClient(uri, { useNewUrlParser: true });


const vista = require("./list-view-router");
const editar = require("./list-edit-router");

app.get("/", function (req, res) {
  res.send("Bienvenido a Mi Lista de Tareas");
});

app.use("/api/tareas", vista);
app.use("/api/tareas", editar);

app.listen(process.env.port, () => {
  console.log(`La app está escuchando en el puerto ${process.env.port}`);
});
