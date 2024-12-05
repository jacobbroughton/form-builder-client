import { AllFormsType } from "../../../lib/types";
import { FormGroupContainer } from "../FormGroupContainer/FormGroupContainer";
import "./MetadataInputs.css";

export function MetadataInputs({
  form,
  setForm,
}: {
  form: AllFormsType | null;
  setForm: React.Dispatch<React.SetStateAction<AllFormsType | null>>;
}) {
  if (!form) return <p>No form found</p>;

  return (
    <div className="metadata-inputs">
      <form className="title-and-description" onSubmit={(e) => e.preventDefault()}>
        <FormGroupContainer
          label="Form name"
          description=""
          placeholder="Title"
          type="Short Answer"
          inputValue={form.title}
          disabled={false}
          isRequired={true}
          handleChange={(e) => {
            e.preventDefault();
            setForm({
              ...form,
              title: e.target.value,
            });
          }}
          canHide={false}
        />

        <FormGroupContainer
          label="Description"
          description=""
          placeholder="Description"
          type="Paragraph"
          inputValue={form.description || ""}
          disabled={false}
          isRequired={false}
          handleChange={(e) => {
            e.preventDefault();
            setForm({
              ...form!,
              description: e.target.value,
            });
          }}
          canHide={true}
        />
      </form>
    </div>
  );
}
