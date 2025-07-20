import { useCallback, useMemo, useRef } from "react";

import { useTranslations } from "next-intl";

import { AutoComplete } from "@/components/common/Field/AutoComplete.component";
import { InputField } from "@/components/common/Field/InputField.component";
import { SelectField } from "@/components/common/Field/SelectField.component";
import { Button } from "@/components/common/Button/Button.component";

import { useApp } from "@/contexts/app.context";

import { FormValues } from "@/models/FormValues.model";

import { distanceOptionsImperial, distanceOptionsMetric } from "@/data/distance-options.data";

import styles from "./Main.module.scss";

export const Main = () => {
  const t = useTranslations("form");

  const { appUnits } = useApp();

  const formDistanceOptions = useMemo(
    () => (appUnits === "metric" ? distanceOptionsMetric : distanceOptionsImperial),
    [],
  );

  const formValues = useRef(new FormValues({ distance: formDistanceOptions[0].value }));

  const onSubmit = useCallback((event) => {
    event.preventDefault();

    // ** This shows the form output.
    // console.log("Form values: ", formValues.current);

    // ** Do something with the values here...
  });

  return (
    <main className={styles.main}>
      <form onSubmit={onSubmit} autoComplete="off">
        <InputField
          name="keywords"
          label={t("keywords")}
          placeholder={t("keywordsPlaceholder")}
          onChange={(value) => (formValues.current.keywords = value)}
          required={true}
        />

        <div className={styles.filters}>
          <div className={styles.filters__location}>
            <AutoComplete
              name="location"
              label={t("location")}
              placeholder={t("locationPlaceholder")}
              onChange={(value) => (formValues.current.location = value)}
            />
          </div>

          <div className={styles.filters__distance}>
            <SelectField
              name="distance"
              label={t("distance")}
              placeholder={t("distancePlaceholder")}
              options={formDistanceOptions}
              onChange={(value) => (formValues.current.distance = value)}
            />
          </div>
        </div>

        <div className={styles.controls}>
          <Button label={t("controls")} icon="search" className={styles.controls__button} />
        </div>
      </form>
    </main>
  );
};
