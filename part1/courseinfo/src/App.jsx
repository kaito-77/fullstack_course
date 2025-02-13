import { useState } from 'react'

const Header = (props)=>{
  console.log(props)
  return(
    <h1>{props.course}</h1>
  )
}

const Content = (props)=>{
  return(
    <div>
    <Part part={props.part[0]['name']} exercises={props.part[0]['exercises']} />
    <Part part={props.part[1]['name']} exercises={props.part[1]['exercises']} />
    <Part part={props.part[2]['name']} exercises={props.part[2]['exercises']} />
  </div>
  )
}

const Total = (props)=>{
  let sum_exercises = 0
  props.parts.forEach(value=>
    sum_exercises += value.exercises
  )
  return(
    <p>Number of exercises {sum_exercises}</p>
  )
}

const Part = (props)=>{
  return(
    <p>{props.part} {props.exercises}</p>
  )
}

function App() {

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content part={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App
