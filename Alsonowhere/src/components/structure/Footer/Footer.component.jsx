import { useTranslations } from "next-intl";

import { Tabs } from "@/components/common/Tabs/Tabs.component";
import { JobsByLocation } from "@/components/content/JobsByLocation.component";
import { JobsByIndustry } from "@/components/content/JobsByIndustry.component";

import { Tab } from "@/models/Tab.model";

import styles from "./Footer.module.scss";
import { useMemo } from "react";

export const Footer = () => {
  const t = useTranslations("tabs");

  const footerTabs = useMemo(
    () => [new Tab(t("location"), <JobsByLocation />), new Tab(t("industry"), <JobsByIndustry />)],
    [],
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__tabs}>
        <Tabs tabs={footerTabs} />
      </div>
    </footer>
  );
};
