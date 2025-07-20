import React from "react";
import inputStyles from "../Input/index.module.css";
import styles from "./index.module.css";
import { type IInput } from "../Input";

export type Option = {
  label: string;
  value: string | number;
};

interface ISelectInput extends Omit<IInput, "placeholder"> {
  options: Option[];
  defaultOption: Option;
  additionalStyles: string;
}

function SelectInput({
  name,
  label,
  options,
  defaultOption,
  additionalStyles,
}: ISelectInput) {
  return (
    <div
      className={`${inputStyles.inputContainer} ${styles.selectInputContainer} ${additionalStyles}`}
    >
      <label className={inputStyles.inputLabel}>
        {label}
        <select
          className={`${inputStyles.inputField} ${styles.selectInput}`}
          name={name}
          defaultValue={defaultOption.value}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default SelectInput;
