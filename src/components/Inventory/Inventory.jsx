import "./Inventory.scss"

export const Inventory = (props) => {
    const ChooseDirection = (e) => {
        props.ChooseDirection(e.currentTarget.getAttribute("id"))
    }

    const ChooseShip = (e) => {
        props.ChooseShip(e.currentTarget.getAttribute("id"))
    }

    return (
        <div className="inventory">
            <h1>Inventory</h1>
            <div className="direction-options">
                <button
                    id="horizontal"
                    className={props.direction.isHorizontal && props.direction.isChosen ? "active" : ""}
                    type="button"
                    onClick={ChooseDirection}
                >
                    Horizontal
                </button>
                <button
                    id="vertical"
                    className={!props.direction.isHorizontal && props.direction.isChosen ? "active" : ""}
                    type="button"
                    onClick={ChooseDirection}
                >
                    Vertical
                </button>
            </div>
            <ul>
                {props.shipData.map((ship, index) => (
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
    )
}