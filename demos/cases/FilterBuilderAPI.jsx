import { useState, useRef, useCallback, useMemo } from 'react';
import { getData } from '../data';
import { FilterBuilder } from '../../src';
import { Button } from '@svar-ui/react-core';
import './FilterBuilderAPI.css';

function FilterBuilderAPI() {
  const { value, fields, options } = useMemo(() => getData(), []);
  const api = useRef(null);

  const [filterValue, setFilterValue] = useState('');

  const noEditLogic = useCallback(
    (apiInstance) => {
      apiInstance.intercept('add-rule', (ev) => {
        ev.edit = false;
      });
      apiInstance.intercept('add-group', (ev) => {
        ev.edit = false;
      });
      apiInstance.on('change', () => {
        setFilterValue('');
      });
    },
    [setFilterValue],
  );

  const showValue = useCallback(() => {
    const instance = api.current;
    if (!instance) return;
    const value = instance.getValue();
    setFilterValue(JSON.stringify(value, null, 2));
  }, []);

  return (
    <>
      <h4 style={{ margin: '20px 20px 0 20px' }}>
        Click "Add filter" to add a rule. Double-click the rule to edit it
      </h4>
      <div className="wx-oploTRYQ toolbar">
        <Button type="secondary" onClick={showValue}>
          Show value
        </Button>
      </div>
      <div className="wx-oploTRYQ main">
        <div className="wx-oploTRYQ filter">
          <FilterBuilder
            ref={api}
            value={value}
            fields={fields}
            options={options}
            init={noEditLogic}
          />
        </div>
        <div className="wx-oploTRYQ filter-value">
          {filterValue ? <pre>{filterValue}</pre> : null}
        </div>
      </div>
    </>
  );
}

export default FilterBuilderAPI;
