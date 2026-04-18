import { useState } from 'react'

export default function List({branches, selectedId, onSelect}) {
  return (
    <div className="branch-list">
        <div className="branch-count">
            {branches.length} branches near your selected address
        </div>
        {branches.map((branch) => (
            <label key={branch.id} className="branch-item">
            <div className="branch-header">
                <input
                    type="radio"
                    name="branch"
                    checked={selectedId === branch.id}
                    onChange={() => onSelect(branch)}
                />
                <div className="branch-name">{branch.name}</div>
            </div>
            <div className="branch-details">
                <div className="branch-distance">{branch.distance.toFixed(2)} KM away from your selected address</div>
                <div className="branch-address">
                    <b>Address: </b>{branch.address}
                    <br/>
                    <b>Banking Hours: </b><strong>{branch.bankingHours.days}</strong><br />
                        <span>{branch.bankingHours.hours}</span>
                </div>
            </div>

            </label>
        ))}
    </div>
  )
}
