import { useCallback, useEffect, useMemo, useState } from 'react'
import { Grid } from './Grid';

const randInt = (max: number): number => {
  return Math.floor(Math.random() * max);
}

function App() {
  const getRandomGrid = (rows: number, cols: number): number[][] => {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.floor(Math.random() * 2)),
    )
  }

  const grid = useMemo(() => getRandomGrid(5, 5), []);
  const [isMarching, setIsMarching] = useState(false);
  // const randomX = Math.floor(Math.random() * 5);
  // const randomY = Math.floor(Math.random() * 5);
  const [path, setPath] = useState<number[][]>([[0, 0]]);
  const [x, y] = useMemo(() => path[path.length - 1], [path]);
  // x,y lookup
  const [visited, setVisited] = useState((
    () => new Set(
      path.map(
        ([x, y]) => String(x) + "," + String(y)
      ))
  ))

  const withinGrid = (x: number, y: number, maxX: number, maxY: number): boolean => {
    return (
      x >= 0 && x <= maxX
      &&
      y >= 0 && y <= maxY
    )
  }
  const getValidPathsFromCurrent = useCallback((currentX: number, currentY: number): number[][] => {
    const options = [
      // Left
      [currentX - 1, currentY],
      // Right
      [currentX + 1, currentY],
      // Down
      [currentX, currentY + 1],
      // Up
      [currentX, currentY - 1],
    ]
    return options.filter(([newX, newY]) => withinGrid(newX, newY, 4, 4) && !visited.has(`${newX},${newY}`) && grid[newX][newY] === 0)
  }, [grid, visited])
  const validPaths = useMemo(() => getValidPathsFromCurrent(x, y), [getValidPathsFromCurrent, x, y]);

  const backTrack = useCallback(() => {
    if (path.length === 1) {
      alert("No path found")
      setIsMarching(false)
    } else {
      setPath(path.slice(0, path.length - 1))
    }
  }, [path])

  const march = useCallback(() => {
    if (validPaths.length) {
      const [validX, validY] = validPaths[randInt(validPaths.length)];
      setPath([...path, [validX, validY]])
      setVisited(new Set(visited.add(`${validX},${validY}`)))
    } else {
      // Backtrack
      backTrack()
    }
  }, [validPaths, path, visited, backTrack])

  useEffect(() => {
  let intervalId: number | null = null;
  
  if (isMarching) {
    // Start the interval when isMarching becomes true
    intervalId = window.setInterval(() => {
      march();
    }, 200);
  }
  
  // Clean up function that runs when the component unmounts
  // or when dependencies change
  return () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  };
}, [isMarching, march]);

  const onClick = () => {
    setIsMarching(!isMarching)
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <h1 className="underline m-auto">Backtracking Visualisation</h1>
      <Grid grid={grid} currentX={x} currentY={y} visited={visited} validPaths={validPaths} />
      <button className="w-1/2" onClick={onClick}>March</button>
      <button className="w-1/2" onClick={() => window.location.reload()}>Reset</button>
    </div>
  )
}

export default App
