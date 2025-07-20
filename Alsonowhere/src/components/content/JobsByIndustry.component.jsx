import { List } from "./List/List.component";

import { useApp } from "@/contexts/app.context";

import { jobsByIndustry } from "@/data/Jobs-by-industry.data";

import styles from "./JobsBy.module.scss";

export const JobsByIndustry = () => {
  const { appClass } = useApp();

  return (
    <div className={`${styles.jobsBy__container} ${appClass}`}>
      <List list={jobsByIndustry} />
    </div>
  );
};
