import './List.css';

function List({ data = [] }) {
  return (
    <div className="wx-lB5JV3gP block">
      {data.map((row) => (
        <div key={row.id} className="wx-lB5JV3gP row">
          <h3>
            {row.first_name} {row.last_name}
          </h3>
          <p>Age: {row.age}</p>
        </div>
      ))}
    </div>
  );
}

export default List;
