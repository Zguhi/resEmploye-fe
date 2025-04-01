import React from "react";
import "./TableStatus.css";

const TableStatus = ({ tables }) => (
    <div className="app__table-status">
        <h2>Table Status</h2>
        <ul>
            {tables.map((table) => (
                <li key={table.id} className={`table ${table.status}`}>
                    <div className="table-info">
                        <span>Table {table.number}</span>
                        <span>{table.status}</span>
                    </div>
                    {table.status === "occupied" && (
                        <div className="table-details">
                            <p>Order: {table.order.join(", ")}</p>
                            <p>
                                Date: {table.date} at {table.time}
                            </p>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    </div>
);

export default TableStatus;