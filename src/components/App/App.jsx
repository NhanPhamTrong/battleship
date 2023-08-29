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

    const [prevCell, setPrevCell] = useState({
        positionX: 0,
        positionY: 0
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
        if (shipData.filter(ship => !ship.isDeployed).length === 0) {
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
        setShipData(shipData.map(ship => ({...ship, isChosen: shipId === ship.id})))
    }

    const ChooseDirection = (directionId) => {
        setDirection({
            isChosen: true,
            isHorizontal: directionId === "horizontal"
        })

        setShipData(shipData.map(ship => ({...ship, isHorizontal: directionId === "horizontal"})))
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

    const UpdateComputerCellData = (data) => {
        setComputerCellData(data)
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

            const CheckIfStackedUp = (shipSize) => {
                let mark = 0
                const firstAxis = isHorizontal ? "positionX" : "positionY"
                const secondAxis = isHorizontal ? "positionY" : "positionX"
                const chosenCell = data.filter(cell => cell.positionX === randomPositionX && cell.positionY === randomPositionY)[0]
                for (let j = 0; j < shipSize; j++) {
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

    const [isFoundShipPart, setIsFoundShipPart] = useState(false)
    const [isFoundWay, setIsFoundWay] = useState(false)

    const ShotOnBoardByComputer = () => {
        // shoot randomly at first (DONE)
        // when found 1 ship's part, shoot 4 cell around
        // while shooting around, if computer find 1 more ship's part, it'll shoot at that way

        console.log(isFoundShipPart)

        if (!isFoundShipPart && !isFoundWay) {
            console.log("condition 1")
            let randomPositionX = Math.floor(Math.random() * 10)
            let randomPositionY = Math.floor(Math.random() * 10)
    
            const CheckIfCoincidedCell = () => {
                return playerCellData.filter(playerCell => playerCell.positionX === randomPositionX && playerCell.positionY === randomPositionY)[0].isShot ? true : false
            }
    
            while (CheckIfCoincidedCell()) {
                randomPositionX = Math.floor(Math.random() * 10)
                randomPositionY = Math.floor(Math.random() * 10)
            }

            const chosenCell = playerCellData.filter(playerCell => playerCell.positionX === randomPositionX && playerCell.positionY === randomPositionY)[0]

            if (chosenCell.isShipPart) {
                setIsFoundShipPart(true)
                setPrevCell({
                    positionX: chosenCell.positionX,
                    positionY: chosenCell.positionY
                })
            }
    
            let newPlayerCellData = playerCellData.map(playerCell => {
                if (playerCell.id === chosenCell.id) {
                    return {...playerCell, isShot: true}
                }
                else {
                    return playerCell
                }
            })
    
            setPlayerCellData(newPlayerCellData)
        }
        else if (isFoundShipPart && !isFoundWay) {
            console.log("condition 2")
            // Shoot 4 cell around
            const getAroundList = [[0, 1], [-1, 0], [0, -1], [1, 0]]

            // Check if around cells are in the board
            // Check if around cells are shot

            let newPlayerCellData = ""

            for (let i = 0; i < getAroundList.length; i++) {
                const chosenCell = playerCellData.filter(playerCell => playerCell.positionX === prevCell.positionX + getAroundList[i][0] && playerCell.positionY === prevCell.positionY + getAroundList[i][1])[0]
                if (chosenCell.positionX < 10 && chosenCell.positionY < 10 && !chosenCell.isShot) {
                    newPlayerCellData = playerCellData.map(playerCell => {
                        if (playerCell.id === chosenCell.id) {
                            return {...playerCell, isShot: true}
                        }
                        else {
                            return playerCell
                        }
                    })

                    if (chosenCell.isShipPart) {
                        setIsFoundWay(true)
                    }

                    break
                }
            }

            setPlayerCellData(newPlayerCellData)
        }
        else if (isFoundShipPart && isFoundWay) {
            console.log("condition 3")

        }
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
                        shipData={shipData.filter(ship => !ship.isDeployed)}
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
                            UpdateComputerCellData={UpdateComputerCellData}
                            ShotOnBoardByComputer={ShotOnBoardByComputer} />
                    ) : (
                        <Inventory
                            direction={direction}
                            shipData={shipData.filter(ship => !ship.isDeployed)}
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