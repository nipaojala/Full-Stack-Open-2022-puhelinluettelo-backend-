require('dotenv').config()
const { application } = require('express')
const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
const Person = require('./models/person')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :param'))

morgan.token('param', function(req, res) {
    return JSON.stringify(req.body);
});

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())

app.use(requestLogger)

app.use(cors())

app.use(express.static('build'))

app.get('/', (req, res) => {
  return res.redirect('/api/persons')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then(person => {
    res.send(`Phonebook has info for ${person.length} people<br>${new Date()}`)
  })
  
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
  
  app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
    const person = new Person({
      name: body.name,
      number: body.number,
      })
      person.save().then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => next(error))
    })
  
    app.put('/api/persons/:id', (request, response, next) => {
      const body = request.body
      const person = {
        name: body.name,
        number: body.number,
      }
    
      Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPersonList => {
          response.json(updatedPersonList)
        })
        .catch(error => next(error))
    })
  
    const unknownEndpoint = (request, response) => {
      response.status(404).send({ error: 'unknown endpoint' })
    }
    
    app.use(unknownEndpoint)
    
    const errorHandler = (error, request, response, next) => {
      console.error(error.message)
    
      if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } else if (error.name === 'ValidationError') {
        console.log(error.name)
        return response.status(400).json({ error: error.message })
      }

      next(error)
    }
    
    app.use(errorHandler)
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })