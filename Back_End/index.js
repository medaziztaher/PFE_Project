const express = require("express")
const user = require("./routers/user")
const medicament = require("./routers/medicament")
const question = require("./routers/question")
const reponse = require("./routers/reponse")


const cors = require("cors")
var server = express()
var port = 5002
server.use(express.json())
server.use(cors("*"))
require("./Connexion/connexion")
server.use(user)
server.use(medicament)
server.use(question)
server.use(reponse)

server.listen(port, () => {  console.log(`server is running on : ${port}`)})