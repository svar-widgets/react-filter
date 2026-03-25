import { useState, useMemo, useCallback } from 'react';
import { getData } from '../data';
import List from '../custom/List.jsx';
import { FilterQuery, createArrayFilter } from '../../src';
import './FilterQuery.css';

function FilterQueryDemo() {
  const initial = useMemo(() => getData(), []);
  const [fields] = useState(initial.fields);
  const [options] = useState(initial.options);
  const [data] = useState(initial.data);

  const optionsWithTags = useMemo(
    () => ({
      ...options,
      status: ['urgent', 'todo', 'review', 'done', 'blocked'],
    }),
    [options],
  );

  const [value] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const handleFilter = useCallback(
    ({ value, error }) => {
      if (error) {
        console.warn(error.message);
        if (error.code !== 'NO_DATA') return;
      }

      const filter = createArrayFilter(value, {}, fields);
      setFilteredData(filter(data));
    },
    [data, fields],
  );

  return (
    <div className="wx-aabtU8Io demo">
      <h4
        className="wx-aabtU8Io"
        style={{ margin: '20px 20px 0 20px' }}
      >
        Fitlering by query syntax
      </h4>
      <div className="wx-aabtU8Io natural-input">
        <FilterQuery
          value={value}
          placeholder="e.g., FirstName: Alex or #urgent"
          fields={[...fields]}
          options={optionsWithTags}
          onChange={handleFilter}
        />
        <p className="wx-aabtU8Io hint">
          Type filter conditions using query syntax. Examples:
        </p>
        <ul className="wx-aabtU8Io examples">
          <li className="wx-aabtU8Io">FirstName: *Alex*</li>
          <li className="wx-aabtU8Io">Age: &gt;30 and Country: USA</li>
          <li className="wx-aabtU8Io">#urgent or #todo</li>
          <li className="wx-aabtU8Io">Type free text to search all fields</li>
        </ul>
      </div>
      <div className="wx-aabtU8Io layout">
        <div className="wx-aabtU8Io list">
          <List data={filteredData} />
        </div>
      </div>
    </div>
  );
}

export default FilterQueryDemo;
