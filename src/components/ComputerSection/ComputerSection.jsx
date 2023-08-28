export const ComputerSection = (props) => {
    return (
        <div className="computer-section">
            <h1>Computer Board</h1>
            <div className="board">
                {props.cellArray.map((cellList, cellListIndex) => {
                    return cellList.map((cell, cellIndex) => (
                        <div
                            key={cellListIndex + "-" + cellIndex}
                            className={"cell " +
                                cellListIndex + "-" + cell +
                                (props.computerCellData.filter(computerCell => computerCell.id === cellListIndex + "-" + cellIndex)[0].isShipPart ? " ship" : "")}
                            name={cellListIndex + "-" + cellIndex}
                            style={{"top": cellListIndex * 48, "left": cell * 48}}></div>
                    ))
                })}
            </div>
        </div>
    )
}