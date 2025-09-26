import { useMemo, useState } from 'react';
import { getData } from '../data';
import { FilterBuilder, createArrayFilter, getOptionsMap } from '../../src';

export default function FilterBuilderDates() {
  const { fields, data } = useMemo(() => getData(), []);

  const value1 = useMemo(
    () => ({
      rules: [
        {
          field: 'start',
          filter: 'greater',
          type: 'date',
          value: new Date('2024-10-14'),
        },
      ],
    }),
    [],
  );

  const fields2 = useMemo(() => {
    const f = [...fields];
    f[4] = {
      id: 'start',
      label: 'Start Date',
      type: 'date',
      format: '%m/%Y',
    };
    return f;
  }, [fields]);

  const value2 = useMemo(
    () => ({
      rules: [
        {
          field: 'start',
          filter: 'greater',
          type: 'date',
          value: new Date('2024-10-1'),
        },
      ],
    }),
    [],
  );

  const fields3 = useMemo(() => {
    const f = [...fields];
    f[4] = {
      id: 'start',
      label: 'Start Date (year)',
      type: 'number',
      predicate: 'year',
    };
    return f;
  }, [fields]);

  const value3 = useMemo(
    () => ({
      rules: [
        {
          field: 'start',
          filter: 'greater',
          type: 'number',
          value: 2024,
        },
      ],
    }),
    [],
  );

  const fields4 = useMemo(() => {
    const f = [...fields];
    f[4] = {
      id: 'start',
      label: 'Start Date (month)',
      type: 'number',
      predicate: 'month',
    };
    return f;
  }, [fields]);

  const value4 = useMemo(
    () => ({
      rules: [
        {
          field: 'start',
          filter: 'greater',
          type: 'number',
          value: 10,
        },
      ],
    }),
    [],
  );

  const value5 = useMemo(
    () => ({
      rules: [
        {
          field: 'start',
          filter: 'between',
          type: 'date',
          value: {
            start: new Date('2024-11-01'),
            end: new Date('2025-05-01'),
          },
        },
      ],
    }),
    [],
  );

  function countFilter(v) {
    return createArrayFilter(v)(data).length;
  }

  const [c1, setC1] = useState(countFilter(value1));
  const [c2, setC2] = useState(countFilter(value2));
  const [c3, setC3] = useState(countFilter(value3));
  const [c4, setC4] = useState(countFilter(value4));
  const [c5, setC5] = useState(countFilter(value5));

  return (
    <div style={{ padding: '0 20px 20px 20px' }}>
      <h4>Date filter thats displays a full date</h4>
      <FilterBuilder
        value={value1}
        fields={fields}
        options={getOptionsMap(data)}
        type={'simple'}
        onChange={({ value }) => setC1(countFilter(value))}
      />
      <p>{c1} result(s)</p>

      <h4>Date filter with a formatted date</h4>
      <FilterBuilder
        value={value2}
        fields={fields2}
        options={getOptionsMap(data)}
        type={'simple'}
        onChange={({ value }) => setC2(countFilter(value))}
      />
      <p>{c2} result(s)</p>

      <h4>Number filter with "year" predicate</h4>
      <FilterBuilder
        value={value3}
        fields={fields3}
        options={getOptionsMap(data, fields3)}
        type={'simple'}
        onChange={({ value }) => setC3(countFilter(value))}
      />
      <p>{c3} result(s)</p>

      <h4>Number filter with "month" predicate</h4>
      <FilterBuilder
        value={value4}
        fields={fields4}
        options={getOptionsMap(data, fields4)}
        type={'simple'}
        onChange={({ value }) => setC4(countFilter(value))}
      />
      <p>{c4} result(s)</p>

      <h4>Date filter with "between" condition allows to set a date range</h4>
      <FilterBuilder
        value={value5}
        fields={fields}
        options={getOptionsMap(data)}
        type={'simple'}
        onChange={({ value }) => setC5(countFilter(value))}
      />
      <p>{c5} result(s)</p>
    </div>
  );
}
