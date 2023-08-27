import "./PlayerBoard.scss"

export const PlayerBoard = (props) => {
    // FIX: Avoid isShipPart cells
    const ChooseCellToDeploy = (e) => {
        const chosenCell = props.playerCellData.filter(cell => cell.id === e.currentTarget.getAttribute("name"))[0]

        if (props.direction.isChosen && props.shipData.filter(ship => ship.isChosen).length !== 0) {
            const GetCondition = (cell, i) => {
                return props.direction.isHorizontal ? (
                    cell.positionX === chosenCell.positionX + i && cell.positionY === chosenCell.positionY
                ) : (
                    cell.positionY === chosenCell.positionY + i && cell.positionX === chosenCell.positionX
                )
            }

            const CheckShipLength = () => {
                if ((props.direction.isHorizontal ? chosenCell.positionX : chosenCell.positionY) + props.shipData.filter(ship => ship.isChosen)[0].length > 10) {
                    props.UpdateModal("Cannot place ship here!")
                    return false
                }
                else {
                    return true
                }
            }

            let newPlayerCellData = props.playerCellData.map(cell => {
                let newCellData = {}
                for (let i = 0; i < props.shipData.filter(ship => ship.isChosen)[0].length; i++) {
                    if (GetCondition(cell, i)) {
                        return {...cell, isShipPart: true}
                    }
                    else {
                        newCellData = cell
                    }
                }
                return newCellData
            })

            if (CheckShipLength()) {
                props.UpdatePlayerCellData(newPlayerCellData)
                props.UpdateShipData(props.shipData.filter(ship => !ship.isChosen))
            }
        }
        else {
            // Modal's things
            if (!props.direction.isChosen) {
                props.UpdateModal("Please select your ship's direction!")
            }

            if (props.shipData.filter(ship => ship.isChosen).length === 0) {
                props.UpdateModal("Please select your ship!")
            }

            if (!props.direction.isChosen && props.shipData.filter(ship => ship.isChosen).length === 0) {
                props.UpdateModal("Please select your ship and its direction!")
            }
        }
    }

    return (
        <div className="player-section">
            <h1>Player Board</h1>
            <div className="board">
                {props.cellArray.map((cellList, cellListIndex) => {
                    return cellList.map((cell, cellIndex) => (
                        <div
                            key={cellListIndex + "-" + cellIndex}
                            className={"cell " +
                                cellListIndex + "-" + cell +
                                (props.playerCellData.filter(playerCell => playerCell.id === cellListIndex + "-" + cellIndex)[0].isShipPart ? " ship" : "")}
                            name={cellListIndex + "-" + cellIndex}
                            style={{"top": cellListIndex * 48, "left": cell * 48}}
                            onClick={ChooseCellToDeploy}></div>
                    ))
                })}
            </div>
        </div>
    )
}