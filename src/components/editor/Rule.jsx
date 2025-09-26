import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { getFilter } from '@svar-ui/filter-store';
import { dateToString } from '@svar-ui/lib-dom';
import { context } from '@svar-ui/react-core';
import './Rule.css';

export default function Rule({
  filter,
  field,
  type = 'list',
  action = 'menu',
}) {
  const noChange = (v) => v;

  const locale = useContext(context.i18n);

  const lRef = useRef();
  if (lRef.current === undefined) {
    lRef.current = locale.getRaw();
  }
  const l = lRef.current;

  const fRef = useRef();
  if (fRef.current === undefined) {
    fRef.current =
      field?.format || l.filter?.dateFormat || l.formats.dateFormat;
  }
  const f = fRef.current;

  const _format = useMemo(
    () =>
      typeof f === 'function'
        ? f
        : field?.type === 'date'
          ? dateToString(f, l.calendar)
          : noChange,
    [field],
  );

  const groupRef = useRef();
  if (groupRef.current === undefined) {
    groupRef.current = locale.getGroup('filter');
  }
  const _ = groupRef.current;

  const [rule, setRule] = useState();
  const [filterValue, setFilterValue] = useState();

  useEffect(() => {
    setFilterValue(filter.value);
    setRule(filter.filter ? getFilter(filter.filter, filter.type) : null);
  }, [filter]);

  return (
    <div className={`wx-5GeVl88l wx-rule wx-${type}`} data-id={filter.id}>
      <span className="wx-5GeVl88l wx-filter">
        <span className="wx-5GeVl88l wx-field">{field.label}</span>
        {filter.includes && filter.includes.length ? (
          <>
            {' ' + _('in') + ' '}
            {filter.includes.map((value, i) => (
              <React.Fragment key={value}>
                <span className="wx-5GeVl88l wx-value">{_format(value)}</span>
                {i < filter.includes.length - 1 ? ',\u00A0' : null}
              </React.Fragment>
            ))}
          </>
        ) : filter.filter && (filterValue || filterValue === 0) ? (
          <>
            {' ' + (_(rule.short || rule.label) || rule.id) + ' '}
            {field.type === 'date' ? (
              filterValue.start ? (
                <>
                  <span className="wx-5GeVl88l wx-value">
                    {_format(filterValue.start)}
                  </span>
                  {' ' + _('and') + ' '}
                  <span className="wx-5GeVl88l wx-value">
                    {_format(filterValue.end)}
                  </span>
                </>
              ) : (
                <span className="wx-5GeVl88l wx-value">
                  {_format(filterValue)}
                </span>
              )
            ) : (
              <span className="wx-5GeVl88l wx-value">
                {_format(filterValue)}
              </span>
            )}
          </>
        ) : null}
      </span>
      <i
        className={`wx-5GeVl88l wxi-${action === 'menu' ? 'dots-v' : action} wx-menu-icon`}
        role="button"
        data-action={action}
      ></i>
    </div>
  );
}
