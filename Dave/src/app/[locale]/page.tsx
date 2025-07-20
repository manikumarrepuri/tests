import Image from "next/image";
import styles from "./page.module.css";
import JobSearchForm from "./forms/JobSearchForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.imageWrapper}>
          <Image
            src="/Logo white.svg"
            alt="CV Library"
            fill
            sizes="(max-width: 500px) 80vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <JobSearchForm />
      </main>
      <Footer />
    </div>
  );
}
