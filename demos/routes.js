import FilterBuilderBasic from './cases/FilterBuilderBasic.jsx';
import FilterBuilderLine from './cases/FilterBuilderLine.jsx';
import FilterBuilderSimple from './cases/FilterBuilderSimple.jsx';
import FilterBuilderOptions from './cases/FilterBuilderOptions.jsx';
import FilterBuilderDates from './cases/FilterBuilderDates.jsx';
import FilterBuilderAPI from './cases/FilterBuilderAPI.jsx';
import FilterBuilderLocales from './cases/FilterBuilderLocales.jsx';
import FilterBuilderConvertDates from './cases/FilterBuilderConvertDates.jsx';
import FilterBuilderBackend from './cases/FilterBuilderBackend.jsx';
import FilterEditorBasic from './cases/FilterEditorBasic.jsx';
import FilterEditorEvents from './cases/FilterEditorEvents.jsx';
import FilterEditorFields from './cases/FilterEditorFields.jsx';
import FilterEditorDates from './cases/FilterEditorDates.jsx';
import FilterEditorOptions from './cases/FilterEditorOptions.jsx';
import FilterBar from './cases/FilterBar.jsx';
import FilterBarCombined from './cases/FilterBarCombined.jsx';
import FilterBarDates from './cases/FilterBarDates.jsx';

export const links = [
  [
    '/base/:skin',
    'Basic Filter Builder',
    FilterBuilderBasic,
    'FilterBuilderBasic',
  ],
  [
    '/filter-builder-line/:skin',
    'Filter Builder: line mode',
    FilterBuilderLine,
    'FilterBuilderLine',
  ],
  [
    '/filter-builder-simple/:skin',
    'Filter Builder: simple mode',
    FilterBuilderSimple,
    'FilterBuilderSimple',
  ],
  [
    '/filter-builder-options/:skin',
    'Filter Builder: dynamic options',
    FilterBuilderOptions,
    'FilterBuilderOptions',
  ],
  [
    '/filter-builder-dates/:skin',
    'Filter Builder: working with dates',
    FilterBuilderDates,
    'FilterBuilderDates',
  ],
  [
    '/filter-builder-api/:skin',
    'Filter Builder: API',
    FilterBuilderAPI,
    'FilterBuilderAPI',
  ],
  [
    '/filter-builder-locales/:skin',
    'Filter Builder: locales',
    FilterBuilderLocales,
    'FilterBuilderLocales',
  ],
  [
    '/filter-builder-convert-dates/:skin',
    'Filter Builder: convert dates',
    FilterBuilderConvertDates,
    'FilterBuilderConvertDates',
  ],
  [
    '/filter-builder-backend/:skin',
    'Filter Builder: backend',
    FilterBuilderBackend,
    'FilterBuilderBackend',
  ],
  [
    '/filter-editor-base/:skin',
    'Basic Filter Editor',
    FilterEditorBasic,
    'FilterEditorBasic',
  ],
  [
    '/filter-editor-events/:skin',
    'Filter Editor: events',
    FilterEditorEvents,
    'FilterEditorEvents',
  ],
  [
    '/filter-editor-fields/:skin',
    'Filter Editor: multiple fields',
    FilterEditorFields,
    'FilterEditorFields',
  ],
  [
    '/filter-editor-dates/:skin',
    'Filter Editor: working with dates',
    FilterEditorDates,
    'FilterEditorDates',
  ],
  [
    '/filter-editor-options/:skin',
    'Filter Editor: formatting options',
    FilterEditorOptions,
    'FilterEditorOptions',
  ],
  ['/filter-bar/:skin', 'Basic Filter Bar', FilterBar, 'FilterBar'],
  [
    '/filter-bar-combined/:skin',
    'Filter Bar: combined fields',
    FilterBarCombined,
    'FilterBarCombined',
  ],
  [
    '/filter-bar-dates/:skin',
    'Filter Bar: working with dates',
    FilterBarDates,
    'FilterBarDates',
  ],
];
