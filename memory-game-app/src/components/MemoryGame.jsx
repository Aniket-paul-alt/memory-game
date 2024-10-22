import React, { useEffect, useState } from 'react'

const MemoryGame = () => {
    const [gridSize, setGridSize] = useState(4)
    const [cards, setCards] = useState([])

    const [flipped, setFlipped] = useState([])
    const [solved, setSolved] = useState([])
    const [disabled, setDisabled] = useState(false)

    const [moves, setMoves] = useState(0)
    const [maxMoves, setMaxMoves] = useState(0)

    const [won, setWon] = useState(false)
    const [gameOver, setGameOver] = useState(false)

    const handleGridSizeChange = (e) =>{
        let size = parseInt(e.target.value)
        if(size >= 2 && size <= 10) setGridSize(size)
    }

    const handleMaxMovesChange = (e) =>{
        let max = parseInt(e.target.value)
        if(max>= 0 && max <= 50) setMaxMoves(max)
    }

    const initializeGame = () =>{
        const totalCards = gridSize * gridSize // 16
        const pairCount = Math.floor(totalCards / 2) // 8

        const numbers = [...Array(pairCount).keys()].map(n => n+1)
        // console.log(numbers);

        const shuffledCards = [...numbers, ...numbers]
        .sort(()=> Math.random() - 0.5)
        .slice(0, totalCards)
        .map((number, index) => ({id: index, number}))

        // console.log(shuffledCards);
        
        setCards(shuffledCards)
        setFlipped([])
        setSolved([])
        setWon(false)
        setMoves(0)
        // setMaxMoves(0)
        setGameOver(false)
    }

    useEffect(()=>{
        initializeGame()
    },[gridSize])

    const checkMatch = (secondId) =>{
        const [firstId] = flipped
        if(cards[firstId].number === cards[secondId].number){
            setSolved([...solved, firstId, secondId])
            setFlipped([])
            setDisabled(false)
        }else{
            setTimeout(() => {
                setFlipped([])
                setDisabled(false)
            }, 1000);
        }
    }

    const handleClick = (id) =>{
        if(disabled || won || gameOver) return
        
        if(moves === maxMoves && maxMoves > 0) {
            return setGameOver(true)
        }
        
        if(flipped.length === 0){
            setMoves(prev => prev + 1)
            setFlipped([id])
            return
        }
        
        if(flipped.length === 1){
            setDisabled(true)
            if(id !== flipped[0]){
                setMoves(prev => prev + 1)
                setFlipped([...flipped, id])
                //check match logic
                checkMatch(id)
            }else{
                setFlipped([])
                setDisabled(false)
            }
        }
    }

    const isFlipped = id => flipped.includes(id) || solved.includes(id)
    const isSolved = id => solved.includes(id)

    useEffect(()=>{
        if(solved.length === cards.length && cards.length > 0) setWon(true)
    },[solved, cards])

    // useEffect(()=>{
    //     if(moves >= maxMoves) setGameOver(true)
    // },[moves, maxMoves])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
    <h1 className='text-3xl font-bold mb-6'>Memory Game</h1>
      {/* input */}
      <div className='mb-4'>
        <label htmlFor="gridSize" className='mr-2'>Grid Size: (max 10)</label>
        <input type="number" id="gridSize" min="2" max="10" value={gridSize} onChange={handleGridSizeChange} className='border-2 border-gray-300 rounded px-2 py-1' />
        <label htmlFor="maxMoves" className='mx-2'>Max Moves: (0 for unlimited)</label>
        <input type="number" id="maxMoves" min="0" max="50" value={maxMoves} onChange={handleMaxMovesChange} className='border-2 border-gray-300 rounded px-2 py-1' />
      </div>

      {/* game board */}
      <h3 className='text-xl mb-4'>Moves: {moves} {maxMoves > 0 ? `/ ${maxMoves}`: ""}</h3>
      <div className='grid gap-2 mb-4' style={{gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`, width: `min(100%, ${gridSize * 5.5}rem)`}}>
        {cards.map((card)=>{
            return <div key={card.id} 
            onClick={()=>handleClick(card.id)}
            className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${isFlipped(card.id) ? isSolved(card.id) ? "bg-green-500 text-white" : "bg-blue-500 text-white" : "bg-gray-300 text-gray-400"} `}>
                {isFlipped(card.id) ? card.number : "?"}
            </div>
        })
        }
      </div>

      {/* result */}
      {won ? <div className='mt-4 text-4xl font-bold text-green-600 animate-bounce'>You Won!</div> : gameOver ? <div className='mt-4 text-4xl font-bold text-red-600 animate-bounce'>Game Over!</div> : ""}
      

      {/* reset / play again btn */}
      <button onClick={initializeGame} className='mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors'>
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  )
}

export default MemoryGame
