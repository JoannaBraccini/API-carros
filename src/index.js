import express, { response } from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
const app = express()
app.use(cors())
app.use(express.json())

//http://localhost:3333/carros

//----cadastrar
let carros = []
let proximoCarro = 1
app.post('/carros',(request, response)=>{
    const {modelo, marca, ano, cor, preco} = request.body

    if (!modelo){
        response.status(400).send(JSON.stringify({Mensagem: 'Informe um modelo válido'}))
    }
    if (!marca){
        response.status(400).send(JSON.stringify({Mensagem: 'Informe uma marca válida'}))
    }
    if (!ano){
        response.status(400).send(JSON.stringify({Mensagem: 'Informe um ano válido'}))
    }
    if (!cor){
        response.status(400).send(JSON.stringify({Mensagem: 'Informe uma cor válida'}))
    }
    if (!preco){
        response.status(400).send(JSON.stringify({Mensagem: 'Informe um preço válido'}))
    }

    let novoCarro = {id: proximoCarro, modelo: modelo, marca: marca, ano: ano, cor: cor, preco: preco}
    carros.push(novoCarro)
    proximoCarro++

    response.status(201).send(JSON.stringify({Mensagem: `ID: ${novoCarro.id} | Modelo: ${novoCarro.modelo} | Marca: ${novoCarro.marca} | Ano: ${novoCarro.ano} | Cor: ${novoCarro.cor} | Preço: R$${novoCarro.preco}`}))
})

//----listar
app.get('/carros',(request,response)=>{

    if (carros.lenght === 0){
        response.status(404).send(JSON.stringify({Mensagem: 'Nenhum carro cadastrado. Crie um novo cadastro.'}))
    }

    const dadosMapeados = carros.map((carro)=>
    `ID: ${carro.id} | Modelo: ${carro.modelo} | Marca: ${carro.marca} | Ano: ${carro.ano} | Cor: ${carro.cor} | Preço: R$${carro.preco}`)

    response.status(200).send(dadosMapeados)
})

//-----filtrar http://localhost:3333/carros/:marca
app.get('/carros/:marca',(request,response)=>{
    const marca = request.params.marca

    if(!marca){
        response.status(400).send(JSON.stringify({Mensagem: "Favor informar uma marca válida"}))
    }

    const marcaBuscada = carros.findIndex(carro => carro.marca === marca)
    if(marcaBuscada === -1){
        response.status(400).send(JSON.stringify({Mensagem: "Marca não encontrada"}))
    }

    if(marcaBuscada !== -1){
        let buscaMarca = carros.filter((carro)=> carro.marca === marca)
        let buscaMapaeada = buscaMarca.map((carro)=>`ID: ${carro.id} | Modelo: ${carro.modelo} | Cor: ${carro.cor} | Preço: R$${carro.preco}`)    
        response.status(200).send(JSON.stringify({Mensagem: buscaMapaeada}))        
    }

})

//------atualizar  http://localhost:3333/carros/:idBusca
app.put('/carros/:idBusca',(request,response)=>{
    const {cor, preco} = request.body
    const idBusca = Number(request.params.idBusca)

    if(!idBusca){
        response.status(400).send(JSON.stringify({Mensagem: 'Informe um Identificador válido!'}))
    }
    if(!cor){
        response.status(400).send(JSON.stringify({Mensagem: 'Informe uma cor!'}))
    }
    if(!preco){
        response.status(400).send(JSON.stringify({Mensagem: 'Informe um valor!'}))
    }

    const posicaoId = carros.findIndex(carro => carro.id === idBusca)
    if(posicaoId === -1){
        response.status(400).send(JSON.stringify({Mensagem: 'Veículo, não encontrado. O usuário deve voltar para o menu inicial depois'}))
    } else {
        const carro = carros[posicaoId]
        carro.cor = cor
        carro.preco = preco

        response.status(200).send(JSON.stringify({Mensagem: `Dados alterados com sucesso!`,
        data: carro}))
    }
})

//------deletar
app.delete('/carros/:idBusca',(request,response)=>{
    const idBusca = Number(request.params.idBusca)

    if(!idBusca){
        response.status(400).send(JSON.stringify({Mensagem: 'Informe um Identificador válido!'}))
    }

    const posicaoId = carros.findIndex(carro => carro.id === idBusca)
    if(posicaoId === -1){
        response.status(400).send(JSON.stringify({Mensagem: 'Veículo, não encontrado. O usuário deve voltar para o menu inicial depois'}))
    } else {
        carros.splice(posicaoId, 1)
        response.status(200).send(JSON.stringify({Mensagem: 'Veículo removido com sucesso!'}))
    }
})

let usuarios = []
//------signup
app.post('/signup',async (request,response)=>{
    const {nome, email, senha} = request.body

    if(!email){
        response.status(400).send(JSON.stringify({Mensagem: 'Favor inserir um email válido'}))
    }
    if(!senha){
        response.status(400).send(JSON.stringify({Mensagem: 'Favor inserir uma senha válida'}))
    }

    const verificarEmail = usuarios.find(usuario => usuario.email === email)
    if(verificarEmail){
        response.status(400).send(JSON.stringify({Mensagem: 'Email já cadastrado no sistema!'}))
    }

    const senhaCriptografada = await bcrypt.hash(senha,10)

    let novoUsuario = {nome:nome,email:email,senha:senhaCriptografada}
    usuarios.push(novoUsuario)
    response.status(201).send(JSON.stringify({Mensagem: 'Usuário criado com sucesso'}))
})

//------login
app.put('/login',async (request,response)=>{
    const {email, senha} = request.body

    if(!email){
        response.status(400).send(JSON.stringify({Mensagem: 'Favor inserir um email válido'}))
    }
    if(!senha){
        response.status(400).send(JSON.stringify({Mensagem: 'Favor inserir uma senha válida'}))
    }

    const usuario = usuarios.find(usuario => usuario.email === email)

    const senhaVerificada = await bcrypt.compare(senha, usuario.senha)
    if(!senhaVerificada){
        response.status(400).send(JSON.stringify({Mensagem: 'Credencial inválida. Confira sua senha.'}))
    }

    response.status(200).send(JSON.stringify({Mensagem: 'Usuário logado com sucesso'}))
})

app.listen(3333,()=>console.log('Servidor rodando na porta 3333'))