import { useMemo } from "react";

import Image from "next/image";

import { imageMap } from "@/data/image-map.data";

import styles from "./Button.module.scss";

export const Button = ({ label, icon, className = "" }) => {
  const imageSrc = useMemo(() => !!icon && imageMap.get(icon), [icon]);

  return (
    <button className={`${styles.button} ${className}`}>
      <span>{label}</span>

      {!!imageSrc && <Image src={imageSrc} alt="" className={styles.button__image} width={0} height={0} />}
    </button>
  );
};
