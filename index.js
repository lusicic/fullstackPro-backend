require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const cors = require('cors')
var morgan = require('morgan')

const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
//app.use(morgan('tiny'))

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :body'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Poyy</h1>')
})

app.get('/info', (request, response) => {
  let numOfPersons = persons.length
  let date = new Date()
  response.send(`<p>Phonebook has info for ${numOfPersons} people</p> ${date}`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => response.json(person))
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => {
      next(error)
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  //const generatedId = Math.floor(Math.random() * 100)

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'name missing',
    })
  } else if (body.number === undefined) {
    return response.status(400).json({
      error: 'number missing',
    })
  }

  /*const samePerson = persons.find((person) => person.name === body.name)
  if (samePerson) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }*/

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => response.json(savedPerson))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'misformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})
