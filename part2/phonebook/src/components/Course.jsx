import React from 'react'

const Header = ({text}) => {
    return(
      <h2>{text}</h2>
    )
  }
  
  const Content = ({parts}) =>{
    const total = parts.reduce((s, part) => s += part.exercises, 0)
    return(
      <>
      <ul>
        {parts.map(part => <li key={part.id}>{part.name} {part.exercises}</li>)}
      </ul>
      <p><strong>total of {total} exercises</strong></p>
      </>
    )
  }
  
  const Course = (props) => {
    const {course} = props
    return(
      <div>
      <Header text={course.name} />
      <Content parts={course.parts} />
      </div>
    )
  }

  export default Course