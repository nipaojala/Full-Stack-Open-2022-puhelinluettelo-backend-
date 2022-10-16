/* eslint-disable no-unused-vars */

const personRouter = require('express').Router()
const Person = require('../models/person')

personRouter.get('/', (_req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

personRouter.get('/info', (_req, res) => {
  Person.find({}).then(person => {
    res.send(`Phonebook has info for ${person.length} people<br>${new Date()}`)
  })

})

personRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

personRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(_result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

personRouter.post('/', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

personRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPersonList => {
      response.json(updatedPersonList)
    })
    .catch(error => next(error))
})

module.exports = personRouter