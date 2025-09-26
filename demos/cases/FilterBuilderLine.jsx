import { useMemo, useState, useCallback } from 'react';
import { getData } from '../data';
import List from '../custom/List.jsx';
import { FilterBuilder, createArrayFilter } from '../../src';

export default function FilterBuilderLine() {
  const { value, fields, options, data } = useMemo(() => getData(), []);

  const [filteredData, setFilteredData] = useState(() => {
    const filter = createArrayFilter(value);
    return filter(data);
  });

  const applyFilter = useCallback(
    (val) => {
      const filter = createArrayFilter(val);
      setFilteredData(filter(data));
    },
    [data],
  );

  return (
    <>
      <h4 style={{ margin: '20px 20px 0 20px' }}>
        Double-click any element to edit filtering conditions
      </h4>
      <div style={{ padding: '0 20px' }}>
        <FilterBuilder
          value={value}
          fields={fields}
          options={options}
          type="line"
          onChange={({ value }) => applyFilter(value)}
        />
        <List data={filteredData} />
      </div>
    </>
  );
}
