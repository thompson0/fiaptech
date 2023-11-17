const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/server', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, require: true},
    senha: { type: String, require: true},
    email: { type: String, required: true}
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

const produtoSchema = new mongoose.Schema({
    Codigo: { type: String, required: true },
    Descricao: { type: String },
    Fornecedor: { type: String },
    DataFabricacao: { type: Date },
    QtEstoque: { type: Number },
});

const Produto = mongoose.model("Produto", produtoSchema);

 
    app.post("/login", async(req, res)=>{
        const nome  = req.body.nome;
        const senha = req.body.senha;
        const email = req.body.email;

    const novoUsuario = new Usuario({ 
        nome :nome,
        senha:senha,
        email:email
    });
    if (senha == "" || email == ""|| nome == "") {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const emailExistente = await Usuario.findOne({ email: email });

    if (emailExistente) {
        return res.status(400).json({ error: "O email cadastrado já existe" });
    }

    try {
        const usuarioSalvo = await novoUsuario.save();
        res.json({ error: null, msg: "Cadastro de usuário realizado com sucesso", UsuarioId: usuarioSalvo._id });
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.post("/produto", async (req, res) => {
    const Codigo =req.body.Codigo;
    const Descricao=req.body.Descricao;
    const Fornecedor=req.body.Fornecedor;
    const DataFabricacao=req.body.DataFabricacao;
    const QtEstoque=req.body.QtEstoque;
    
    const novoProduto = new Produto({
        Codigo,
        Descricao,
        Fornecedor,
        DataFabricacao,
        QtEstoque,
    });
    
    if (Codigo=="" || Descricao=="" || Fornecedor=="" || DataFabricacao=="" || QtEstoque == "") {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }
    try {
        const produtoSalvo = await novoProduto.save();
        res.json({ error: null, msg: "Cadastro de produto realizado com sucesso", ProdutoId: produtoSalvo._id });
    } catch (error) {
        res.status(400).json({ error });
    }

});

app.get("/login", async (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.get("/produto", async (req, res) => {
    res.sendFile(__dirname + "/produto.html");
});

app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});