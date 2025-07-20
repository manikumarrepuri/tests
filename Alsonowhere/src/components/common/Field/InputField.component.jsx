import { useApp } from "@/contexts/app.context";

import styles from "./Field.module.scss";

export const InputField = ({ name, label, placeholder, onChange, required }) => {
  const { appClass } = useApp();

  return (
    <label className={`${styles.label} ${appClass}`}>
      <span className={styles.input__label}>{label}</span>

      <input
        name={name}
        className={`${styles.input} ${appClass}`}
        placeholder={placeholder}
        onInput={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
};
