import { List } from "./List/List.component";

import { useApp } from "@/contexts/app.context";

import { jobsByLocation } from "@/data/jobs-by-location.data";

import styles from "./JobsBy.module.scss";

export const JobsByLocation = () => {
  const { appClass } = useApp();

  return (
    <div className={`${styles.jobsBy__container} ${appClass}`}>
      <List list={jobsByLocation} />
    </div>
  );
};
