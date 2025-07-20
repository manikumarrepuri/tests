"use client";

import React, { useState } from "react";
import styles from "./index.module.css";
import { useTranslations } from "next-intl";

type Tab = "location" | "industry";

const List = ({ list, isVisible }: { list: string[]; isVisible: boolean }) => {
  return (
    <ul className={`${styles.list} ${isVisible && styles.visible}`}>
      {list.map((listItem) => (
        <li key={listItem} className={styles.listItem}>
          <a>{listItem}</a>
        </li>
      ))}
    </ul>
  );
};

function Footer() {
  const [selectedTab, setSelectedTab] = useState<Tab>("location");
  const t = useTranslations("footer");

  return (
    <footer className={styles.footer}>
      <fieldset className={styles.tabs}>
        <label className={styles.tab}>
          <input
            name="jobsByTab"
            type="radio"
            value="location"
            checked={selectedTab === "location"}
            onChange={() => setSelectedTab("location")}
          />
          {t("jobsByLocation")}
        </label>
        <label className={styles.tab}>
          <input
            name="jobsByTab"
            type="radio"
            value="industry"
            checked={selectedTab === "industry"}
            onChange={() => setSelectedTab("industry")}
          />
          {t("jobsByIndustry")}
        </label>
      </fieldset>
      <div className={styles.listWrapper}>
        <List
          list={t.raw("featuredLocations") as string[]}
          isVisible={selectedTab === "location"}
        />
        <List
          list={t.raw("featuredIndustries") as string[]}
          isVisible={selectedTab === "industry"}
        />
      </div>
    </footer>
  );
}

export default Footer;
