import Head from "next/head";

import { Header } from "@/components/structure/Header/Header.component";
import { Main } from "@/components/structure/Main/Main.component";
import { Footer } from "@/components/structure/Footer/Footer.component";

import { messagesByLocale, metricLanguages, rtlLanguages } from "@/data/locales.data";

import styles from "../styles/Page.module.scss";

async function getMessages(locale) {
  const loadMessages = messagesByLocale[locale] || messagesByLocale.en;
  const messages = await loadMessages();
  return messages.default;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Job Search - Find jobs</title>
        <meta name="description" content="CV Library job search" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`${styles.page}`}>
        <Header />

        <Main />

        <Footer />
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const messages = await getMessages(locale);
  const direction = rtlLanguages.includes(locale);
  const units = metricLanguages.includes(locale) ? "metric" : "imperial";
  return {
    props: { messages, direction, units },
  };
}
