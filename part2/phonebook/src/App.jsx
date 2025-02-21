import axios from 'axios';
import phoneprocess from './services/phoneprocess';
import { useEffect, useState } from 'react'
import './index.css'

const Notification = ({message, setChangeMessage}) => {   // 不要用它来控制页面重新渲染，而是message改变时触发页面渲染进而自动重新渲染它

  useEffect(() => {
    const timer = setTimeout(() => {
      setChangeMessage(null)
    }, 3000)

    return () => clearTimeout(timer)

  }, [message])              // message改变后重新渲染组件，它再将有值的message改为 ""，再次渲染

  if(message === null)
    return null

  const cssType = message[0] !== 'I' ? 'message_successed' : 'message_failed'

  return(
    <div className={cssType}>
      {message}
    </div>
  )
}

const Show_person = (props) => {
  // persons = props.persons
  const { persons, search_name, setPersons} = props;
  const persons_filter = persons.filter(person => person.name.toLowerCase().includes(search_name.toLowerCase()))    // 如果你在一个字符串上调用 includes('')，它总是返回 true
  
  const delete_name = (person) => {
    console.log(person.id)
    const confirmed =window.confirm(`Delete ${person.name}?`)       // 弹出确认框
    if(!confirmed)
      return

    phoneprocess
    .del(person.id)
    .then(  response => {
      console.log('删除成功:', response.data)
      setPersons(persons.filter(x => x.id !== person.id))
    })
    .catch( error => {
      alert(
        `No '${person.name}'`
      )
      setPersons(persons.filter(x => x.id !== id))
    }
  
    )
  }
  
  return(
    <>
      {persons_filter.map(person => <p key={person.id}>{person.name} {person.phone} <button onClick={() => delete_name(person)}>delete</button></p>)}
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

const PersonForm = ({setPersons, persons, setChangeMessage}) => {
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
    if(persons.find(person => person.name == newName) === undefined){
      const nowPerson = {name: newName, number:newPhone}
      phoneprocess.create(nowPerson).then(response => {
        setPersons(persons.concat(response.data))
        setChangeMessage(`Add ${response.data.name}`)
     })
    }
    else{
      const oldPerson = persons.find(person => person.name == newName)

      const confirmed =window.confirm(`Do you want to update ${oldPerson.name}?`)       // 弹出确认框
      if(!confirmed)
        return

      const updatePerson = {...oldPerson, number: newPhone}

      phoneprocess.update(updatePerson)
      .then( response => {
        setPersons(persons.map(x => x.id === updatePerson.id ? response.data : x))
        setChangeMessage(`Update ${response.data.name}`)
      })
      .catch(error => {
        setPersons(persons.filter(x => x.id !== updatePerson.id))
        setChangeMessage(`Information of ${updatePerson.name} has already been removed from server`)
      })
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
  const [persons, setPersons] = useState([])
  const [search, setsearch] = useState('')
  const [changeMessage, setChangeMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const handleSearch = (event) => setsearch(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={changeMessage} setChangeMessage={setChangeMessage}/>
      <Filter search={search} handleSearch={handleSearch} />
      <h2>Add A New</h2>
      <PersonForm setPersons={setPersons} persons={persons} setChangeMessage={setChangeMessage}/>
      <h2>Numbers</h2>
      <Show_person persons={persons} search_name={search} setPersons={setPersons}/>
    </div>
  )
}

export default App