import Filters from "@/components/Filters/Filters";
import JobSearchForm from "@/components/Forms/JobSearchForm";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryParams = (await searchParams) || {};

  return (
    <div className="main-container">
      <div className="main-inner">
        <div className="form-container">
          <JobSearchForm />
        </div>
        <Filters searchParams={queryParams} />
      </div>
    </div>
  );
}
