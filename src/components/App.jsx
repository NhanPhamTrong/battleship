import "./App.scss"
import { useState } from "react"
import { cellArray, shipContent } from "./Data"

export const App = () => {
    const [isShooting, setIsShooting] = useState(false)
    const [playerCellData, setPlayerCellData] = useState(() => {
        let data = []
        for (let i = 0; i < cellArray.length; i++) {
            cellArray[i].forEach(cell => {
                data.push({
                    id: i + "-" + cell,
                    positionX: cell,
                    positionY: i,
                    isShipPart: false,
                    isShot: false
                })
            })
        }
        return data
    })

    const [computerCellData, setComputerCellData] = useState(() => {
        let data = []
        for (let i = 0; i < cellArray.length; i++) {
            cellArray[i].forEach(cell => {
                data.push({
                    id: i + "-" + cell,
                    positionX: cell,
                    positionY: i,
                    isShipPart: false,
                    isShot: false
                })
            })
        }
        return data
    })

    const [shipData, setShipData] = useState(shipContent)

    const [direction, setDirection] = useState({
        isChosen: false,
        isHorizontal: false
    })

    const [modal, setModal] = useState({
        isPopModal: false,
        content: ""
    })

    const ClickStart = () => {
        if (shipData.length === 0) {
            setIsShooting(true)
        }
        else {
            setModal({
                isPopModal: true,
                content: "You need to deploy all ships!"
            })
        }
    }

    const ClickEnd = () => {
        setIsShooting(false)
        setShipData(shipContent)
        setPlayerCellData(playerCellData.map(cell => ({...cell, isShipPart: false, isShot: false})))
    }

    const ChooseShip = (e) => {        
        setShipData(shipData.map(ship => ({...ship, isChosen: e.currentTarget.getAttribute("id") === ship.id ? true : false})))
    }

    const ChooseDirection = (e) => {
        setDirection({
            isChosen: true,
            isHorizontal: e.currentTarget.getAttribute("id") === "horizontal" ? true : false
        })

        setShipData(shipData.map(ship => ({...ship, isHorizontal: e.currentTarget.getAttribute("id") === "horizontal" ? true : false})))
    }

    const ChooseCellToDeploy = (e) => {
        const chosenCell = playerCellData.filter(cell => cell.id === e.currentTarget.getAttribute("name"))[0]

        if (direction.isChosen && shipData.filter(ship => ship.isChosen).length !== 0) {
            const GetCondition = (cell, i) => {
                return direction.isHorizontal ? (
                    cell.positionX === chosenCell.positionX + i && cell.positionY === chosenCell.positionY
                ) : (
                    cell.positionY === chosenCell.positionY + i && cell.positionX === chosenCell.positionX
                )
            }

            let newPlayerCellData = playerCellData.map(cell => {
                let newCellData = {}
                for (let i = 0; i < shipData.filter(ship => ship.isChosen)[0].length; i++) {
                    if (GetCondition(cell, i)) {
                        return {...cell, isShipPart: true}
                    }
                    else {
                        newCellData = cell
                    }
                }
                return newCellData
            })
            setPlayerCellData(newPlayerCellData)
            setShipData(shipData.filter(ship => !ship.isChosen))
        }
        else {
            // Modal's things
            if (!direction.isChosen) {
                setModal({
                    isPopModal: true,
                    content: "Please select your ship's direction!"
                })
            }

            if (shipData.filter(ship => ship.isChosen).length === 0) {
                setModal({
                    isPopModal: true,
                    content: "Please select your ship!"
                })
            }

            if (!direction.isChosen && shipData.filter(ship => ship.isChosen).length === 0) {
                setModal({
                    isPopModal: true,
                    content: "Please select your ship and its direction!"
                })
            }
        }
    }

    // console.log(playerCellData)
    // console.log(computerCellData)
    // console.log(shipData)

    return (
        <>
            <header>
                <h1>Battleship</h1>
            </header>

            <main>
                <div className="main-header">
                    <div className="btn">
                        <button type="button" onClick={ClickStart}>Start</button>
                        <button type="button" onClick={ClickEnd}>End</button>
                    </div>
                    <div className="result">
                        <div className="player">
                            <p>Player</p>
                            <h1>123</h1>
                        </div>
                        <div className="computer">
                            <p>Computer</p>
                            <h1>123</h1>
                        </div>
                    </div>
                    <ul>
                        <li>
                            Attack missed the ship
                            <div style={{"--i": "black"}}></div>
                        </li>
                        <li>
                            Attack was a hit
                            <div style={{"--i": "red"}}></div>
                        </li>
                        <li>
                            Ship sunk
                            <div style={{"--i": "purple"}}></div>
                        </li>
                    </ul>
                </div>
                <div className="container">
                    <div className="player-section">
                        <h1>Player Board</h1>
                        <div className="board">
                            {cellArray.map((cellList, cellListIndex) => {
                                return cellList.map((cell, cellIndex) => (
                                    <div
                                        key={cellListIndex + "-" + cellIndex}
                                        className={"cell " +
                                            cellListIndex + "-" + cell +
                                            (playerCellData.filter(playerCell => playerCell.id === cellListIndex + "-" + cellIndex)[0].isShipPart ? " ship" : "")}
                                        name={cellListIndex + "-" + cellIndex}
                                        style={{"top": cellListIndex * 48, "left": cell * 48}}
                                        onClick={ChooseCellToDeploy}></div>
                                ))
                            })}
                        </div>
                    </div>
                    {isShooting ? (
                        <div className="computer-section">
                            <h1>Computer Board</h1>
                            <div className="board">
                                {cellArray.map((cellList, cellListIndex) => {
                                    return cellList.map((cell, cellIndex) => (
                                        <div
                                            key={cellListIndex + "-" + cellIndex}
                                            className={"cell " +
                                                cellListIndex + "-" + cell +
                                                (computerCellData.filter(computerCell => computerCell.id === cellListIndex + "-" + cellIndex)[0].isShipPart ? " ship" : "")}
                                            name={cellListIndex + "-" + cellIndex}
                                            style={{"top": cellListIndex * 48, "left": cell * 48}}></div>
                                    ))
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="deploy-section">
                            <h1>Inventory</h1>
                            <div className="direction-options">
                                <button
                                    id="horizontal"
                                    className={direction.isHorizontal && direction.isChosen ? "active" : ""}
                                    type="button"
                                    onClick={ChooseDirection}
                                >
                                    Horizontal
                                </button>
                                <button
                                    id="vertical"
                                    className={!direction.isHorizontal && direction.isChosen ? "active" : ""}
                                    type="button"
                                    onClick={ChooseDirection}
                                >
                                    Vertical
                                </button>
                            </div>
                            <ul>
                                {shipData.map((ship, index) => (
                                    <li key={index}>
                                        <button
                                            id={ship.id}
                                            className={ship.isChosen ? "active" : ""}
                                            type="button"
                                            onClick={ChooseShip}
                                        >
                                            {ship.id.charAt(0).toUpperCase() + ship.id.slice(1)}
                                            <span>{ship.length}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className={"notification-modal " + (modal.isPopModal ? "active" : "")}>
                    <div className="modal-background"></div>
                    <div className="modal-container">
                        <p>{modal.content}</p>
                    </div>
                </div>
            </main>
        </>
    )
}