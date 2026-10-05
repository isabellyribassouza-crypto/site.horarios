const express = require('express')
const app = express()
const port = 3000
app.use(express.json())
const cors = require('cors')
app.use(cors())
const fs = require('fs')

const arquivoID = JSON.parse(fs.readFileSync("id.json", "utf8"))
let id = arquivoID.id

function atualizarID() {
    id = id + 1
    fs.writeFileSync("id.json", JSON.stringify({id: id}), "utf8")
}

// CADASTRO
app.post("/aula", (req, res) => {
    const aula = req.body
    try {
        const aulas = JSON.parse(fs.readFileSync("aulas.json", "utf8"))
        atualizarID()
        aula.id = id
        aulas.push(aula)
        fs.writeFileSync("aulas.json", JSON.stringify(aulas), "utf8")
        res.status(201).json({mensagem: "Aula cadastrada!"})
    } catch (error) {
        res.status(500).json({erro: error.message})
    }
})

// CONSULTAR POR DIA
app.get("/horario/:dia", (req, res) => {
    try {
        const aulas = JSON.parse(fs.readFileSync("aulas.json", "utf8"))
        const filtradas = aulas.filter(a => a.diaDaSemana == req.params.dia)
        res.json(filtradas)
    } catch (error) {
        res.status(500).json({erro: error.message})
    }
})

// EXCLUIR
app.delete("/aula/:id", (req, res) => {
    try {
        const aulas = JSON.parse(fs.readFileSync("aulas.json", "utf8"))
        const indice = aulas.findIndex(a => a.id == req.params.id)
        aulas.splice(indice, 1)
        fs.writeFileSync("aulas.json", JSON.stringify(aulas), "utf8")
        res.json({mensagem: "Aula excluída!"})
    } catch (error) {
        res.status(500).json({erro: error.message})
    }
})

app.listen(port, () => {
    console.log("API rodando da porta " + port)
})