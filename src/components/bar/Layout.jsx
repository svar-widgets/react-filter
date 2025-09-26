import {
  Fragment,
  useState,
  useEffect,
  useMemo,
  useRef,
  useContext,
} from 'react';
import { RichSelect, Text, DatePicker, DateRangePicker } from '@svar-ui/react-core';
import { createFilterRule } from '@svar-ui/filter-store';
import { context } from '@svar-ui/react-core';
import './Layout.css';

function Layout(props) {
  const { fields = [], debounce = 300, onChange } = props;

  const [lastField, setLastField] = useState();
  const [lastValue, setLastValue] = useState({});

  const locale = useContext(context.i18n);
  const l = locale.getRaw();
  const f =
    (l.filter && l.filter.dateFormat) || (l.formats && l.formats.dateFormat);
  const _ = locale.getGroup('filter');

  function getFieldOptions(field) {
    const options = field.options.map((a) => {
      if (typeof a === 'string' || typeof a === 'number') {
        return { id: a, label: a };
      }
      return a;
    });

    options.unshift({ id: '$empty', label: _('None') });

    return options;
  }

  function normalizeField(field) {
    if (typeof field === 'string')
      return { id: field, type: 'text', filter: 'contains' };
    return {
      ...field,
      filter: field.filter || (field.options ? 'equal' : 'contains'),
      options: field.type !== 'date' && field.options && getFieldOptions(field),
    };
  }

  function normalizeFieldsFn(fieldsArr) {
    return fieldsArr.map((field) => {
      if (field.type === 'all' || field.type === 'dynamic') {
        return {
          ...field,
          by: field.by.map((b) => normalizeField(b)),
        };
      }
      return normalizeField(field);
    });
  }

  function getDynamicOptions(arr) {
    return arr.map((a) => ({ id: a.id, label: a.id }));
  }

  const normalizedFields = useMemo(() => normalizeFieldsFn(fields), [fields]);

  const originalValue = useRef(null);
  useEffect(() => {
    const values = {};
    let newLastField = lastField;

    normalizedFields.forEach((field) => {
      if (field.type === 'dynamic') {
        field.by.forEach((fItem) => {
          if (typeof fItem.value !== 'undefined')
            values[fItem.id] = fItem.value;
        });
        newLastField = field.by[0].id;
      } else if (field.type === 'all') {
        values[field.type] = field.value ?? '';
      } else if (typeof field.value !== 'undefined') {
        values[field.id] = field.value;
      }
    });

    originalValue.current = values;
    setLastValue(values);
    setLastField(newLastField);
  }, [normalizedFields]);

  function computeFilters(nFields, lField, lValue) {
    return nFields.map((field) => {
      let base = {
        field: field.type,
        label: field.label,
        placeholder: field.placeholder,
      };

      if (field.type === 'dynamic') {
        base.dynamicField = true;
        base.field = lField;

        const currentField = field.by.find((fItem) => fItem.id === base.field);
        if (currentField) {
          base = {
            ...currentField,
            ...base,
            placeholder: currentField.placeholder ?? base.placeholder,
          };
        }
      } else if (field.type !== 'all') {
        base = { ...base, ...field, field: field.id };
      }

      if (field.by) base.optionsBy = getDynamicOptions(field.by);
      base.value = lValue[base.field];

      return { type: 'text', filter: 'contains', ...base };
    });
  }

  const filters = useMemo(
    () => computeFilters(normalizedFields, lastField, lastValue),
    [normalizedFields, lastField, lastValue],
  );

  function getRule(filter, valueObj) {
    if (filter.field === 'all')
      return createFilterRule(
        filter.optionsBy,
        'contains',
        valueObj[filter.field],
      );
    const value = valueObj[filter.field];
    if (!value) return null;

    return {
      field: filter.field,
      filter: filter.filter,
      type: filter.type,
      value,
    };
  }

  function getRules(valueObj) {
    const rules = filters.map((f) => getRule(f, valueObj)).filter((a) => !!a);
    if (rules.length === 1 && rules[0]?.glue === 'or') return rules[0];
    return {
      glue: 'and',
      rules,
    };
  }

  const timerRef = useRef(null);
  function dispatchChange(delay, valueObj) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange && onChange({ value: getRules(valueObj) });
    }, delay || debounce);
  }

  useEffect(() => {
    if (originalValue.current && originalValue.current !== lastValue) {
      dispatchChange(1, lastValue);
    }
  }, [lastValue]);

  const updateValue = (value, field) => {
    setLastValue((prev) => ({
      ...prev,
      [field]: value === '$empty' ? '' : value,
    }));
  };

  const updateFiltersField = (value) => {
    setLastValue((prev) => {
      setLastField(value);
      if (lastField) {
        return { ...prev, [lastField]: '' };
      }
      return prev;
    });
  };

  return (
    <div className="wx-gWqAfosQ wx-filter-bar">
      {filters.map((filter, i) => (
        <Fragment key={i}>
          {filter.label ? (
            <div className="wx-gWqAfosQ wx-label">{filter.label}</div>
          ) : null}

          {filter.dynamicField ? (
            <div className="wx-gWqAfosQ wx-select">
              <RichSelect
                value={filter.field}
                options={filter.optionsBy}
                onChange={({ value }) => updateFiltersField(value, i)}
              />
            </div>
          ) : null}

          {filter.options ? (
            <div className="wx-gWqAfosQ wx-select">
              <RichSelect
                value={filter.value}
                placeholder={
                  filter.placeholder ?? `${_('filter by')} ${filter.field}`
                }
                options={filter.options}
                onChange={({ value }) => updateValue(value, filter.field)}
              />
            </div>
          ) : filter.type === 'text' || filter.type === 'number' ? (
            <div className="wx-gWqAfosQ wx-text">
              <Text
                value={filter.value}
                placeholder={
                  filter.placeholder ??
                  `${_('filter by')} ${filter.field} (${_(filter.filter)})`
                }
                onChange={({ value, input }) => {
                  if (input) updateValue(value, filter.field);
                }}
                type={filter.type}
              />
            </div>
          ) : filter.type === 'date' ? (
            <div className="wx-gWqAfosQ wx-date">
              {filter.filter === 'between' || filter.filter === 'notBetween' ? (
                <DateRangePicker
                  value={filter.value}
                  format={f}
                  buttons={['done', 'clear', 'today']}
                  placeholder={
                    filter.placeholder ??
                    `${_('filter by')} ${filter.field} (${_(filter.filter)})`
                  }
                  onChange={({ value }) => updateValue(value, filter.field)}
                />
              ) : (
                <DatePicker
                  value={filter.value}
                  format={f}
                  placeholder={
                    filter.placeholder ??
                    `${_('filter by')} ${filter.field} (${_(filter.filter)})`
                  }
                  onChange={({ value }) => updateValue(value, filter.field)}
                />
              )}
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

export default Layout;
