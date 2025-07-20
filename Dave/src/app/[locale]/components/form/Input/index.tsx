import React, { Ref, type InputHTMLAttributes } from "react";
import styles from "./index.module.css";

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ref?: Ref<HTMLInputElement>;
}

function Input({ label, ...rest }: IInput) {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.inputLabel}>
        {label}
        <input className={styles.inputField} {...rest} />
      </label>
    </div>
  );
}

export default Input;
