import { useState, useMemo } from 'react';
import { getData } from '../data';
import { FilterBuilder } from '../../src';
import { Segmented, Locale } from '@svar-ui/react-core';

import { en, de, cn } from '@svar-ui/filter-locales';
import { en as coreEn, de as coreDe, cn as coreCn } from '@svar-ui/core-locales';

import './FilterBuilderLocales.css';

export default function FilterBuilderLocales() {
  const { value, fields, options } = useMemo(() => getData(), []);
  const [lang, setLang] = useState('en');

  const langs = [
    { id: 'en', label: 'EN' },
    { id: 'cn', label: 'CN' },
    { id: 'de', label: 'DE' },
  ];

  const getWords = (lang) => {
    let l;
    if (lang == 'en') l = { ...coreEn, ...en };
    else if (lang == 'cn') l = { ...coreCn, ...cn };
    else if (lang == 'de') l = { ...coreDe, ...de };
    return l;
  };

  return (
    <div className="wx-rT4L0AlM rows">
      <div className="wx-rT4L0AlM toolbar">
        <Segmented
          options={langs}
          value={lang}
          onChange={({ value }) => setLang(value)}
        />
      </div>
      <div style={{ padding: '10px 20px', width: '420px' }}>
        <div className="wx-rT4L0AlM qcell">
          <Locale key={lang} words={getWords(lang)}>
            <FilterBuilder value={value} fields={fields} options={options} />
          </Locale>
        </div>
      </div>
    </div>
  );
}
