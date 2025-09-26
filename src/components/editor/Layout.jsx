import { useState, useEffect, useRef, useContext } from 'react';
import {
  RichSelect,
  Text,
  Button,
  DatePicker,
  Checkbox,
  DateRangePicker,
  Combo,
} from '@svar-ui/react-core';
import { getFilters, getFilter } from '@svar-ui/filter-store';
import { dateToString } from '@svar-ui/lib-dom';
import { context } from '@svar-ui/react-core';
import './Layout.css';

export default function Layout(props) {
  const {
    fields = null,
    fieldsSelector = true,
    field: fieldProp = null,
    buttons = true,
    options: optionsProp = null,
    includes: includesProp = null,
    type: typeProp = 'text',
    filter: filterProp = '',
    value: valueProp = '',
    format: formatProp = null,
    predicate: predicateProp = null,
  } = props;

  const onApply = props.onApply || props.onapply;
  const onCancel = props.onCancel || props.oncancel;
  const onChange = props.onChange || props.onchange;

  const locale = useContext(context.i18n);
  const l = locale.getRaw();
  const f = l.filter?.dateFormat || l.formats?.dateFormat;
  const dateFormat = dateToString(f, l.calendar);
  const _ = locale.getGroup('filter');

  const ACTION_FIELD_CHANGE = 1;
  const ACTION_FILTER_CHANGE = 2;
  const ACTION_VALUE_CHANGE = 4;
  const ACTION_INCLUDES_CHANGE = 8;
  const ACTION_TYPE_CHANGE = 16;
  const ACTION_CHANGE = 32;
  const ACTION_OPTIONS_CHANGE = 64;

  const [_filter, set_filter] = useState();
  const _filterRef = useRef();
  const [_field, set_field] = useState();
  const _fieldRef = useRef();
  const [_type, set_type] = useState();
  const _typeRef = useRef();
  const [_value, set_value] = useState();
  const _valueRef = useRef();
  const [_includes, set_includes] = useState([]);
  const _includesRef = useRef([]);
  const [_options, set_options] = useState();
  const _optionsRef = useRef();
  const [, set_format] = useState();
  const _formatRef = useRef();
  const [, set_predicate] = useState();
  const _predicateRef = useRef();
  const [ready, setReady] = useState(false);

  const [providedOptions, setProvidedOptions] = useState(null);

  async function loadOptions(field) {
    if (!optionsProp || typeof optionsProp !== 'function') return;

    const result = await optionsProp(field);
    setProvidedOptions(result || []);
  }

  const sRef = useRef(0);
  const timerRef = useRef(null);

  function arr2str(v) {
    return v ? v.toString() : '';
  }

  function updateState(setter, ref, value) {
    setter(value);
    ref.current = value;
  }

  function setState(signal, value) {
    switch (signal) {
      case ACTION_FIELD_CHANGE:
        if (_fieldRef.current !== value) {
          updateState(set_field, _fieldRef, value);
          return signal;
        }
        break;
      case ACTION_TYPE_CHANGE:
        if (_typeRef.current !== value) {
          updateState(set_type, _typeRef, value);
          return signal;
        }
        break;
      case ACTION_FILTER_CHANGE:
        if (_filterRef.current !== value) {
          updateState(set_filter, _filterRef, value);
          return signal;
        }
        break;
      case ACTION_VALUE_CHANGE:
        if (_valueRef.current !== value) {
          updateState(set_value, _valueRef, value);
          return signal;
        }
        break;
      case ACTION_INCLUDES_CHANGE:
        if (arr2str(_includesRef.current) != arr2str(value)) {
          updateState(set_includes, _includesRef, value || []);
          return signal;
        }
        break;
      case ACTION_OPTIONS_CHANGE:
        if (_optionsRef.current !== value) {
          updateState(set_options, _optionsRef, value || []);
          return signal;
        }
        break;
    }
    return 0;
  }

  function execSignal(signal) {
    sRef.current = sRef.current | signal;
    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        const v = sRef.current;
        timerRef.current = null;
        sRef.current = 0;
        runSignal(v);
      });
    }
  }

  const [allSelected, setAllSelected] = useState();
  const allSelectedRef = useRef();
  const [visibleValues, setVisibleValues] = useState([]);
  const visibleValuesRef = useRef([]);
  const [, setRule] = useState();
  const ruleRef = useRef();
  const [rules, setRules] = useState();
  const rulesRef = useRef();

  function runSignal(s) {
    if (s & ACTION_FIELD_CHANGE) {
      if (fields) {
        updateState(set_options, _optionsRef, null);
        const nextField = fields.find((a) => a.id === _fieldRef.current);
        const isDate =
          _valueRef.current instanceof Date ||
          (_valueRef.current && typeof _valueRef.current === 'object');
        const isTuple =
          nextField.type === 'tuple' || _typeRef.current == 'tuple';
        if (
          (isDate && nextField.type !== 'date') ||
          (!isDate && nextField.type == 'date') ||
          (isNaN(_valueRef.current) && nextField.type == 'number') ||
          isTuple
        ) {
          updateState(set_value, _valueRef, null);
        } else if (
          nextField.type === 'text' &&
          typeof _valueRef.current !== 'string'
        ) {
          const nv =
            _valueRef.current || _valueRef.current === 0
              ? _valueRef.current.toString()
              : '';
          updateState(set_value, _valueRef, nv);
        }
        updateState(set_format, _formatRef, nextField.format);
        updateState(set_predicate, _predicateRef, nextField.predicate);

        s = s | setState(ACTION_TYPE_CHANGE, nextField.type || 'text');

        loadOptions(_fieldRef.current);
      }
    }

    if (s & ACTION_TYPE_CHANGE) {
      const nextRules = getFilters(_typeRef.current).map((a) => ({
        id: a.id,
        label: _(a.label || a.id),
      }));
      updateState(setRules, rulesRef, nextRules);

      if (!nextRules.some((rule) => rule?.id === _filterRef.current)) {
        updateState(set_filter, _filterRef, null);
      }
    }

    if (s & ACTION_TYPE_CHANGE || s & ACTION_FILTER_CHANGE) {
      let r = getFilter(_filterRef.current, _typeRef.current);
      if (!r) {
        r = getFilters(_typeRef.current).find((a) => a.default);
        s = s | setState(ACTION_FILTER_CHANGE, r.id);
      }
      updateState(setRule, ruleRef, r);

      if (
        typeof _valueRef.current === 'object' &&
        !(_valueRef.current instanceof Date) &&
        !r.range
      ) {
        s =
          s |
          setState(
            ACTION_VALUE_CHANGE,
            _typeRef.current === 'date' ? null : '',
          );
      }
    }

    if (
      s & ACTION_FILTER_CHANGE ||
      s & ACTION_VALUE_CHANGE ||
      s & ACTION_OPTIONS_CHANGE
    ) {
      if (_optionsRef.current) {
        const handler =
          _valueRef.current || _valueRef.current === 0
            ? (v) => ruleRef.current.handler(v, _valueRef.current || '')
            : null;

        const vv =
          _filterRef.current && handler
            ? _optionsRef.current.filter(handler)
            : _optionsRef.current;

        updateState(setVisibleValues, visibleValuesRef, vv);

        let nextIncs = _includesRef.current;
        if (_includesRef.current.length) {
          nextIncs = _includesRef.current.filter((x) => vv.includes(x));
        }

        if (nextIncs.length) {
          if (nextIncs.length !== _includesRef.current.length) {
            s = s | setState(ACTION_INCLUDES_CHANGE, nextIncs);
          }
        } else {
          s = s | setState(ACTION_INCLUDES_CHANGE, [...vv]);
        }
      } else {
        updateState(setVisibleValues, visibleValuesRef, []);
      }
    }

    if (s & ACTION_INCLUDES_CHANGE) {
      const as =
        _includesRef.current.length === visibleValuesRef.current.length;
      updateState(setAllSelected, allSelectedRef, as);
    }

    if (s & ACTION_CHANGE) {
      const r = getRule();
      onChange && onChange({ value: r });
    }
  }

  function doApply() {
    const r = getRule();
    onApply && onApply({ value: r });
  }

  function doCancel() {
    onCancel && onCancel();
  }

  function toggleAll() {
    const nextAll = !allSelectedRef.current;
    updateState(setAllSelected, allSelectedRef, nextAll);
    execSignal(
      setState(
        ACTION_INCLUDES_CHANGE,
        nextAll ? [...visibleValuesRef.current] : [],
      ) | ACTION_CHANGE,
    );
  }

  function handleChange(ev) {
    const { inputValue, value } = ev;
    const next = value
      ? [..._includesRef.current, inputValue]
      : _includesRef.current.filter((a) => a != inputValue);
    execSignal(setState(ACTION_INCLUDES_CHANGE, next) | ACTION_CHANGE);
  }

  function changeValue({ value }) {
    if (value === '$empty') value = '';
    execSignal(setState(ACTION_VALUE_CHANGE, value) | ACTION_CHANGE);
  }

  function changeField({ value }) {
    execSignal(setState(ACTION_FIELD_CHANGE, value) | ACTION_CHANGE);
  }

  function changeFilter({ value }) {
    execSignal(setState(ACTION_FILTER_CHANGE, value) | ACTION_CHANGE);
  }

  function getRule() {
    const out = {
      filter: _filterRef.current,
      value: _valueRef.current,
      type: _typeRef.current,
    };

    if (_predicateRef.current) out.predicate = _predicateRef.current;
    if (_fieldRef.current) out.field = _fieldRef.current;

    if (
      _includesRef.current &&
      _includesRef.current.length &&
      _includesRef.current.length !== visibleValuesRef.current.length
    )
      out.includes = [..._includesRef.current];
    else out.includes = [];

    return out;
  }

  function getLabel(v) {
    if (_formatRef.current && typeof _formatRef.current == 'function')
      return _formatRef.current(v);
    if (v instanceof Date)
      return _formatRef.current
        ? dateToString(_formatRef.current, l.calendar)(v)
        : dateFormat(v);
    return typeof v === 'string' ? v : v.toString();
  }

  function getComboOptions(options) {
    let arr = options
      ? options.map((op) => ({ id: op, label: getLabel(op) }))
      : [];
    return [{ id: '$empty', label: '', emptyLabel: _('None') }].concat(arr);
  }

  const inputRef = useRef(null);
  useEffect(() => {
    if (_fieldRef.current && inputRef.current) {
      setTimeout(() => {
        const el = inputRef.current;
        const inp = el && el.querySelector('input');
        if (inp) inp.focus();
      }, 1);
    }
  }, [_field]);

  useEffect(() => {
    if (ready) execSignal(setState(ACTION_FIELD_CHANGE, fieldProp));
  }, [fieldProp, ready]);

  useEffect(() => {
    if (ready) execSignal(setState(ACTION_TYPE_CHANGE, typeProp));
  }, [typeProp, ready]);

  useEffect(() => {
    if (ready) execSignal(setState(ACTION_FILTER_CHANGE, filterProp));
  }, [filterProp, ready]);

  useEffect(() => {
    if (ready) execSignal(setState(ACTION_VALUE_CHANGE, valueProp));
  }, [valueProp, ready]);

  useEffect(() => {
    if (ready) execSignal(setState(ACTION_INCLUDES_CHANGE, includesProp));
  }, [includesProp, ready]);

  useEffect(() => {
    const currOptions = Array.isArray(optionsProp)
      ? optionsProp
      : providedOptions;
    if (ready) execSignal(setState(ACTION_OPTIONS_CHANGE, currOptions));
  }, [optionsProp, providedOptions, ready]);

  useEffect(() => {
    if (formatProp && !fields) updateState(set_format, _formatRef, formatProp);
    if (predicateProp && !fields)
      updateState(set_predicate, _predicateRef, predicateProp);
  }, [formatProp, predicateProp, fields]);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="wx-3z8r9Oys wx-filter-editor">
      {fields && fieldsSelector ? (
        <RichSelect onChange={changeField} options={fields} value={_field} />
      ) : null}
      <div className="wx-3z8r9Oys wx-wrapper">
        <div className="wx-3z8r9Oys wx-cell">
          <RichSelect
            onChange={changeFilter}
            options={rules}
            value={_filter}
            placeholder={_('Click to select')}
          />
        </div>
        <div className="wx-3z8r9Oys wx-cell" ref={inputRef}>
          {_type === 'date' ? (
            _filter == 'between' || _filter == 'notBetween' ? (
              <DateRangePicker
                format={f}
                value={_value}
                buttons={['done', 'clear', 'today']}
                onChange={changeValue}
              />
            ) : (
              <DatePicker format={f} value={_value} onChange={changeValue} />
            )
          ) : _type === 'number' ? (
            <Text value={_value} onChange={changeValue} type="number" />
          ) : _type === 'tuple' ? (
            <Combo
              value={_value}
              options={getComboOptions(_options)}
              onChange={changeValue}
            >
              {({ option }) => option.emptyLabel || option.label}
            </Combo>
          ) : (
            <Text value={_value} onChange={changeValue} />
          )}
        </div>
      </div>

      <Button onClick={toggleAll}>
        {allSelected ? _('Unselect all') : _('Select all')}
      </Button>
      <div className="wx-3z8r9Oys wx-list" role="listbox">
        {visibleValues.map((option, i) => (
          <div
            className="wx-3z8r9Oys wx-item"
            tabIndex={i ? -1 : 0}
            role="option"
            key={i}
          >
            <Checkbox
              label={getLabel(option)}
              inputValue={option}
              value={_includes && _includes.includes(option)}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      {buttons ? (
        <div className="wx-3z8r9Oys wx-wrapper">
          <Button type={'secondary'} onClick={doCancel}>
            {_('Cancel')}
          </Button>
          <Button type={'primary'} onClick={doApply}>
            {_('Apply')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
