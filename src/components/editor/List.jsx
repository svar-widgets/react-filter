import {
  Fragment,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { delegateClick } from '@svar-ui/lib-dom';
import { Portal, Popup } from '@svar-ui/react-core';
import storeContext from '../../context';
import { useStore, useStoreWithCounter } from '@svar-ui/lib-react';

import Panel from './Panel.jsx';
import Rule from './Rule.jsx';
import Glue from './Glue.jsx';

import './List.css';

function List(props) {
  const { group, type, onShowMenu } = props;

  const api = useContext(storeContext);
  const [valueState, valueChanged] = useStoreWithCounter(api, 'value');
  const fieldsState = useStore(api, 'fields');
  const editorState = useStore(api, '_editor');

  const filters = useMemo(() => {
    return (valueState && valueState.getBranch(group.id)) || [];
  }, [valueChanged, group.id]);

  const cssType = useMemo(() => (type == 'simple' ? 'line' : type), [type]);
  const groupCss = useMemo(
    () => (group.$level == 1 ? 'top' : 'inner'),
    [group.$level],
  );

  const handlers = useMemo(
    () => ({
      dblclick: (id) => api.exec('edit-rule', { id }),
      menu: (id, ev) => onShowMenu && onShowMenu({ id, ev }),
      delete: (id) => {
        api.exec('edit-rule', {});
        api.exec('delete-rule', { id });
      },
    }),
    [api, onShowMenu],
  );

  const getField = useCallback(
    (id) => fieldsState.find((a) => a.id == id),
    [fieldsState],
  );

  const rootRef = useRef(null);
  const [ruleBox, setRuleBox] = useState();
  const [ruleEditor, setRuleEditor] = useState();

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const cleanup = delegateClick(node, handlers);
    return cleanup;
  }, [handlers]);

  useEffect(() => {
    if (editorState && ruleEditor === editorState.id) return;

    if (
      editorState &&
      type !== 'list' &&
      filters.find((a) => a.id === editorState.id)
    ) {
      const rootNode =
        rootRef.current &&
        rootRef.current.querySelector(`[data-id='${editorState.id}']`);
      if (rootNode) {
        setRuleBox(rootNode.getBoundingClientRect());
        setRuleEditor(editorState.id);
        return;
      }
    }
    setRuleBox(null);
    setRuleEditor(null);
  }, [editorState, type, filters, ruleEditor]);

  function cancel() {
    setRuleBox(null);
    setRuleEditor(null);
    api.exec('edit-rule', {});
  }

  return (
    <>
      <div
        ref={rootRef}
        className={`wx-3udP2tTA wx-group wx-${groupCss} wx-${cssType}`}
      >
        {filters.map((rule, i) => (
          <Fragment key={rule.id}>
            {type === 'list' && editorState && editorState.id == rule.id ? (
              <Panel rule={rule} />
            ) : rule.data ? (
              <List type={type} group={rule} onShowMenu={onShowMenu} />
            ) : (
              <div className="wx-3udP2tTA wx-rule-wrapper">
                <Rule
                  action={type == 'simple' ? 'delete' : 'menu'}
                  type={cssType}
                  filter={rule}
                  field={getField(rule.field)}
                />
              </div>
            )}

            {type !== 'simple' && i < filters.length - 1 ? (
              <div className="wx-3udP2tTA wx-glue-wrapper">
                <Glue mode={group.glue} id={group.id} />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>

      {editorState && ruleBox ? (
        <Portal>
          <Popup
            top={ruleBox.top + ruleBox.height}
            left={ruleBox.left + ruleBox.width / 2}
            onCancel={cancel}
          >
            <div className="wx-3udP2tTA wx-editor-wrapper">
              <Panel type={type} rule={valueState.byId(editorState.id)} />
            </div>
          </Popup>
        </Portal>
      ) : null}
    </>
  );
}

export default List;
