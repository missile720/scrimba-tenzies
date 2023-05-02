import './App.css'
import React from "react"
import Confetti from "react-confetti"
import {nanoid} from "nanoid"
import Die from "./Die"

//Future edits: Save your best time to localStorage

export default function App() {
    const [tenzies, setTenzies] = React.useState(false);  
    const [dice, setDice] = React.useState(allNewDice());
    const [rolls, setRolls] = React.useState(0);
    const [timer, setTimer] = React.useState(0);
    const [timerId, setTimerId] = React.useState(null);
    const [pause, setPause] = React.useState(false);

    React.useEffect(() => {
      let win = true;
      let check = dice[0].value;

      for(let die of dice){
        if(die.isHeld === false || die.value !== check){
          win = false;
          break;
        }
      }

      if(win){
        setTenzies(true);
        pauseTimer();
      }
    },[dice])

    React.useEffect(() => {
      const id = setInterval(startTimer, 1000);
      setTimerId(id);
      return () => clearInterval(id);
    },[])

    function startTimer() {
      setTimer(prevTimer => prevTimer + 1);
    }

    function pauseTimer() {
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
        setPause(true);
      } else {
        const id = setInterval(startTimer, 1000);
        setTimerId(id);
        setPause(false);
      }
    }

    function generateNewDie() {
      return {
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: nanoid()
      }
    }

    function allNewDice() {
      let diceArray = [];

      for(let i = 0; i < 10; i++){
        diceArray.push(generateNewDie());
      }

      return diceArray;
    }

    function rollDice(){
      setRolls(prevRolls => prevRolls + 1);
      setDice(prevDice => prevDice.map(die => {
        return die.isHeld ?
          die : 
          generateNewDie();
      }));
    }

    function holdDice(id){
      setDice(prevDice => prevDice.map(dice => {
        return dice.id === id ? {...dice, isHeld : !dice.isHeld} : dice;
      }))
    }

    function resetDice(){
      setRolls(0);
      setTimer(0);
      setTenzies(false);
      setDice(allNewDice());
      pauseTimer();
    }

    const dices = dice.map(die => (
      <Die
        key = {die.id}
        id = {die.id}
        value = {die.value}
        isHeld = {die.isHeld}
        holdDice = {holdDice}
      />
    ))

    return (
        <main>
            {tenzies && <Confetti/>}
            <h1 className="title">Tenzies</h1>
            <div className='subTitle'>
              <h2>Rolls: {rolls}</h2>
              <h2>Time: {timer}</h2>
            </div>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className='die-container'>
              {dices}
            </div>
            <button className='roll-dice' onClick={tenzies ? resetDice : rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        </main>
    )
}

