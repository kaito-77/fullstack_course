import { useState } from 'react'

const Show_person = (props) => {
  // persons = props.persons
  const { persons, search_name} = props;
  let key_id = 0
  const persons_filter = persons.filter(person => person.name.toLowerCase().includes(search_name.toLowerCase()))    // 如果你在一个字符串上调用 includes('')，它总是返回 true
  return(
    <>
      {persons_filter.map(person => <p key={key_id++}>{person.name} {person.phone}</p>)}
    </>
  )
}

const Filter = ({search, handleSearch}) => {
  return(
    <div>
      filter show with: <input value={search} onChange={handleSearch}/>
    </div>
  )
}

const PersonForm = ({setPersons, persons}) => {
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlenewPhoneChange = (event) =>{
    setNewPhone(event.target.value)
  }

  const add_name = (event) => {
    event.preventDefault()
    // console.log(event.target)
    if(persons.find(person => person.name == newName) === undefined)
      setPersons(persons.concat({name: newName, phone:newPhone}))
    else{
      alert(`${newName} is already added to phonebook`)
    }
    // setPersons([...persons, {name: event.target.value}])
    setNewName('')
    setNewPhone('')
  }

  return(
    <form onSubmit={add_name}>
      <div>
        name: <input value={newName} onChange={handleNameChange}/>
      </div>
      <div>
        number: <input value={newPhone} onChange={handlenewPhoneChange}/>
        </div>
      <div>
        <button type="submit">add</button>
      </div>
  </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phone: '040-123456', id: 1 },
    { name: 'Ada Lovelace', phone: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', phone: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', phone: '39-23-6423122', id: 4 }
  ])
  const [search, setsearch] = useState('')

  const handleSearch = (event) => setsearch(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearch={handleSearch} />
      <h2>Add A New</h2>
      <PersonForm setPersons={setPersons} persons={persons}/>
      <h2>Numbers</h2>
      <Show_person persons={persons} search_name={search}/>
    </div>
  )
}

export default App