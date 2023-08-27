import "./App.scss"
import { useState } from "react"
import { cellArray, shipContent } from "../Data"
import { PlayerBoard } from "../PlayerBoard/PlayerBoard"
import { ComputerSection } from "../ComputerBoard/ComputerSection"

export const App = () => {
    const [isShooting, setIsShooting] = useState(true)
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

    const UpdateModal = (content) => {
        setModal({
            isPopModal: true,
            content: content
        })
    }

    const UpdatePlayerCellData = (data) => {
        setPlayerCellData(data)
    }

    const UpdateShipData = (data) => {
        setShipData(data)
    }

    const UpdateComputerCellData = (data) => {
        setComputerCellData(data)
    }

    const CloseModal = () => {
        setModal({
            isPopModal: false,
            content: ""
        })
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
                    <PlayerBoard
                        playerCellData={playerCellData}
                        shipData={shipData}
                        cellArray={cellArray}
                        direction={direction}
                        UpdateModal={UpdateModal}
                        UpdatePlayerCellData={UpdatePlayerCellData}
                        UpdateShipData={UpdateShipData} />
                    {isShooting ? (
                        <ComputerSection
                            computerCellData={computerCellData}
                            cellArray={cellArray}
                            UpdateComputerCellData={UpdateComputerCellData} />
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
                    <div className="modal-background" onClick={CloseModal}></div>
                    <div className="modal-container">
                        <h1>{modal.content}</h1>
                    </div>
                </div>
            </main>
        </>
    )
}