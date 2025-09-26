import { useState, useMemo, useCallback } from 'react';
import { getData } from '../data';
import List from '../custom/List.jsx';
import { FilterBuilder, createArrayFilter } from '../../src';
import './FilterBuilderBasic.css';

function FilterBuilderBasic() {
  const initial = useMemo(() => getData(), []);
  const [value] = useState(initial.value);
  const [fields] = useState(initial.fields);
  const [options] = useState(initial.options);
  const [data] = useState(initial.data);

  const [filteredData, setFilteredData] = useState(() => {
    const filter = createArrayFilter(initial.value);
    return filter(initial.data);
    // apply initial filter state
  });

  const applyFilter = useCallback(
    (val) => {
      const filter = createArrayFilter(val);
      setFilteredData(filter(data));
    },
    [data],
  );

  return (
    <div className="wx-VUxJSFKA demo">
      <h4 style={{ margin: '20px 20px 0 20px' }}>
        Double-click any line to edit filtering conditions
      </h4>
      <div className="wx-VUxJSFKA layout">
        <div className="wx-VUxJSFKA filter">
          <FilterBuilder
            value={value}
            fields={fields}
            options={options}
            onChange={({ value }) => applyFilter(value)}
          />
        </div>
        <div className="wx-VUxJSFKA list">
          <List data={filteredData} />
        </div>
      </div>
    </div>
  );
}

export default FilterBuilderBasic;
