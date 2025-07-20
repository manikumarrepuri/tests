import styles from './locationSearch.module.scss';

export default function LocationSearch({results}) {
  const half = Math.ceil(results.length / 2);
  const left = results.slice(0, half);
  const right = results.slice(half);

  return (
    <div className={styles.container}>
      {[left, right].map((list, colIndex) => (
        <ul key={colIndex} className={styles.column}>
          {list.map((item, i) => (
            <li key={`${item.label}-${i}`} className={styles.item}>
              {item.label}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
