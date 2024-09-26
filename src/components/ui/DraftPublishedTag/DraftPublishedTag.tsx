import { DraftIcon } from "../icons/DraftIcon";
import { PlanetIcon } from "../icons/PlanetIcon";
import "./DraftPublishedTag.css";

export const DraftPublishedTag = ({ draftOrPublished }: { draftOrPublished: string }) => {
  console.log(draftOrPublished);
  return (
    <div
      className={`published-status ${draftOrPublished}`}
      title={
        draftOrPublished == "draft"
          ? "This is a draft"
          : draftOrPublished == "published"
          ? "This is a published form"
          : ""
      }
    >
      {draftOrPublished == "draft" ? (
        <>
          <DraftIcon /> Draft
        </>
      ) : draftOrPublished == "published" ? (
        <>
          <PlanetIcon /> Published
        </>
      ) : (
        false
      )}
    </div>
  );
};