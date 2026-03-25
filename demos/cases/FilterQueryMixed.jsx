import { useState, useMemo } from 'react';
import { getData } from '../data';
import { FilterQuery, createArrayFilter, getQueryString } from '../../src';
import List from '../custom/List.jsx';
import './FilterQueryMixed.css';

function FilterQueryMixed() {
  const initial = useMemo(() => getData(), []);
  const [fields] = useState(initial.fields);
  const [options] = useState(initial.options);
  const [data] = useState(initial.data);

  const [textValue, setTextValue] = useState('start: 2024');
  const [filteredData, setFilteredData] = useState(initial.data);

  const url =
    'https://master--svar-filter-natural-text--dev.webix.io/text-to-json';

  async function text2filter(text, fields) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ text, fields }),
    });
    const json = await response.json();
    if (!response.ok) {
      console.warn(json.error || 'Request failed');
      return null;
    }
    return json;
  }

  async function handleFilter({ value, error, text, startProgress, endProgress }) {
    if (text) {
      error = null;
      try {
        startProgress();
        value = await text2filter(text, fields);
        setTextValue(value ? getQueryString(value).query : '');
      } catch (e) {
        error = e;
      } finally {
        endProgress();
      }
    }

    if (error) {
      console.warn(error.message);
      if (error.code !== 'NO_DATA') return;
    }

    const filter = createArrayFilter(value, {}, fields);
    setFilteredData(filter(data));
  }

  return (
    <div className="wx-aadJJBh7 demo">
      <h4 className="wx-aadJJBh7" style={{ margin: '20px 20px 0 20px' }}>
        Filtering by query syntax or by text prompt
      </h4>
      <div className="wx-aadJJBh7 natural-input">
        <FilterQuery
          value={textValue}
          placeholder="e.g., FirstName: contains Alex and Age: >30"
          fields={fields}
          options={options}
          onChange={handleFilter}
        />
        <p className="wx-aadJJBh7 hint">
          Type filter conditions using query syntax. Examples:
        </p>
        <ul className="wx-aadJJBh7 examples">
          <li className="wx-aadJJBh7">FirstName: *Alex*</li>
          <li className="wx-aadJJBh7">Age: &gt;30 and Country: USA</li>
          <li className="wx-aadJJBh7">StartDate: 2024-01-01 .. 2025-12-31</li>
          <li className="wx-aadJJBh7">FirstName: John, Jane, Alex</li>
        </ul>
      </div>
      <div className="wx-aadJJBh7 layout">
        <div className="wx-aadJJBh7 list">
          <List data={filteredData} />
        </div>
      </div>
    </div>
  );
}

export default FilterQueryMixed;
