import { Locale } from '@svar-ui/react-core';
import { en } from '@svar-ui/filter-locales';
import Layout from './Layout.jsx';

function FilterEditor(props) {
  return (
    <Locale words={en} optional={true}>
      <Layout {...props} />
    </Locale>
  );
}

export default FilterEditor;
