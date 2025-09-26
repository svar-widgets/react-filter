import { useState, useMemo } from 'react';
import { getData } from '../data';
import { FilterBuilder } from '../../src';
import './FilterBuilderConvertDates.css';

export default function FilterBuilderConvertDates() {
  const { fields, options } = useMemo(() => getData(), []);

  const initialValue = {
    glue: 'or',
    rules: [
      {
        field: 'start',
        filter: 'greater',
        value: '2024-11-01',
      },
      {
        field: 'end',
        filter: 'less',
        value: '2025-05-01',
      },
    ],
  };

  const [value] = useState(() => convertDates(initialValue, prepareDateValue));
  const [filterValue, setFilterValue] = useState('');

  function init(api) {
    api.on('change', ({ value }) => {
      const v = convertDates(value, prepareStringValue);
      setFilterValue(JSON.stringify(v, null, 2));
    });
  }

  function convertDates(value, cb) {
    if (!value?.rules) return value;

    return {
      ...value,
      rules: value.rules.map((rule) => {
        if (rule.rules) return convertDates(rule, cb);

        if (rule.field) {
          let type = rule.type;
          if (!type) type = fields.find((f) => f.id === rule.field).type;

          if (type === 'date' && rule.value)
            return {
              ...rule,
              value: cb(rule.value),
            };

          return rule;
        }
      }),
    };
  }

  function prepareDateValue(value) {
    if (typeof value === 'object') {
      const { start, end } = value;
      return {
        start: new Date(start),
        end: new Date(end),
      };
    } else return new Date(value);
  }

  function prepareStringValue(value) {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'object') {
      const { start, end } = value;
      return {
        start: start.toISOString(),
        end: end.toISOString(),
      };
    }
  }

  return (
    <div className="wx-Q6e9nIo1 demo">
      <h4 style={{ margin: '20px 20px 0 20px' }}>
        Convert date strings to date objects before passing to FilterBuilder and
        back after changes
      </h4>
      <div className="wx-Q6e9nIo1 layout">
        <div className="wx-Q6e9nIo1 filter">
          <FilterBuilder
            value={value}
            fields={fields}
            options={options}
            init={init}
          />
        </div>
        <div className="wx-Q6e9nIo1 filter-value">
          {filterValue ? <pre>{filterValue}</pre> : null}
        </div>
      </div>
    </div>
  );
}
