import Image from "next/image";

import styles from "./Header.module.scss";

export const Header = () => {
  return (
    <header className={styles.header}>
      <Image
        src="/Logo white.svg"
        alt="CV Library brand image"
        className={styles.header__image}
        width={0}
        height={0}
        priority
      />
    </header>
  );
};
