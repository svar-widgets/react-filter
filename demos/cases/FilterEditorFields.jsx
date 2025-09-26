import { useMemo } from 'react';
import { getData } from '../data';
import { Field } from '@svar-ui/react-core';
import { FilterEditor } from '../../src';
import './FilterEditorFields.css';

export default function FilterEditorFields() {
  const { options, fields } = useMemo(() => getData(), []);

  function provideOptions(field) {
    return options[field] || [];
  }

  function debug({ value }) {
    console.log(value);
  }

  return (
    <>
      <h4 style={{ margin: '20px 20px 0 20px' }}>
        Multiple fields within a single filter
      </h4>
      <div className="wx-EOL5jgmZ area">
        <Field label="Select a field:">
          <FilterEditor
            fields={fields}
            field="age"
            options={provideOptions}
            onApply={debug}
            onChange={debug}
          />
        </Field>
      </div>
    </>
  );
}
