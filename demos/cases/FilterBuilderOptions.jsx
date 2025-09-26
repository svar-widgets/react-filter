import { useState, useEffect, useMemo, useCallback } from 'react';
import { getData } from '../data';
import List from '../custom/List.jsx';
import { FilterBuilder, createArrayFilter } from '../../src';
import './FilterBuilderOptions.css';

export default function FilterBuilderOptions() {
  const initial = useMemo(() => getData(), []);
  const [fields] = useState(initial.fields);
  const [data] = useState(initial.data);

  const options = useMemo(() => getData().options, []);

  const value = useMemo(
    () => ({
      glue: 'or',
      rules: [
        {
          field: 'first_name',
          filter: 'equal',
          type: 'text',
          value: 'Alex',
        },
        {
          field: 'first_name',
          filter: 'contains',
          type: 'text',
          value: 'D',
        },
      ],
    }),
    [],
  );

  const [filteredData, setFilteredData] = useState(data);

  const applyFilter = useCallback(
    (value) => {
      const filter = createArrayFilter(value);
      setFilteredData(filter(data));
    },
    [data],
  );

  const provideOptions = useCallback(
    async (fieldId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return options[fieldId] || [];
    },
    [options],
  );

  useEffect(() => {
    // apply initial filter state
    applyFilter(value);
  }, []); // run once on mount

  return (
    <div className="wx-hRQ2ERgk demo">
      <h4 style={{ margin: '20px 20px 0 20px' }}>
        Double-click any element to edit filtering conditions. Field options
        will be loaded on demand
      </h4>
      <div className="wx-hRQ2ERgk layout">
        <div className="wx-hRQ2ERgk filter">
          <FilterBuilder
            fields={fields}
            value={value}
            options={provideOptions}
            onChange={({ value }) => applyFilter(value)}
          />
        </div>
        <div className="wx-hRQ2ERgk list">
          <List data={filteredData} />
        </div>
      </div>
    </div>
  );
}
