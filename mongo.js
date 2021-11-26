const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Pls provide pass as an arg: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ktrn:${password}@cluster0.bd3ta.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

let name = process.argv[3]
let number = process.argv[4]

const person = new Person({
  name: name,
  number: number,
})

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook: ')
    result.forEach((person) => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
