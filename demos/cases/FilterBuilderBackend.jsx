import { useCallback, useEffect, useMemo, useState } from 'react';
import { getData } from '../data';
import { FilterBuilder } from '../../src';
import './FilterBuilderBackend.css';

const scope = 'wx-BOeTX3Jq';

export default function FilterBuilderBackend() {
  const initial = useMemo(() => getData(), []);
  const { backendFields: fields, columns } = initial;
  const server = 'https://master--svar-query-go--dev.webix.io/api/data/persons';

  const [value] = useState(initial.backendValue);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadFilteredData(initial.backendValue);
  }, []);

  async function loadFilteredData(filterValue) {
    const response = await fetch(`${server}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filterValue),
    });

    const json = await response.json();
    setData(json);
  }

  const provideOptions = useCallback(
    async (fieldId) => {
      const response = await fetch(`${server}/${fieldId}/suggest`);
      let options = await response.json();

      const field = fields.find((f) => f.id === fieldId);
      if (field?.type === 'date') {
        options = options.map((val) => new Date(val));
      }

      return options;
    },
    [fields],
  );

  function formatValue(cellValue, column) {
    if (column.template) {
      return column.template(cellValue);
    }
    return cellValue;
  }

  return (
    <div className={`${scope} demo`}>
      <h4 style={{ margin: '20px 20px 0 20px' }}>
        Filtering server-side data with the rules created by FilterBuilder on
        the client-side
      </h4>
      <div className="layout">
        <div className="filter">
          <FilterBuilder
            fields={fields}
            value={value}
            options={provideOptions}
            onChange={({ value }) => loadFilteredData(value)}
          />
        </div>
        <div className="table-container">
          {data.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.id}>{column.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    {columns.map((column) => (
                      <td key={column.id}>
                        {formatValue(row[column.id], column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
