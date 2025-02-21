const express = require('express')
var morgan = require('morgan')
const app = express()

let phonebooks = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

// const app = http.createServer((request, response) => {                  // 使用 Node.js 的内置 http 模块来创建服务器。
//     response.writeHead(200, {'Content-Type' : 'application/json'})
//     response.end(JSON.stringify(phonebooks))
// })

app.use(express.json())

morgan.token('post_req', function (req, res) { 
  const temp = JSON.stringify(req.body)
  console.log(temp)
  return temp !== '{}'? temp : '' })
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.post_req(req, res)
  ].join(' ')
}))

const generateId = () => {
  // const maxId = phonebooks.length > 0
  //   ? Math.max(...phonebooks.map(n => n.id))     // Math.max 需要一系列独立的数字参数，而不是一个数组
  //   : 0
  // return maxId + 1
  return Math.floor(Math.random() * (100000000 - 1) + 1);
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  if(!body.name){
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if(!body.number){
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if(phonebooks.map(person => person.name).includes(body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const maxId = generateId()         

  const phonebook = {
    id: maxId,
    name: body.name,
    number: body.number,
  }

  phonebooks = phonebooks.concat(phonebook)
  response.json(phonebook)
})

app.get('/info', (request, response) => {
  const nowtime = new Date()
  response.send(`<p>Phonebook has info for ${phonebooks.length} people<p><p>${nowtime}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(phonebooks)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const phonebook = phonebooks.find(phonebook => {
    return phonebook.id === id
  })
  if(phonebook)
    response.json(phonebook)
  else{
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebooks = phonebooks.filter(phonebook => phonebook.id !== id)

  response.status(204).end()
})

const PORT = 3001                   // 定义端口并启动服务器
app.listen(PORT)                    // 启动服务器并监听指定端口
console.log(`Server running on port ${PORT}`)


