import { useState, useMemo } from 'react';
import { getData } from '../data';
import { FilterQuery, createArrayFilter, getQueryHtml, getQueryString } from '../../src';
import List from '../custom/List.jsx';
import './FilterQueryNaturalText.css';

function FilterQueryNaturalText() {
  const { fields, data } = useMemo(() => getData(), []);

  const [filteredData, setFilteredData] = useState(data);
  const [filterConfig, setFilterConfig] = useState(null);

  const queryHTML = useMemo(
    () =>
      filterConfig
        ? getQueryHtml(getQueryString(filterConfig).query, { fields })
        : '',
    [filterConfig, fields],
  );

  async function handleFilter({ text, startProgress, endProgress }) {
    if (!text) {
      setFilterConfig(null);
      setFilteredData(data);
      return;
    }
    try {
      startProgress();
      const val = await text2filter(text, fields);
      if (val) {
        setFilterConfig(val);
        const filter = createArrayFilter(val);
        setFilteredData(filter(data));
      }
    } finally {
      endProgress();
    }
  }

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

  return (
    <div className="wx-aabqUu3e demo">
      <h4
        className="wx-aabqUu3e"
        style={{ margin: '20px 20px 0 20px' }}
      >
        Filtering by text prompt
      </h4>
      <div className="wx-aabqUu3e natural-input">
        <FilterQuery
          placeholder="e.g., first name contains Alex and age greater than 30"
          onChange={handleFilter}
          parse="none"
        />
        <div
          className="wx-aabqUu3e rules"
          dangerouslySetInnerHTML={{ __html: queryHTML || '\u00a0' }}
        />
        <p className="wx-aabqUu3e hint">
          Type filter conditions in natural language. Examples:
        </p>
        <ul className="wx-aabqUu3e examples">
          <li className="wx-aabqUu3e">Alex, below forty</li>
          <li className="wx-aabqUu3e">age greater than 30 from USA</li>
          <li className="wx-aabqUu3e">started in last two years</li>
        </ul>
      </div>
      <div className="wx-aabqUu3e layout">
        <div className="wx-aabqUu3e list">
          <List data={filteredData} />
        </div>
      </div>
    </div>
  );
}

export default FilterQueryNaturalText;
