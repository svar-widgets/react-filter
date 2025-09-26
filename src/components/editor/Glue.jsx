import { useContext } from 'react';
import { context } from '@svar-ui/react-core';
import './Glue.css';
import storeContext from '../../context';

export default function Glue({ mode = 'and', id }) {
  const i18n = useContext(context.i18n);
  const _ = i18n.getGroup('filter');
  const api = useContext(storeContext);

  function toggleGlue() {
    api.exec('toggle-glue', { id });
  }

  return (
    <div
      className={`wx-XRdDajFX wx-glue wx-${mode}`}
      role="button"
      onClick={toggleGlue}
    >
      {_(mode)}
    </div>
  );
}
