import { useEffect, useMemo, useState } from 'react';
import { getData } from '../data';
// MK: enable after Grid is published
// import { Grid } from "@svar-ui/react-grid";
import { FilterBuilder } from '../../src';
import './FilterBuilderBackend.css';

export default function FilterBuilderBackend() {
  const { backendFields: fields, backendValue: value } = useMemo(
    () => getData(),
    [],
  );
  const server = 'https://master--svar-query-go--dev.webix.io/api/data/persons';

  const [data, setData] = useState([]);

  useEffect(() => {
    loadFilteredData(value);
  }, []);

  async function loadFilteredData(value) {
    const response = await fetch(`${server}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    });

    const json = await response.json();
    setData(json);
  }

  async function provideOptions(fieldId) {
    const response = await fetch(`${server}/${fieldId}/suggest`);
    let options = await response.json();

    const field = fields.find((f) => f.id === fieldId);
    if (field.type === 'date') {
      options = options.map((value) => new Date(value));
    }

    return options;
  }

  return (
    <div className="wx-BOeTX3Jq demo">
      <h4 style={{ margin: '20px 20px 0 20px' }}>
        Filtering server-side data with the rules created by FilterBuilder on
        the client-side
      </h4>
      <div className="wx-BOeTX3Jq layout">
        <div className="wx-BOeTX3Jq filter">
          <FilterBuilder
            fields={fields}
            value={value}
            options={provideOptions}
            onChange={({ value }) => loadFilteredData(value)}
          />
        </div>
        <div className="wx-BOeTX3Jq grid">
          {/* <Grid data={data} columns={columns} /> */}
          <div>Grid is not published yet</div>
          {data}
        </div>
      </div>
    </div>
  );
}
