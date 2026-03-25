import FilterBuilder from './components/FilterBuilder.jsx';
import FilterEditor from './components/editor/FilterEditor.jsx';
import FilterBar from './components/bar/FilterBar.jsx';
import FilterQuery from './components/FilterQuery.jsx';

import Material from './themes/Material.jsx';
import Willow from './themes/Willow.jsx';
import WillowDark from './themes/WillowDark.jsx';

export {
  createArrayFilter,
  createFilter,
  getOptions,
  getOptionsMap,
  getFilter,
  getFilters,
  getQueryHtml,
  createFilterRule,
  serialize as getQueryString,
} from '@svar-ui/filter-store';

// import { setEnv, env } from "@svar-ui/lib-dom";
// setEnv(env);

export {
  FilterBuilder,
  FilterEditor,
  FilterBar,
  FilterQuery,
  Material,
  Willow,
  WillowDark,
};
