import React from "react";
import styles from "./index.module.css";
import Image from "next/image";
import Form from "./components/Form";
import Input from "@/app/[locale]/components/form/Input";
import SelectInput, {
  type Option,
} from "@/app/[locale]/components/form/SelectInput";
import LocationSearchInput from "./components/LocationSearchInput";
import { useTranslations } from "next-intl";

function JobSearchForm() {
  const t = useTranslations("forms.jobSearch");

  return (
    <Form>
      <Input
        label={t("field.searchTerm.label")}
        placeholder={t("field.searchTerm.placeholder")}
        name="searchTerm"
      />
      <div className={styles.formSectionFilter}>
        <LocationSearchInput />
        <SelectInput
          options={t.raw("field.distance.options") as unknown as Option[]}
          defaultOption={
            t.raw("field.distance.options")[1] as unknown as Option
          }
          additionalStyles={styles.inputFieldDistance}
          name="distance"
          label={t("field.distance.label")}
        />
      </div>
      <div className={styles.formSectionBottom}>
        <button className={styles.buttonSearch} type="submit">
          {t("button.primary.label")}{" "}
          <Image src="/icons/search.svg" alt="" width="17" height="17"></Image>
        </button>
      </div>
    </Form>
  );
}

export default JobSearchForm;
