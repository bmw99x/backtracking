import React, { JSX, useCallback } from 'react'

type Props = {
    grid: number[][]
    currentX: number,
    currentY: number,
    visited: Set<string>,
    validPaths: number[][]
}

export const Grid = ({
    grid,
    currentX,
    currentY,
    visited,
    validPaths,
}: Props) => {

    const isAValidPath = useCallback((x: number, y: number) => {
        return Boolean(validPaths.find(([validX, validY]) => validX === x && validY === y))
    }, [validPaths])

    const renderCell = useCallback((x: number, y: number) => {
        if (isAValidPath(x, y)) {
            return <div id={`cell-${x},${y}`} key={`cell-${x},${y}`} className="bg-purple-700 border w-12 h-12" />
        }
        if (grid[x][y] === 1) {
            return <div id={`cell-${x},${y}`} key={`cell-${x},${y}`} className="bg-gray-200 border w-12 h-12" />
        }
        else if (currentX === x && currentY === y) {
            return <div id={`cell-${x},${y}`} key={`cell-${x},${y}`} className="bg-green-700 border w-12 h-12" />
        }
        else if (visited.has(`${x},${y}`)) {
            return <div id={`cell-${x},${y}`} key={`cell-${x},${y}`} className="bg-black-700 border w-12 h-12" />
        }
        return <div id={`cell-${x},${y}`} key={`cell-${x},${y}`} className="bg-blue-700 border w-12 h-12" />
    }, [isAValidPath, grid, currentX, currentY, visited])

    return (
        <div className="flex flex-col justify-center items-center w-full">
            {grid.map((_, row) => (
                <div key={`row-${row}`} className="flex">
                    {grid[row].map((_, col) => (
                        renderCell(row, col)
                    ))}
                </div>
            ))}
        </div>
    )
}