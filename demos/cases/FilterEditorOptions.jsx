import { useMemo, useState } from 'react';
import { getData } from '../data';
import { FilterEditor, getOptions } from '../../src';
import { en } from '@svar-ui/core-locales';
import './FilterEditorOptions.css';

export default function FilterEditorOptions() {
  const { data } = useMemo(() => getData(), []);
  const [textValue, setTextValue] = useState();

  const options = useMemo(
    () =>
      getOptions(data, 'start', {
        predicate: 'month',
        sort: (a, b) => a - b,
      }),
    [data],
  );

  const numberToMonth = (v) => en.calendar.monthFull[v];

  const updateTextValue = ({ rule }) =>
    setTextValue(JSON.stringify(rule, null, 2));

  return (
    <>
      <h4 style={{ margin: '20px 20px 0 20px' }}>
        Tuple numeric filter with formatted options
      </h4>
      <div className="wx-SRehrBSE area">
        <div className="wx-SRehrBSE box">
          <FilterEditor
            field="start"
            options={options}
            format={numberToMonth}
            filter="greater"
            type="tuple"
            onApply={updateTextValue}
          />
        </div>
        <div className="wx-SRehrBSE log">
          <pre>{textValue || ''}</pre>
        </div>
      </div>
    </>
  );
}
