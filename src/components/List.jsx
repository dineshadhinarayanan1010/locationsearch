import { useState } from 'react'

export default function List({branches, onSelect}) {
    const [selected, setSelected] = useState(null);

    const handleChange = (branch) => {
        setSelected(branch.id);
        onSelect(branch);
    };
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
                    checked={selected === branch.id}
                    onChange={() => handleChange(branch)}
                />
                <div className="branch-name">{branch.name}</div>
            </div>
            <div className="branch-details">
                <div className="branch-distance">{branch.distance} KM away from your selected address</div>
                <div className="branch-address">
                    <b>Address: </b>{branch.address}
                </div>
            </div>

            </label>
        ))}
    </div>
  )
}
