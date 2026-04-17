export default function List({branches}) {
  return (
    <div>
        {branches?.length <= 0 && <h2>No nearby branches found</h2>}
        {branches.map((branch, i) => {
            return ( <div key={i}>
                <h3>{branch.name}</h3>
                <p>{branch.distance} KM away from your selected address</p>
                <div>
                    Address:
                    <p>{branch.address}</p>
                </div>
            </div>
            );
        })}
    </div>
  )
}
