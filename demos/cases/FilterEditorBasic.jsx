import { useMemo } from 'react';
import { getData } from '../data';
import { Field } from '@svar-ui/react-core';
import { FilterEditor } from '../../src';
import './FilterEditorBasic.css';

const FilterEditorBasic = () => {
  const { values, options } = useMemo(() => getData(), []);

  return (
    <div className="wx-sbWYL1hY area">
      <Field label="Text filter (empty)">
        <FilterEditor options={options.first_name} type="text" />
      </Field>
      <Field label="Text filter">
        <FilterEditor {...values[0]} options={options.first_name} type="text" />
      </Field>

      <Field label="Number filter (empty)">
        <FilterEditor options={options.age} type="number" />
      </Field>
      <Field label="Number filter">
        <FilterEditor {...values[1]} options={options.age} type="number" />
      </Field>

      <Field label="Date filter (empty)">
        <FilterEditor options={options.start} type="date" />
      </Field>
      <Field label="Date filter">
        <FilterEditor {...values[2]} options={options.start} type="date" />
      </Field>
    </div>
  );
};

export default FilterEditorBasic;
