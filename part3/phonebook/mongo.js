import mongoose from 'mongoose'

const db_password = process.argv[2]

console.log(process.argv.length)

const url =
  `mongodb+srv://azxcyg1:${db_password}@cluster0.uhtmj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('phonebook', phonebookSchema)

if (process.argv.length<=3) {
  Phonebook.find({}).then(results => {
    results.forEach(result => console.log(result))
    mongoose.connection.close()
  })
}
else{

  const phonebook = new Phonebook({
    name: process.argv[3],
    number: process.argv[4],
  })

  phonebook.save().then(result => {
    console.log('phonebook saved!')
    mongoose.connection.close()
  })

}