import { IntlProvider } from "next-intl";

import AppClassContext from "@/contexts/app.context";

import "@/styles/global.scss";

export default function App({ Component, pageProps }) {
  const appClass = pageProps.direction ? "rtl" : "";
  const appUnits = pageProps.units;

  return (
    <AppClassContext.Provider value={{ appClass, appUnits }}>
      <IntlProvider messages={pageProps.messages}>
        <Component {...pageProps} />
      </IntlProvider>
    </AppClassContext.Provider>
  );
}
