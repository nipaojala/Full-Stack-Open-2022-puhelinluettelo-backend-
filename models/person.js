/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  number: {
    minlength: 8,
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return (/(0([1-9]{1,2})-([0-9]))|(0([0-9]{2})-([0-9]))/).test(v)

      },
      message: props => `${props.value} is not a valid phone number! Number must be
            formatted like XXX-XX... or XX-XX... totally 8 numbers atleast`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)