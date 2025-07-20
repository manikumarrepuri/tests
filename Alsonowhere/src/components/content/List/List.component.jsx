import styles from "./List.module.scss";

export const List = ({ list }) => {
  return (
    <ul className={styles.list}>
      {list.map((x, i) => (
        <li className={styles.list__item} key={i}>
          {x}
        </li>
      ))}
    </ul>
  );
};
