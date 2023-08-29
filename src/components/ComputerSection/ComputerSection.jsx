import "./ComputerSection.scss"

export const ComputerSection = (props) => {
    const ShotOnBoard = (e) => {
        const chosenCell = props.computerCellData.filter(cell => cell.id === e.currentTarget.getAttribute("name"))[0]

        if (!chosenCell.isShot) {
            let newComputerCellData = props.computerCellData.map(computerCell => {
                if (computerCell.id === chosenCell.id) {
                    return {...computerCell, isShot: true}
                }
                else {
                    return computerCell
                }
            })
    
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
                        const CheckIsShipPart = props.computerCellData.filter(computerCell => computerCell.id === cellListIndex + "-" + cellIndex)[0].isShipPart
                        const CheckIsShot = props.computerCellData.filter(computerCell => computerCell.id === cellListIndex + "-" + cellIndex)[0].isShot

                        return (
                            <div
                                key={cellListIndex + "-" + cellIndex}
                                className={"cell " +
                                    cellListIndex + "-" + cell +
                                    (CheckIsShipPart ? " ship" : "") +
                                    (CheckIsShot ? " shot" : "")}
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