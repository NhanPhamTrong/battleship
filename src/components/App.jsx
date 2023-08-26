import "./App.scss"
import { useState } from "react"
import { cellArray } from "./Data"

export const App = () => {
    const [isShooting, setIsShooting] = useState(false)
    // const [playerCellData, setPlayerCellData] = useState(() => {
    //     let data = []
    //     for (let i = 0; i < cellArray.length; i++) {
    //         cellArray[i].forEach(cell => {
    //             data.push({
    //                 id: i + "-" + cell,
    //                 isShipPart: false,
    //                 isShot: false
    //             })
    //         })
    //     }
    //     return data
    // })

    const ClickStart = () => {
        setIsShooting(true)
    }

    return (
        <>
            <header>
                <h1>Battleship</h1>
            </header>

            <main>
                <div className="main-header">
                    <button type="button" onClick={ClickStart}>Start</button>
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
                                        className={"cell " + cellListIndex + "-" + cell}
                                        style={{"top": cellListIndex * 48, "left": cell * 48}}></div>
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
                                            className={"cell " + cellListIndex + "-" + cell}
                                            style={{"top": cellListIndex * 48, "left": cell * 48}}></div>
                                    ))
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="deploy-section">
                            <h1>Inventory</h1>
                            <div className="direction-options">
                                <button id="horizontal" type="button">Horizontal</button>
                                <button id="vertical" type="button">Vertical</button>
                            </div>
                            <ul>
                                <li>
                                    <button id="carrier" type="button">Carrier</button>
                                </li>
                                <li>
                                    <button id="battleship" type="button">Battleship</button>
                                </li>
                                <li>
                                    <button id="cruiser" type="button">Cruiser</button>
                                </li>
                                <li>
                                    <button id="destroyer" type="button">Destroyer</button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="notification-modal">
                    <div className="modal-background"></div>
                    <div className="modal-container">
                        <p></p>
                    </div>
                </div>
            </main>
        </>
    )
}