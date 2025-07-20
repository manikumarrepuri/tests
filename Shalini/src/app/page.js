import styles from "./page.module.scss";
import Image from "next/image";
import Form from "./components/form/form";

export async function getData() {
  const defaultLocations = [
    { label: "Aberdeen" },
    { label: "Basingstoke" },
    { label: "Berkshire" },
    { label: "Birmingham" },
    { label: "Bradford" },
    { label: "Bristol" },
    { label: "Derby" },
    { label: "Doncaster" },
    { label: "Edinburgh" },
    { label: "Essex" },
    { label: "Exeter" },
    { label: "Glasgow" },
  ];
          
  const defaultIndustries = [
    { label: "Accounting" },
    { label: "Administration" },
    { label: "Agriculture" },
    { label: "Arts" },
    { label: "Automotive" },
    { label: "Catering" },
    { label: "Distribution" },
    { label: "Driving" },
    { label: "Education" },
    { label: "Electronics" },
    { label: "Engineering" },
    { label: "Financial" },
  ];
             
  return {
    locations: defaultLocations,
    industries: defaultIndustries,
  };
}

export default async function Home() {
  const { locations, industries } = await getData();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
      <Image className={styles.logo} src="./images/logo.svg" alt="logo" width={350} height={135} priority />
      <Form defaultLocations={locations} defaultIndustries={industries}/>
      </main>
    </div>
  );
}
