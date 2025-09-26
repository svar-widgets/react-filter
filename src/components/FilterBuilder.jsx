import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import Layout from './Layout.jsx';
import { Locale } from '@svar-ui/react-core';
import { en } from '@svar-ui/filter-locales';
import { EventBusRouter } from '@svar-ui/lib-state';
import { DataStore } from '@svar-ui/filter-store';
import ContextStore from '../context';
import { writable } from '@svar-ui/lib-react';

const camelize = (s) =>
  s
    .split('-')
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ''))
    .join('');

const FilterBuilder = forwardRef(function FilterBuilder(
  {
    value = { glue: 'and', rules: [] },
    fields = [],
    options = null,
    type = 'list',
    init = null,
    ...restProps
  },
  ref,
) {
  // keep latest rest props for event routing
  const restPropsRef = useRef();
  restPropsRef.current = restProps;

  // init stores
  const dataStore = useMemo(() => new DataStore(writable), []);
  const firstInRoute = useMemo(() => dataStore.in, [dataStore]);

  const lastInRouteRef = useRef(null);
  if (lastInRouteRef.current === null) {
    lastInRouteRef.current = new EventBusRouter((a, b) => {
      const name = 'on' + camelize(a);
      if (restPropsRef.current && restPropsRef.current[name]) {
        restPropsRef.current[name](b);
      }
    });
    firstInRoute.setNext(lastInRouteRef.current);
  }

  // public API
  const api = useMemo(
    () => ({
      getState: dataStore.getState.bind(dataStore),
      getReactiveState: dataStore.getReactive.bind(dataStore),
      getStores: () => ({ data: dataStore }),
      exec: firstInRoute.exec,
      setNext: (ev) => {
        lastInRouteRef.current = lastInRouteRef.current.setNext(ev);
        return lastInRouteRef.current;
      },
      intercept: firstInRoute.intercept.bind(firstInRoute),
      on: firstInRoute.on.bind(firstInRoute),
      detach: firstInRoute.detach.bind(firstInRoute),
      getValue: dataStore.getValue.bind(dataStore),
    }),
    [dataStore, firstInRoute],
  );

  // init logic
  const initOnceRef = useRef(true);
  useEffect(() => {
    dataStore.init({
      value,
      fields,
      options,
    });

    if (initOnceRef.current && init) {
      init(api);
      initOnceRef.current = false;
    }
  }, [dataStore, value, fields, options, init, api]);

  if (initOnceRef.current) {
    dataStore.init({
      value,
      fields,
      options,
    });

    if (init) init(api);
    initOnceRef.current = false;
  }

  // expose API via ref
  useImperativeHandle(
    ref,
    () => ({
      ...api,
    }),
    [api],
  );

  return (
    <Locale words={en} optional={true}>
      <ContextStore.Provider value={api}>
        <Layout type={type} />
      </ContextStore.Provider>
    </Locale>
  );
});

export default FilterBuilder;
