import { useState } from 'react'

const Button = ({handleClick, text}) =>(
  <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({text, count}) => {
  return(
    <tr>
    <td>{text}</td><td>{count}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const { good, neutral, bad} = props
  const sum_count = good + neutral + bad
  if (sum_count == 0) {
    return (
      <>
      <p>No feedback given</p>
      </>
    )
  }
  return(
    <table>
      <tbody>
        <StatisticLine text='good' count={good} />
        <StatisticLine text='neutral' count={neutral} />
        <StatisticLine text='bad' count={bad} />
        <StatisticLine text='all' count={sum_count} />
        <StatisticLine text='average' count={(good - bad) / sum_count} />
        <StatisticLine text='positive' count={good / sum_count * 100 + '%'} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
