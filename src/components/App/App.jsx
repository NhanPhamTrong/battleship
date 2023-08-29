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
                    id: cell + "-" + i,
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
                    id: cell + "-" + i,
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

    const [score, setScore] = useState({
        player: 0,
        computer: 0
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

    const UpdateScore = (number) => {
        console.log(number)
        setScore(prevValue => ({
            player: number,
            computer: prevValue.computer
        }))

        console.log(score)
    }

    const UpdateResult = (content) => {
        setModal({
            isPopModal: true,
            content: content
        })
    }

    const ChooseCellToDeployByComputer = () => {
        const isHorizontal = [false, true][Math.floor(Math.random() * 2)]
        let newComputerCellData = computerCellData
        let newShipData = shipData

        for (let i = 2; i < 6; i++) {
            let randomPositionX = Math.floor(Math.random() * (isHorizontal ? (10 - i) : 10))
            let randomPositionY = Math.floor(Math.random() * (!isHorizontal ? (10 - i) : 10))
            const data = newComputerCellData

            const CheckIfStackedUp = (shipSize) => {
                let mark = 0
                const firstAxis = isHorizontal ? "positionX" : "positionY"
                const secondAxis = isHorizontal ? "positionY" : "positionX"
                const TempChosenCell = data.filter(cell => cell.positionX === randomPositionX && cell.positionY === randomPositionY)[0]
                for (let j = 0; j < shipSize; j++) {
                    mark += data.filter(computerCell =>
                        computerCell[firstAxis] === TempChosenCell[firstAxis] + j && computerCell[secondAxis] === TempChosenCell[secondAxis])[0].isShipPart ? 1 : 0
                }
                return !(mark === 0)
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
                for (let j = 0; j < i; j++) {
                    if (GetCondition(computerCell, j)) {
                        return {...computerCell, isShipPart: true, size: i}
                    }
                }
                return computerCell
            })

            const computerShipCellList = newComputerCellData.filter(computerCell => computerCell.size === i)
            newShipData = newShipData.map(ship => ship.size === i ? {...ship, computerShipCellList: computerShipCellList} : ship)
        }

        setShipData(newShipData)
        setComputerCellData(newComputerCellData)
    }

    const ShotOnBoardByComputer = () => {
        // shoot randomly at first (DONE)
        // BONUS
        // when found 1 ship's part, shoot 4 cell around
        // while shooting around, if computer find 1 more ship's part, it'll shoot at that way

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

        let newPlayerCellData = playerCellData.map(playerCell => {
            if (playerCell.id === chosenCell.id) {
                return {...playerCell, isShot: true}
            }
            else {
                return playerCell
            }
        })

        for (let i = 2; i < 6; i++) {
            let countDestroyedCell = 0
            newPlayerCellData.forEach(playerCell => {
                if (playerCell.size === i && playerCell.isShipPart && playerCell.isShot) {
                    countDestroyedCell += 1
                }
            })

            if (countDestroyedCell === i) {
                newPlayerCellData = newPlayerCellData.map(playerCell => {
                    return playerCell.size === i ? {...playerCell, isSunk: true} : playerCell
                })
            }
        }

        if (newPlayerCellData.filter(playerCell => playerCell.isSunk).length === 14) {
            UpdateResult("Computer wins!")
        }

        setScore(prevValue => ({
            player: prevValue.player,
            computer: newPlayerCellData.filter(playerCell => playerCell.isShipPart && playerCell.isShot).length
        }))

        setPlayerCellData(newPlayerCellData)
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
                            <h1>{score.player}</h1>
                        </div>
                        <div className="computer">
                            <p>Computer</p>
                            <h1>{score.computer}</h1>
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
                            shipData={shipData}
                            isShooting={isShooting}
                            UpdateComputerCellData={UpdateComputerCellData}
                            UpdateScore={UpdateScore}
                            UpdateResult={UpdateResult}
                            ShotOnBoardByComputer={ShotOnBoardByComputer} />
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