'use client';

import { useState } from 'react';
import styles from './tabs.module.scss';

export default function Tabs({ error,tabs }) {
  const [active, setActive] = useState(0);
  return (
    <div className={styles.tabs}>
      <div className={styles.headers}>
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={active === idx ? styles.active : ''}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.content}>
          {error && <p className="error">{error}</p>}

          {tabs[active].content}
        </div>
    </div>
  );
}
