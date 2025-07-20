"use client";
import React, { type PropsWithChildren } from "react";
import styles from "./index.module.css";

function Form({ children }: PropsWithChildren<{}>) {
  const onSubmit = (formData: FormData) => {
    console.log({
      searchTerm: formData.get("searchTerm"),
      location: formData.get("location"),
      distance: formData.get("distance"),
    });
  };

  return (
    <form className={styles.form} action={onSubmit}>
      {children}
    </form>
  );
}

export default Form;
