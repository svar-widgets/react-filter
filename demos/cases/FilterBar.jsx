import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { getData } from '../data';
import { FilterBar as InnerFilterBar, createArrayFilter } from '../../src';
import List from '../custom/List.jsx';

function FilterBar() {
  const { options, data } = useMemo(() => getData(), []);
  const [filteredData, setFilteredData] = useState(data);

  const applyFilter = useCallback(
    (value) => {
      const filter = createArrayFilter(value);
      setFilteredData(filter(data));
    },
    [data],
  );

  const value = useMemo(
    () => ({
      rules: [{ field: 'country', filter: 'equal', value: 'USA' }],
    }),
    [],
  );

  const fields = useRef([
    'last_name',
    {
      type: 'number',
      id: 'age',
    },
    {
      type: 'text',
      id: 'country',
      options: options.country,
      value: 'USA',
    },
  ]);

  useEffect(() => {
    applyFilter(value);
  }, [applyFilter, value]);

  return (
    <>
      <h4 style={{ margin: '20px 20px 0 20px' }}>
        Fill in the inputs to edit filtering conditions
      </h4>
      <div style={{ padding: '0 20px' }}>
        <InnerFilterBar
          fields={fields.current}
          onChange={({ value }) => applyFilter(value)}
        />
        <List data={filteredData} />
      </div>
    </>
  );
}

export default FilterBar;
