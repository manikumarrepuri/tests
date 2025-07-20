import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TabData {
  label: string;
  content: string[][];
}

const Tabs: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabData: TabData[] = [
    {
      label: t('jobs_by_location'),
      content: [
        [
          t('cities.aberdeen'),
          t('cities.basingstoke'),
          t('cities.berkshire'),
          t('cities.birmingham'),
          t('cities.bradford'),
          t('cities.bristol'),
        ],
        [
          t('cities.derby'),
          t('cities.doncaster'),
          t('cities.edinburgh'),
          t('cities.essex'),
          t('cities.exeter'),
          t('cities.glasgow'),
        ],
      ],
    },
    {
      label: t('jobs_by_industry'),
      content: [
        [
          t('industries.accounting'),
          t('industries.administration'),
          t('industries.agriculture'),
          t('industries.arts'),
          t('industries.automotive'),
          t('industries.catering'),
        ],
        [
          t('industries.distribution'),
          t('industries.driving'),
          t('industries.education'),
          t('industries.electronics'),
          t('industries.engineering'),
          t('industries.financial_services'),
        ],
      ],
    },
  ];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="tabs-container" role="tablist" aria-label="Job categories">
      <div className="tabs-bar">
        {tabData.map((tab, idx) => (
          <button
            key={tab.label}
            className={`tab${activeTab === idx ? ' active' : ''}`}
            onClick={() => handleTabClick(idx)}
            aria-selected={activeTab === idx}
            role="tab"
            aria-controls={`tabpanel-${idx}`}
            id={`tab-${idx}`}
            data-testid={`tab-${idx}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className="tab-content"
        role="tabpanel"
        aria-hidden={false}
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        data-testid={`tabpanel-${activeTab}`}
      >
        <div className="tab-content-inner">
          {tabData[activeTab].content.map((list, i) => (
            <ul key={i}>
              {list.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
