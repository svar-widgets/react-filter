import { useState, useMemo, useCallback } from 'react';
import { getData } from '../data';
import { Button } from '@svar-ui/react-core';
import { FilterEditor } from '../../src';
import './FilterEditorEvents.css';

function FilterEditorEvents() {
  const { options } = useMemo(() => getData(), []);

  const [ruleValue, setRuleValue] = useState({});
  const [textValue, setTextValue] = useState();
  const [counter, setCounter] = useState(0);

  const setValue = useCallback((rule) => {
    setRuleValue(rule);
    setTextValue(JSON.stringify(rule, null, 2));
  }, []);

  const updateTextValue = useCallback((ev) => {
    setCounter((c) => c + 1);
    const newValue = ev.value;
    setTextValue(JSON.stringify(newValue, null, 2));
  }, []);

  return (
    <>
      <h4 style={{ margin: '20px 20px 0 20px' }}>
        Set any value and track its changes
      </h4>
      <div className="wx-aKC6Abp5 area">
        <div className="wx-aKC6Abp5 toolbar">
          <Button
            onClick={() =>
              setValue({
                filter: 'beginsWith',
                value: 'A',
                includes: ['Alex'],
              })
            }
          >
            Value 1
          </Button>
          <Button
            onClick={() => setValue({ filter: 'beginsWith', value: 'B' })}
          >
            Value 2
          </Button>
          <Button onClick={() => setValue({ includes: ['Agata'] })}>
            Value 3
          </Button>
          <Button onClick={() => setValue({})}>Reset</Button>
        </div>

        <div className="wx-aKC6Abp5 box">
          <FilterEditor
            buttons={false}
            options={options.first_name}
            type="text"
            onChange={updateTextValue}
            includes={ruleValue.includes}
            filter={ruleValue.filter}
            value={ruleValue.value}
          />
        </div>
        <div className="wx-aKC6Abp5 log">
          {counter} updates
          <pre>{textValue || ''}</pre>
        </div>
      </div>
    </>
  );
}

export default FilterEditorEvents;
