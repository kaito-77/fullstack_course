import { useState } from 'react'

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // 不包含最大值，包含最小值
}

const MostVote = ({anecdotes, votes}) =>{
  const maxVotesIndex = votes.indexOf(Math.max(...votes));
  return (
    <>
    <p>{anecdotes[maxVotesIndex]}</p>
    <p>has {votes[maxVotesIndex]} votes</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState(Array(anecdotes.length).fill(0))
  
  const handleClick = (length) =>{
    const randomInt = getRandomInt(0, length)
    setSelected(randomInt)
  }

  const handleVote = () =>{
    const copy = [...votes]
    copy[selected] += 1
    setVote(copy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={handleVote} >vote</button>
      <button onClick={() => handleClick(anecdotes.length)} >next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <MostVote anecdotes={anecdotes} votes={votes} />
    </div>
  )
}

export default App