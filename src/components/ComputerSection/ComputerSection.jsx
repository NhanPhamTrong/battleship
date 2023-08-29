import "./ComputerSection.scss"

export const ComputerSection = (props) => {
    const ShotOnBoard = (e) => {
        const chosenCell = props.computerCellData.filter(cell => cell.id === e.currentTarget.getAttribute("name"))[0]

        let newComputerCellData = props.computerCellData.map(computerCell => {
            let result = {}

            if (computerCell.id === chosenCell.id) {
                result = {...computerCell, isShot: true}
            }
            else {
                result = computerCell
            }
            
            return result
        })

        for (let i = 2; i < 6; i++) {
            let countDestroyedCell = 0
            newComputerCellData.forEach(computerCell => {
                if (computerCell.size === i && computerCell.isShipPart && computerCell.isShot) {
                    countDestroyedCell += 1
                }
            })

            if (countDestroyedCell === i) {
                newComputerCellData = newComputerCellData.map(computerCell => {
                    return computerCell.size === i ? {...computerCell, isSunk: true} : computerCell
                })
            }
        }

        if (!chosenCell.isShot) {
            if (newComputerCellData.filter(computerCell => computerCell.isSunk).length === 14) {
                props.UpdateResult("Player wins!")
            }
            props.UpdateScore(newComputerCellData.filter(computerCell => computerCell.isShipPart && computerCell.isShot).length)
            props.UpdateComputerCellData(newComputerCellData)
            props.ShotOnBoardByComputer()
        }
    }

    return (
        <div className="computer-section">
            <h1>Computer Board</h1>
            <div className="board">
                {props.cellArray.map((cellList, cellListIndex) => {
                    return cellList.map((cell, cellIndex) => {
                        const thisCell = props.computerCellData.filter(computerCell => computerCell.id === cellListIndex + "-" + cellIndex)[0]
                        const checkIsShipPart = thisCell.isShipPart
                        const checkIsShot = thisCell.isShot
                        const checkIsSunk = thisCell.isSunk

                        return (
                            <div
                                key={cellListIndex + "-" + cellIndex}
                                className={"cell " +
                                    cellListIndex + "-" + cell +
                                    (checkIsShipPart ? " ship" : "") +
                                    (checkIsShot ? " shot" : "") +
                                    (checkIsSunk ? " sunk" : "")}
                                name={cellListIndex + "-" + cellIndex}
                                style={{"top": cellListIndex * 48, "left": cell * 48}}
                                onClick={ShotOnBoard}></div>
                        )
                    })
                })}
            </div>
        </div>
    )
}