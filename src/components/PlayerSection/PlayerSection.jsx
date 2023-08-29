import "./PlayerSection.scss"

export const PlayerSection = (props) => {
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
                    props.UpdateModal("Cannot place ship here! Ship is longer than the board's limit")
                    return false
                }
                else {
                    return true
                }
            }

            const CheckIfStackedUp = (shipSize) => {
                let mark = 0
                const firstAxis = props.direction.isHorizontal ? "positionX" : "positionY"
                const secondAxis = props.direction.isHorizontal ? "positionY" : "positionX"
                if (CheckShipLength()) {
                    for (let i = 0; i < shipSize; i++) {
                        if (props.playerCellData.filter(playerCell =>
                                playerCell[firstAxis] === chosenCell[firstAxis] + i && playerCell[secondAxis] === chosenCell[secondAxis]
                            )[0].isShipPart) {
                            mark += 1
                        }
                        else {
                            mark += 0
                        }
                    }
                }

                if (mark === 0) {
                    return false
                }
                else {
                    props.UpdateModal("Cannot place ship here! Ships are stacked up")
                    return true
                }
            }

            const shipSize = props.shipData.filter(ship => ship.isChosen)[0].size

            let newPlayerCellData = props.playerCellData.map(playerCell => {
                if (!CheckIfStackedUp(shipSize)) {
                    for (let i = 0; i < shipSize; i++) {
                        if (GetCondition(playerCell, i)) {
                            return {...playerCell, isShipPart: true, size: shipSize}
                        }
                    }
                    return playerCell
                }
                else {
                    return playerCell
                }
            })

            let newShipData = props.shipData.map(ship => {
                if (ship.size === shipSize) {
                    return {...ship,
                        shipCellList: newPlayerCellData.filter(playerCell => playerCell.size === shipSize),
                        isDeployed: true}
                }
                else {
                    return ship
                }
            })

            if (CheckShipLength() && !CheckIfStackedUp(shipSize)) {
                props.UpdatePlayerCellData(newPlayerCellData)
                props.UpdateShipData(newShipData)
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
                    return cellList.map((cell, cellIndex) => {
                        const CheckIsShipPart = props.playerCellData.filter(playerCell => playerCell.id === cellListIndex + "-" + cellIndex)[0].isShipPart
                        const CheckIsShot = props.playerCellData.filter(playerCell => playerCell.id === cellListIndex + "-" + cellIndex)[0].isShot

                        return (
                            <div
                                key={cellListIndex + "-" + cellIndex}
                                className={"cell " +
                                    cellListIndex + "-" + cell +
                                    (CheckIsShipPart ? " ship" : "") +
                                    (CheckIsShot ? " shot" : "")}
                                name={cellListIndex + "-" + cellIndex}
                                style={{"top": cellListIndex * 48, "left": cell * 48}}
                                onClick={ChooseCellToDeploy}></div>
                        )
                    })
                })}
            </div>
        </div>
    )
}