import { useState } from "react";

import styles from "./Tabs.module.scss";

export const Tabs = ({ tabs }) => {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.tabs}>
      <ul className={styles.tabs__list}>
        {tabs.map(({ label }, i) => (
          <li
            className={`${styles.tabs__list_item} ${active === i ? styles.active : ""}`}
            onClick={() => setActive(i)}
            key={i}
          >
            {label}
          </li>
        ))}
      </ul>
      {tabs[active].content}
    </div>
  );
};
