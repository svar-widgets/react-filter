import { useMemo, useState, useRef } from 'react';
import { getData } from '../data';
import { FilterBar, createArrayFilter } from '../../src';
import List from '../custom/List.jsx';

export default function FilterBarCombined() {
  const { options, data } = useMemo(() => getData(), []);

  const value1 = {
    rules: [{ field: 'country', filter: 'equal', value: 'USA' }],
  };

  const value2 = {
    rules: [{ field: 'first_name', filter: 'contains', value: 'A' }],
  };

  const [filteredData1, setFilteredData1] = useState(() => {
    const filter = createArrayFilter(value1);
    return filter(data);
  });

  const [filteredData2, setFilteredData2] = useState(() => {
    const filter = createArrayFilter(value2);
    return filter(data);
  });

  function applyFilter1(value) {
    const filter = createArrayFilter(value);
    setFilteredData1(filter(data));
  }

  function applyFilter2(value) {
    const filter = createArrayFilter(value);
    setFilteredData2(filter(data));
  }

  const fields1 = useRef([
    {
      type: 'text',
      id: 'country',
      label: 'Filter by country',
      placeholder: 'Select country',
      options: options.country,
      value: 'USA',
    },
    {
      type: 'all',
      label: 'Filter by many fields',
      by: ['age', 'first_name', 'last_name'],
    },
  ]);

  const fields2 = useRef([
    {
      type: 'number',
      id: 'age',
      filter: 'greater',
      options: options.age,
      placeholder: 'Older than.. ',
      label: 'Age',
    },
    {
      type: 'dynamic',
      label: 'Select a field to filter',
      by: [
        {
          id: 'first_name',
          type: 'text',
          filter: 'contains',
          value: 'A',
          placeholder: 'Enter first name',
        },
        'last_name',
        {
          type: 'text',
          id: 'country',
          options: options.country,
          value: 'USA',
        },
        {
          type: 'date',
          filter: 'greater',
          id: 'start',
          value: new Date('2025-01-01'),
        },
      ],
    },
  ]);

  return (
    <div style={{ padding: '0 20px 20px 20px' }}>
      <h4 style={{ margin: '20px 20px 0 0' }}>
        Use a single text field to filter by "age", "first_name" and "last_name"
      </h4>
      <FilterBar
        fields={fields1.current}
        onChange={({ value }) => applyFilter1(value)}
      />
      <List data={filteredData1} />
      <h4 style={{ margin: '20px 20px 0 0' }}>
        Select a field ("first_name", "last_name", "country", "start") for
        filtering
      </h4>
      <FilterBar
        fields={fields2.current}
        onChange={({ value }) => applyFilter2(value)}
      />
      <List data={filteredData2} />
    </div>
  );
}
