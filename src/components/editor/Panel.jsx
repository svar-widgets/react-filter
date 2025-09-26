import { useContext, useMemo, useCallback } from 'react';
import storeContext from '../../context';
import { useStore } from '@svar-ui/lib-react';
import FilterEditor from './FilterEditor.jsx';
import './Panel.css';

export default function Panel(props) {
  const { rule, type } = props;

  const includes = useMemo(
    () => (rule.includes && rule.includes.length ? rule.includes : null),
    [rule],
  );
  const filter = useMemo(() => rule.filter || 'contains', [rule]);
  const value = useMemo(() => rule.value || '', [rule]);
  const field = useMemo(() => rule.field, [rule]);
  const id = useMemo(() => rule.id, [rule]);

  const api = useContext(storeContext);
  const fields = useStore(api, 'fields');
  const options = useStore(api, 'options');

  const doCancel = useCallback(() => {
    api.exec('edit-rule', {});
  }, [api]);

  const doApply = useCallback(
    ({ value }) => {
      api.exec('update-rule', { id, rule: value });
      doCancel();
    },
    [api, id],
  );

  const doChange = useCallback(
    ({ value }) => {
      api.exec('change-rule', { id, rule: value });
    },
    [api, id],
  );

  return (
    <div className="wx-uOIGm7Ce wx-panel">
      <FilterEditor
        fieldsSelector={type !== 'simple'}
        fields={fields}
        field={field}
        options={options}
        includes={includes}
        filter={filter}
        value={value}
        onApply={doApply}
        onCancel={doCancel}
        onChange={doChange}
      />
    </div>
  );
}
