import "./App.scss"
import { useState } from "react"
import { cellArray, shipContent } from "../Data"
import { PlayerSection } from "../PlayerSection/PlayerSection"
import { ComputerSection } from "../ComputerSection/ComputerSection"
import { Inventory } from "../Inventory/Inventory"

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
            ChooseCellToDeployByComputer()
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

    const ChooseShip = (shipId) => {
        setShipData(shipData.map(ship => ({...ship, isChosen: shipId === ship.id ? true : false})))
    }

    const ChooseDirection = (directionId) => {
        setDirection({
            isChosen: true,
            isHorizontal: directionId === "horizontal" ? true : false
        })

        setShipData(shipData.map(ship => ({...ship, isHorizontal: directionId === "horizontal" ? true : false})))
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

    const ChooseCellToDeployByComputer = () => {
        const isHorizontal = [false, true][Math.floor(Math.random() * 2)]
        let newComputerCellData = computerCellData
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
        setComputerCellData(newComputerCellData)
    }

    const UpdateIsShooting = () => {
        setIsShooting(true)
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
                            <div style={{"--i": "rgb(60, 60, 60)"}}></div>
                        </li>
                        <li>
                            Attack was a hit
                            <div style={{"--i": "rgb(200, 60, 60)"}}></div>
                        </li>
                        <li>
                            Ship sunk
                            <div style={{"--i": "rgb(200, 60, 200)"}}></div>
                        </li>
                    </ul>
                </div>
                <div className="container">
                    <PlayerSection
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
                            isShooting={isShooting}
                            UpdateIsShooting={UpdateIsShooting} />
                    ) : (
                        <Inventory
                            direction={direction}
                            shipData={shipData}
                            ChooseDirection={ChooseDirection}
                            ChooseShip={ChooseShip} />
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