const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://nipa:${password}@cluster0.gbmi2kb.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'Valmiiksi',
  number: '044-3530839',
})

// eslint-disable-next-line no-constant-condition
if ( false ) {
  person.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})