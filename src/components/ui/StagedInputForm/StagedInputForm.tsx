import { useEffect, useState } from "react";
import {
  InputTypePropertyOptionType,
  InputTypePropertyType,
  InputTypeType,
  AddedInputType,
  AllFormsType,
} from "../../../lib/types";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { CheckIcon } from "../icons/CheckIcon";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";
import "./StagedInputForm.css";
import {
  addNewInputToForm,
  getInputTypeProperties,
  getInputTypePropertyOptions,
} from "../../../utils/fetchRequests";

export const StagedInputForm = ({
  form,
  setForm,
  setCurrentView,
  stagedNewInputType,
  setStagedNewInputType,
  isForDraft,
}: {
  form: { form: AllFormsType | null; inputs: AddedInputType[] };
  setForm: React.Dispatch<
    React.SetStateAction<{
      form: AllFormsType | null;
      inputs: AddedInputType[];
    }>
  >;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  stagedNewInputType: InputTypeType | null;
  setStagedNewInputType: React.Dispatch<React.SetStateAction<InputTypeType | null>>;
  isForDraft: boolean;
}) => {
  const [stagedInputTitle, setStagedInputTitle] = useState<string>("Untitled Question");
  const [stagedInputDescription, setStagedInputDescription] = useState<string>("");

  const [descriptionToggled, setDescriptionToggled] = useState<boolean>(false);
  const [inputTypePropertyOptions, setInputTypePropertyOptions] = useState<{
    [key: string]: InputTypePropertyOptionType[];
  }>({});

  const [inputTypeProperties, setInputTypeProperties] = useState<{
    [key: string]: InputTypePropertyType[];
  }>({});

  async function getInputTypePropertiesLocal(): Promise<void> {
    try {
      const data = await getInputTypeProperties();

      setInputTypeProperties(data);
    } catch (error) {
      handleCatchError(error);
    }
  }

  async function getInputTypePropertyOptionsLocal(): Promise<void> {
    try {
      const data = await getInputTypePropertyOptions();

      setInputTypePropertyOptions(data);
    } catch (error) {
      handleCatchError(error);
    }
  }

  async function handleAddNewInput(): Promise<void> {
    try {
      const properties = inputTypeProperties[stagedNewInputType!.id];

      const data = await addNewInputToForm({
        inputTypeId: stagedNewInputType?.id,
        inputMetadataQuestion: stagedInputTitle,
        inputMetadataDescription: stagedInputDescription,
        properties,
        formId: form.form!.id,
        userId: "75c75c02-b39b-4f33-b940-49aa20b9eda4",
        isForDraft,
      });

      setForm({
        ...form,
        inputs: [...form.inputs, data],
      });

      handleInputReset();

      setCurrentView("metadata-inputs");
    } catch (error) {
      handleCatchError(error);
    }
  }

  function handleInputReset(): void {
    setStagedInputTitle("Untitled Question");
    setStagedInputDescription("");
    setDescriptionToggled(false);
    setStagedNewInputType(null);
  }

  function handleOptionClick(
    property: InputTypePropertyType,
    option: InputTypePropertyOptionType
  ) {
    setInputTypePropertyOptions({
      ...inputTypePropertyOptions,
      [`${property.input_type_id}-${property.id}`]: inputTypePropertyOptions[
        `${property.input_type_id}-${property.id}`
      ].map((op) => ({
        ...op,
        checked: op.id === option.id,
      })),
    });

    setInputTypeProperties({
      ...inputTypeProperties,
      [property.input_type_id]: inputTypeProperties[property.input_type_id].map(
        (prop) => ({
          ...prop,
          ...(prop.id === property.id && {
            value: option.option_value,
          }),
        })
      ),
    });
  }

  function handleInputChange(value: string, property: InputTypePropertyType) {
    setInputTypeProperties({
      ...inputTypeProperties,
      [property.input_type_id]: inputTypeProperties[property.input_type_id].map(
        (prop) => ({
          ...prop,
          ...(prop.id === property.id && {
            value,
          }),
        })
      ),
    });
  }

  useEffect(() => {
    getInputTypePropertiesLocal();
    getInputTypePropertyOptionsLocal();
  }, []);

  if (!form.form) return <p>Form not found</p>;

  if (!stagedNewInputType) return <p>No staged new input type</p>;

  return (
    <div className="staged-item-form">
      <form className="staged-input-form">
        <div className="staged-input-type-info">
          <p className="name">{stagedNewInputType.name}</p>
          <p className="description">{stagedNewInputType.description}</p>
        </div>
        <div className="metadata">
          <input
            value={stagedInputTitle}
            onChange={(e) => setStagedInputTitle(e.target.value)}
            placeholder={"Question"}
          />
          {descriptionToggled ? (
            <textarea
              value={stagedInputDescription}
              placeholder="Description"
              onChange={(e) => setStagedInputDescription(e.target.value)}
            />
          ) : (
            false
          )}
          <button
            onClick={() => setDescriptionToggled(!descriptionToggled)}
            type="button"
          >
            {descriptionToggled ? "Remove Description" : "Add Description"}
          </button>
        </div>
        <div className="properties">
          {inputTypeProperties[stagedNewInputType.id]?.map((itemTypeProperty) => (
            <div className={`property-container ${itemTypeProperty.property_type}`}>
              <label className="property-name">{itemTypeProperty.property_name}</label>
              <p className="property-description">
                {itemTypeProperty.property_description}
              </p>
              {inputTypePropertyOptions[
                `${itemTypeProperty.input_type_id}-${itemTypeProperty.id}`
              ] ? (
                <div className="radio-options">
                  {inputTypePropertyOptions[
                    `${itemTypeProperty.input_type_id}-${itemTypeProperty.id}`
                  ]?.map((option) => (
                    <button
                      type="button"
                      className={`${option.checked ? "checked" : ""}`}
                      onClick={() => {
                        handleOptionClick(itemTypeProperty, option);
                      }}
                    >
                      {option.option_name}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  placeholder={itemTypeProperty.property_name}
                  className={itemTypeProperty.property_type}
                  type={itemTypeProperty.property_type || "text"}
                  value={itemTypeProperty.value || ""}
                  onChange={(e) => handleInputChange(e.target.value, itemTypeProperty)}
                />
              )}
            </div>
          ))}
        </div>
      </form>

      <div className="navigation-buttons">
        <button
          className="navigation-button back"
          type="button"
          // onClick={() => handleInputReset()}
          onClick={() => setCurrentView("input-types-selector")}
        >
          <ArrowLeftIcon /> Back
        </button>
        <button
          className="navigation-button done"
          type="button"
          onClick={handleAddNewInput}
        >
          <CheckIcon /> Done, add to form
        </button>
      </div>
    </div>
  );
};
