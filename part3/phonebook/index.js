require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const Phonebook = require('./models/Phonebook')

// const app = http.createServer((request, response) => {                  // 使用 Node.js 的内置 http 模块来创建服务器。
//     response.writeHead(200, {'Content-Type' : 'application/json'})
//     response.end(JSON.stringify(phonebooks))
// })

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

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

app.use(cors())

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

  // if(phonebooks.map(person => person.name).includes(body.name)){
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }
  Phonebook.find({}).then(results => {
    if(results.map(result => result.name).includes(body.name)){
      return response.status(400).json({error: 'name must be unique'})
    }
    else{
      // const maxId = generateId()         

      const phonebook = new Phonebook({
        name: body.name,
        number: body.number,
      })

      phonebook.save().then(result => {
        console.log('phonebook saved!')
        // mongoose.connection.close()
      })

      response.json(phonebook)
    }
  })

  
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const id = String(request.params.id)
  const phonebook = {
    name: body.name,
    number: body.number
  }
  console.log(body)
  Phonebook.findByIdAndUpdate(id, phonebook, {new:true})
    .then(updateAns => {
      response.json(updateAns)
    })
    .catch(error => {
      next(error)
    })
})

app.get('/info', (request, response, next) => {
  const nowtime = new Date()
  Phonebook.find({}).then(now => {
    response.send(`<p>Phonebook has info for ${now.length} people<p><p>${nowtime}</p>`)
    })
    .catch(error => {
      next(error)
    });
  // response.send(`<p>Phonebook has info for ${phonebooks.length} people<p><p>${nowtime}</p>`)
})

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(results => {
    response.json(results)
    //  mongoose.connection.close()  后续的数据库操作会因为没有连接而失败
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = String(request.params.id)

  // const phonebook = phonebooks.find(phonebook => {
  //   return phonebook.id === id
  // })
  // if(phonebook)
  //   response.json(phonebook)
  // else{
  //   response.status(404).end()
  // }
  Phonebook.findById(id)
    .then(phonebook => {
      if(phonebook)
          response.json(phonebook)
      else{
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = String(request.params.id)
  // phonebooks = phonebooks.filter(phonebook => phonebook.id !== id)
  // response.status(204).end()
  Phonebook.findByIdAndDelete(id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => {
      next(error)         // 将错误传递给错误处理中间件
    })
})

const errorHandle = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)     // 将当前错误传递给下一个错误处理中间件
}

app.use(errorHandle)

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
//   console.log(__dirname)
// });

const PORT = process.env.PORT || 3001                  // 定义端口并启动服务器
app.listen(PORT)                    // 启动服务器并监听指定端口
console.log(`Server running on port ${PORT}`)


