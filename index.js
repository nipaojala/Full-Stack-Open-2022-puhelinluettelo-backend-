const { application } = require('express')
const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())

let notes = [
    {
        id: 1,    
        name: "Arto Hellas",    
        number: "040-123456",    
    },  
    {
        id: 2,    
        name: "Ellu Kananen",    
        number: "0443574625",    
    },  
    {
        id: 3,    
        name: "Jaska Jokunen",    
        number: "050434575",    
    },
    {
        id: 4,    
        name: "Maija Mehiläinen",    
        number: "044 6574432",    
    }
]
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :param'))

morgan.token('param', function(req, res) {
    return JSON.stringify(req.body);
});



app.get('/', (req, res) => {
  return res.redirect('/api/persons')
})

app.get('/api/persons', (req, res) => {
    res.json(notes)
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${notes.length} people<br>${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
}})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
      
    response.status(204).end()
})
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    const persons = notes.find(n => n.name === body.name)
    if (!body.name) {
      return response.status(400).json({ 
        error: 'person must have name' 
      })
    }
    if (!body.number) {
        return response.status(400).json({ 
          error: 'person must have number' 
        })
      }
      if (persons) {
        return response.status(400).json({ 
          error: 'person is already in phonebook' 
        })
      }
  
    const note = {
      id: Math.floor(Math.random()*100),
      name: body.name,
      number: body.number,
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })
      
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })