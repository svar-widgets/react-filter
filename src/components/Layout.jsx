import { useContext, useMemo, useRef, useCallback } from 'react';

import { Button } from '@svar-ui/react-core';
import { DropDownMenu, ContextMenu } from '@svar-ui/react-menu';
import List from './editor/List.jsx';
import { context } from '@svar-ui/react-core';
import './Layout.css';
import storeContext from '../context';
import { useStore, useStoreWithCounter } from '@svar-ui/lib-react';

export default function Layout({ type }) {
  const api = useContext(storeContext);
  const i18nCtx = useContext(context.i18n);
  const _ = useMemo(() => i18nCtx.getGroup('filter'), [i18nCtx]);

  const fields = useStore(api, 'fields');
  const [value, valueChanged] = useStoreWithCounter(api, 'value');

  const group = value.getBranch(0)[0];

  function addFilter(data) {
    api.exec('add-rule', { rule: { $temp: true, ...data }, edit: true });
  }

  const newFilterOptions = useMemo(() => {
    const now = {};
    value.forEach((x) => (now[x.field] = true));
    return fields
      .filter((c) => !now[c.id])
      .map((o) => ({ id: o.id, text: o.label }));
  }, [valueChanged, fields]);

  const selectNewFilter = useCallback(
    (ev) => {
      const action = ev.action;
      if (action) {
        addFilter({ field: action.id });
      }
    },
    [addFilter],
  );

  const menuOptions = useMemo(
    () => [
      {
        id: 'edit-rule',
        text: _('Edit'),
        icon: 'wxi-edit-outline',
      },
      {
        id: 'add-rule',
        text: _('Add filter'),
        icon: 'wxi-filter-plus-outline',
        resolver: (item) => ({
          after: item,
          rule: { $temp: true },
          edit: true,
        }),
      },
      {
        id: 'add-group',
        text: _('Add group'),
        icon: 'wxi-filter-multiple-outline',
        resolver: (item) => ({
          after: item,
          rule: { $temp: true },
          edit: true,
        }),
      },
      { type: 'separator' },
      {
        id: 'delete-rule',
        text: _('Delete'),
        icon: 'wxi-delete-outline',
      },
    ],
    [_],
  );

  const menuRef = useRef(null);

  const menuAction = useCallback(
    (ev) => {
      const { context: item, action } = ev;
      if (action) {
        const data = action.resolver ? action.resolver(item) : { id: item };
        api.exec(action.id, data);
      }
    },
    [api],
  );

  const onShowMenu = useCallback(({ ev, id }) => {
    if (menuRef.current && typeof menuRef.current.show === 'function') {
      menuRef.current.show(ev, id);
    }
  }, []);

  return (
    <>
      <div className={`wx-VDDi7d7g wx-filter-builder wx-${type}`}>
        {type === 'list' ? (
          <>
            <div className={`wx-VDDi7d7g wx-toolbar wx-${type}`}>
              <Button type={'primary'} onClick={addFilter}>
                {_('Add filter')}
              </Button>
            </div>
            <List type={type} group={group} onShowMenu={onShowMenu} />
          </>
        ) : type === 'line' ? (
          <div className={`wx-VDDi7d7g wx-toolbar wx-${type}`}>
            <div className="wx-VDDi7d7g wx-filters">
              <List type={type} group={group} onShowMenu={onShowMenu} />
            </div>

            <div className="wx-VDDi7d7g wx-button">
              <Button type={'primary'} onClick={addFilter}>
                {_('Add filter')}
              </Button>
            </div>
          </div>
        ) : type === 'simple' ? (
          <div className={`wx-VDDi7d7g wx-toolbar wx-${type}`}>
            <div className="wx-VDDi7d7g wx-button">
              <DropDownMenu
                options={newFilterOptions}
                onClick={selectNewFilter}
              >
                <Button disabled={!newFilterOptions.length} type={'primary'}>
                  {_('Add filter')}
                </Button>
              </DropDownMenu>
            </div>

            <div className="wx-VDDi7d7g wx-filters">
              <List type={type} group={group} onShowMenu={onShowMenu} />
            </div>
          </div>
        ) : null}
      </div>
      {type !== 'simple' ? (
        <ContextMenu options={menuOptions} onClick={menuAction} ref={menuRef} />
      ) : null}
    </>
  );
}
