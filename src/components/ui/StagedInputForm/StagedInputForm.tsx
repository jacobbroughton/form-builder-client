import { useContext, useEffect, useState } from "react";
import {
  InputType,
  AllFormsType,
  InputTypePropertyOptionType,
  InputTypePropertyType,
  InputTypeType,
} from "../../../lib/types";
import { useAddNewInputToDraftForm } from "../../../hooks/useAddNewInputToDraftForm";
import { useAddNewInputToPublishedForm } from "../../../hooks/useAddNewInputToPublishedForm";
import { useGetInputTypeProperties } from "../../../hooks/useGetInputTypeProperties";
import { useGetInputTypePropertyOptions } from "../../../hooks/useGetInputTypePropertyOptions";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";
import { CheckIcon } from "../icons/CheckIcon";
import "./StagedInputForm.css";
import PropertiesIcon from "../icons/PropertiesIcon";
import SingleSelectToggle from "../SingleSelectToggle/SingleSelectToggle";

export const StagedInputForm = ({
  form,
  setForm,
  setCurrentView,
  stagedNewInputType,
  setStagedNewInputType,
  isForDraft,
}: {
  form: { form: AllFormsType | null; inputs: InputType[] };
  setForm: React.Dispatch<
    React.SetStateAction<{
      form: AllFormsType | null;
      inputs: InputType[];
    }>
  >;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  stagedNewInputType: InputTypeType | null;
  setStagedNewInputType: React.Dispatch<React.SetStateAction<InputTypeType | null>>;
  isForDraft: boolean;
}) => {
  const { addNewInputToDraftForm } = useAddNewInputToDraftForm();
  const { addNewInputToPublishedForm } = useAddNewInputToPublishedForm();
  const { getInputTypeProperties } = useGetInputTypeProperties();
  const { getInputTypePropertyOptions } = useGetInputTypePropertyOptions();

  const { setError } = useContext(ErrorContext);

  const [stagedInputTitle, setStagedInputTitle] = useState<string>("Untitled Question");
  const [stagedInputDescription, setStagedInputDescription] = useState<string>("");
  const [isRequired, setIsRequired] = useState(false);

  const [inputTypePropertyOptions, setInputTypePropertyOptions] = useState<{
    [key: string]: InputTypePropertyOptionType[];
  }>({});
  const [inputTypeProperties, setInputTypeProperties] = useState<{
    [key: string]: InputTypePropertyType[];
  }>({});
  const [propertiesToggled, setPropertiesToggled] = useState(false);

  async function getInputTypePropertiesLocal(): Promise<void> {
    try {
      const data = await getInputTypeProperties();

      setInputTypeProperties(data);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  async function getInputTypePropertyOptionsLocal(): Promise<void> {
    try {
      const data = await getInputTypePropertyOptions();

      setInputTypePropertyOptions(data);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  async function handleAddNewInput(): Promise<void> {
    try {
      const properties = inputTypeProperties[stagedNewInputType!.id];

      let data;

      if (isForDraft) {
        data = await addNewInputToDraftForm({
          inputTypeId: stagedNewInputType?.id,
          inputMetadataQuestion: stagedInputTitle,
          inputMetadataDescription: stagedInputDescription,
          properties,
          formId: form.form!.id,
          isRequired,
        });
      } else {
        data = await addNewInputToPublishedForm({
          inputTypeId: stagedNewInputType?.id,
          inputMetadataQuestion: stagedInputTitle,
          inputMetadataDescription: stagedInputDescription,
          properties,
          formId: form.form!.id,
          isRequired,
        });
      }

      setForm({
        ...form,
        inputs: [...form.inputs, data],
      });

      handleInputReset();

      setCurrentView("metadata-inputs");
    } catch (error) {
      console.log("error here");
      handleCatchError(error, setError, null);
    }
  }

  function handleInputReset(): void {
    setStagedInputTitle("Untitled Question");
    setStagedInputDescription("");
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
    <div className="staged-input-form">
      <form className="staged-input-form">
        <div className="staged-input-type-info">
          <p className="name">{stagedNewInputType.name}</p>
          <p className="description">{stagedNewInputType.description}</p>
        </div>
        <div className="metadata">
          <div className="form-group-container">
            <p className="small-text bold">Question/Prompt *</p>
            <input
              value={stagedInputTitle}
              onChange={(e) => {
                e.preventDefault();
                setStagedInputTitle(e.target.value);
              }}
              placeholder={"Question"}
            />
          </div>
          <div className="form-group-container">
            <p className="small-text bold">
              Description <span className="optional">(optional)</span>
            </p>
            <textarea
              value={stagedInputDescription}
              placeholder="Description"
              onChange={(e) => {
                e.preventDefault();
                setStagedInputDescription(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={`properties-container ${propertiesToggled ? "toggled" : ""}`}>
          <div className="header">
            <button
              className="properties-toggle"
              type="button"
              onClick={() => setPropertiesToggled(!propertiesToggled)}
            >
              <div className="icon-container">
                <PropertiesIcon />
              </div>
              <div className="content">
                <p>Show optional properties</p>
              </div>
            </button>
          </div>
          {propertiesToggled ? (
            <div className="properties">
              {inputTypeProperties[stagedNewInputType.id]?.map((itemTypeProperty) => (
                <div className={`property-container ${itemTypeProperty.property_type}`}>
                  <label className="small-text bold property-name">
                    {itemTypeProperty.property_name}
                  </label>
                  <p className="small-text property-description">
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
                          key={option.id}
                        >
                          {option.option_name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      // placeholder={itemTypeProperty.property_name}
                      placeholder="..."
                      className={itemTypeProperty.property_type}
                      type={itemTypeProperty.property_type || "text"}
                      value={itemTypeProperty.value || ""}
                      onChange={(e) =>
                        handleInputChange(e.target.value, itemTypeProperty)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            false
          )}
        </div>
        <SingleSelectToggle
          label="Required?"
          options={[
            { label: "Yes", value: true, checkedCondition: isRequired },
            { label: "No", value: false, checkedCondition: !isRequired },
          ]}
          onChange={(value) => setIsRequired(value as boolean)}
        />
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
