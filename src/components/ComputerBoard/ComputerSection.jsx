export const ComputerSection = (props) => {
    const ChooseCellToDeploy = () => {
        // Random direction
        // Random cell
        // Ship 5, 4, 3, 2
        const isHorizontal = [false, true][Math.floor(Math.random() * 2)]

        // Get UpdateComputerCellData out of the for loop
        // FIX: Avoid isShipPart cells in creating random positions
        for (let i = 2; i < 6; i++) {
            let randomPositionX = Math.floor(Math.random() * (isHorizontal ? (10 - i) : 10))
            let randomPositionY = Math.floor(Math.random() * (!isHorizontal ? (10 - i) : 10))
            const chosenCell = props.computerCellData.filter(cell => cell.positionX === randomPositionX && cell.positionY === randomPositionY)[0]

            const GetCondition = (cell, i) => {
                return isHorizontal ? (
                    cell.positionX === chosenCell.positionX + i && cell.positionY === chosenCell.positionY
                ) : (
                    cell.positionY === chosenCell.positionY + i && cell.positionX === chosenCell.positionX
                )
            }

            let newComputerCellData = props.computerCellData.map(cell => {
                let newCellData = {}
                for (let j = 0; j < i; j++) {
                    if (GetCondition(cell, j)) {
                        return {...cell, isShipPart: true}
                    }
                    else {
                        newCellData = cell
                    }
                }
                return newCellData
            })
            
            props.UpdateComputerCellData(newComputerCellData)
        }
    }

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