import { useApp } from "@/contexts/app.context";

import styles from "./Field.module.scss";

export const SelectField = ({ name, label, placeholder, options, onChange }) => {
  const { appClass } = useApp();

  return (
    <label className={`${styles.label} ${appClass}`}>
      <span className={styles.input__label}>{label}</span>

      <select
        name={name}
        className={`${styles.input} ${appClass}`}
        placeholder={placeholder}
        onInput={(event) => onChange(event.target.value)}
      >
        {options.map(({ name, value }, i) => (
          <option value={value} key={i}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
};
