import { useEffect } from "react"

export const ComputerSection = (props) => {
    const ChooseCellToDeploy = () => {
        // Random direction
        // Random cell
        // Ship 5, 4, 3, 2
        const isHorizontal = [false, true][Math.floor(Math.random() * 2)]

        // FIX: Avoid isShipPart cells in creating random positions
        let newComputerCellData = props.computerCellData
        for (let i = 2; i < 6; i++) {
            let randomPositionX = Math.floor(Math.random() * (isHorizontal ? (10 - i) : 10))
            let randomPositionY = Math.floor(Math.random() * (!isHorizontal ? (10 - i) : 10))            
            const data = newComputerCellData

            const CheckIfStackedUp = (shipLength) => {
                let mark = 0
                const firstAxis = isHorizontal ? "positionX" : "positionY"
                const secondAxis = isHorizontal ? "positionY" : "positionX"
                const chosenCell = data.filter(cell => cell.positionX === randomPositionX && cell.positionY === randomPositionY)[0]
                for (let j = 0; j < shipLength; j++) {
                    if (data.filter(computerCell =>
                            computerCell[firstAxis] === chosenCell[firstAxis] + j && computerCell[secondAxis] === chosenCell[secondAxis]
                        )[0].isShipPart) {
                        mark += 1
                    }
                    else {
                        mark += 0
                    }
                }

                if (mark === 0) {
                    return false
                }
                else {
                    return true
                }
            }

            while (CheckIfStackedUp(i)) {
                randomPositionX = Math.floor(Math.random() * (isHorizontal ? (10 - i) : 10))
                randomPositionY = Math.floor(Math.random() * (!isHorizontal ? (10 - i) : 10))
                console.log(randomPositionX, randomPositionY)
            }

            const chosenCell = data.filter(computerCell => computerCell.positionX === randomPositionX && computerCell.positionY === randomPositionY)[0]

            const GetCondition = (cell, i) => {
                return isHorizontal ? (
                    cell.positionX === chosenCell.positionX + i && cell.positionY === chosenCell.positionY
                ) : (
                    cell.positionY === chosenCell.positionY + i && cell.positionX === chosenCell.positionX
                )
            }

            newComputerCellData = newComputerCellData.map(computerCell => {
                let newCellData = {}
                for (let j = 0; j < i; j++) {
                    if (GetCondition(computerCell, j)) {
                        return {...computerCell, isShipPart: true}
                    }
                    else {
                        newCellData = computerCell
                    }
                }
                return newCellData
            })
        }
        props.UpdateComputerCellData(newComputerCellData)
    }

    useEffect(() => {
        ChooseCellToDeploy()
    }, [])

    return (
        <div className="computer-section">
            <h1>Computer Board</h1>
            <div className="board">
                {props.cellArray.map((cellList, cellListIndex) => {
                    return cellList.map((cell, cellIndex) => (
                        <div
                            key={cellListIndex + "-" + cellIndex}
                            className={"cell " +
                                cellListIndex + "-" + cell +
                                (props.computerCellData.filter(computerCell => computerCell.id === cellListIndex + "-" + cellIndex)[0].isShipPart ? " ship" : "")}
                            name={cellListIndex + "-" + cellIndex}
                            style={{"top": cellListIndex * 48, "left": cell * 48}}
                            onClick={ChooseCellToDeploy}></div>
                    ))
                })}
            </div>
        </div>
    )
}