import { useEffect, useState } from "react";
import "./CreateForm.css";
import {
  InputTypeType,
  InputTypePropertyType,
  InputTypePropertyOptionType,
  AddedInputType,
} from "../../../lib/types";
import ArrowLeftIcon from "../../ui/icons/ArrowLeftIcon";
import XIcon from "../../ui/icons/XIcon";
import CheckIcon from "../../ui/icons/CheckIcon";
import PlusIcon from "../../ui/icons/PlusIcon";
import ThreeDotsIcon from "../../ui/icons/ThreeDotsIcon";
import InputPopupMenu from "../../ui/InputPopupMenu/InputPopupMenu";
import TrashIcon from "../../ui/icons/TrashIcon";

const CreateForm = () => {
  const [draft, setDraft] = useState(null);
  const [formTitle, setFormTitle] = useState<string>("Untitled");
  const [formDescription, setFormDescription] = useState<string>("");
  const [stagedInputName, setStagedInputName] = useState<string>("Untitled");
  const [stagedInputDescription, setStagedInputDescription] = useState<string>("");
  const [checkForExistingDraftComplete, setCheckForExistingDraftComplete] =
    useState<boolean>(false);
  const [checkForExistingDraftLoading, setCheckForExistingDraftLoading] =
    useState<boolean>(true);
  const [saved, setSaved] = useState(true);
  const [idForInputPopup, setIdForInputPopup] = useState<number | null>(null);
  const [inputPopupToggled, setInputPopupToggled] = useState(false);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState(5);
  const [needsAutoSave, setNeedsAutoSave] = useState(true);
  const [descriptionToggled, setDescriptionToggled] = useState<boolean>(false);
  const [addedInputs, setAddedInputs] = useState<AddedInputType[]>([]);
  const [inputTypes, setInputTypes] = useState<InputTypeType[]>([]);
  const [inputTypesSelectorOpen, setInputTypesSelectorOpen] = useState<boolean>(false);
  const [stagedNewInputType, setStagedNewInputType] = useState<InputTypeType | null>(
    null
  );
  const [inputTypeProperties, setInputTypeProperties] = useState<{
    [key: string]: InputTypePropertyType[];
  }>({});
  const [inputTypePropertyOptions, setInputTypePropertyOptions] = useState<{
    [key: string]: InputTypePropertyOptionType[];
  }>({});
  const [prevSavedForm, setPrevSavedForm] = useState({
    title: formTitle,
    description: formDescription,
    inputs: addedInputs,
  });

  async function handleAddNewInput(): Promise<void> {
    try {
      const properties = inputTypeProperties[stagedNewInputType!.id];

      const response = await fetch("http://localhost:3001/form/add-new-input-to-draft", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          input: {
            input_type_id: stagedNewInputType?.id,
            metadata_name: stagedInputName,
            metadata_description: stagedInputDescription,
            properties,
          },
          form: {
            id: draft.form.id,
          },
          userId: 1,
        }),
      });

      if (!response.ok)
        throw new Error(
          "Something happened when trying to add a new form item to the draft"
        );

      const data = await response.json();

      console.log("Added form item", data);

      console.log({ properties });

      setAddedInputs([...addedInputs, data]);

      handleInputReset();

      setInputTypesSelectorOpen(false);
      setSaved(false);
      setNeedsAutoSave(true);
    } catch (error) {
      if (typeof error === "string") {
        console.log(error.toUpperCase());
      } else if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  async function getInputTypes(): Promise<void> {
    try {
      const response = await fetch("http://localhost:3001/form/item-types");

      if (!response.ok) throw new Error("An error occured while fetching form types");

      const data = await response.json();

      setInputTypes(data);
    } catch (error) {
      if (typeof error === "string") {
        console.log(error.toUpperCase());
      } else if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  async function getInputTypeProperties(): Promise<void> {
    try {
      const response = await fetch("http://localhost:3001/form/item-type-properties");

      if (!response.ok)
        throw new Error("An error occured while fetching form item type properties");

      const data = await response.json();

      setInputTypeProperties(data);
    } catch (error) {
      if (typeof error === "string") {
        console.log(error.toUpperCase());
      } else if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  async function getInputTypePropertyOptions(): Promise<void> {
    try {
      const response = await fetch(
        "http://localhost:3001/form/item-type-property-options"
      );

      if (!response.ok)
        throw new Error(
          "An error occured while fetching form item type property options"
        );

      const data = await response.json();

      setInputTypePropertyOptions(data);
    } catch (error) {
      if (typeof error === "string") {
        console.log(error.toUpperCase());
      } else if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  let isStoring = false;

  async function storeDraftForm(): Promise<void> {
    try {
      setCheckForExistingDraftLoading(true);
      if (isStoring) return;
      isStoring = true;
      const response1 = await fetch(
        "http://localhost:3001/form/check-for-existing-draft?userId=1"
      );

      if (!response1.ok)
        throw new Error("An error occured while checking for existing draft");

      const data = await response1.json();

      if (!data.form) {
        const response = await fetch("http://localhost:3001/form/store-initial-draft", {
          method: "post",
          body: JSON.stringify({
            userId: 1,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok)
          throw new Error("An error occured while storing initial form draft");

        const data = await response.json();

        console.log("Added draft to database", data);
      } else {
        setPrevSavedForm({
          title: data.form.name,
          description: data.form.description,
          inputs: data.inputs,
        });
        setAddedInputs(data.inputs);
        setFormTitle(data.form.name);
        setFormDescription(data.form.description);
      }

      setDraft(data);

      setCheckForExistingDraftLoading(false);
      setCheckForExistingDraftComplete(true);
      setSaved(true);
      setNeedsAutoSave(false);
    } catch (error) {
      if (typeof error === "string") {
        console.log(error.toUpperCase());
      } else if (error instanceof Error) {
        console.log(error.message);
      }
    }
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

  function handleInputReset(): void {
    setStagedInputName("Untitled");
    setStagedInputDescription("");
    setDescriptionToggled(false);
    setStagedNewInputType(null);
  }

  async function handleChangeDraftInputEnabledStatus(clickedInput): Promise<void> {
    try {
      const newActiveStatus = clickedInput.is_active ? 0 : 1;

      const response = await fetch(
        `http://localhost:3001/form/change-draft-input-enabled-status/${clickedInput.id}`,
        {
          method: "put",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            newActiveStatus,
          }),
        }
      );

      if (!response.ok)
        throw new Error("There was an error deleting this input from the draft form");

      const data = await response.json();

      setAddedInputs(
        addedInputs.map((input) => ({
          ...input,
          ...(input.id === clickedInput.id && { is_active: newActiveStatus }),
        }))
      );

      console.log("deleted input", data);
    } catch (error) {
      if (typeof error === "string") {
        console.log(error.toUpperCase());
      } else if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  useEffect(() => {
    getInputTypes();
    getInputTypeProperties();
    getInputTypePropertyOptions();
    storeDraftForm();
  }, []);

  useEffect(() => {
    async function autoSaveDraft(): Promise<void> {
      try {
        console.log("Saved", {
          metadata: { title: formTitle, description: formDescription },
          inputs: addedInputs,
        });
        setPrevSavedForm({
          title: formTitle,
          description: formDescription,
          inputs: addedInputs,
        });

        const response = await fetch("http://localhost:3001/form/update-draft", {
          method: "put",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            title: formTitle,
            description: formDescription,
            userId: 1,
            // inputs: addedInputs,
          }),
        });

        if (!response.ok)
          throw new Error("An error occured while updating the form draft");

        const data = await response.json();

        setSaved(true);
        setNeedsAutoSave(false);
        setAutoSaveCountdown(5);
      } catch (error) {
        if (typeof error === "string") {
          console.log(error.toUpperCase());
        } else if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }

    const interval1 = setInterval(() => {
      if (needsAutoSave) {
        autoSaveDraft();
      }
    }, autoSaveCountdown * 1000);

    return () => {
      clearInterval(interval1);
    };
  }, [needsAutoSave, addedInputs, formDescription, formTitle]);

  useEffect(() => {
    const interval2 = setInterval(() => {
      if (!saved) {
        setAutoSaveCountdown((prev) => (prev -= 1));
      }
    }, 1000);
    return () => {
      clearInterval(interval2);
    };
  }, [saved]);

  useEffect(() => {
    if (
      checkForExistingDraftLoading
        ? false
        : checkForExistingDraftComplete &&
          (formTitle !== prevSavedForm?.title ||
            formDescription !== prevSavedForm?.description ||
            addedInputs !== prevSavedForm?.inputs)
    ) {
      setSaved(false);
      setNeedsAutoSave(true);
    }
  }, [
    addedInputs,
    formDescription,
    formTitle,
    prevSavedForm?.description,
    prevSavedForm?.inputs,
    prevSavedForm?.title,
    checkForExistingDraftComplete,
  ]);

  const metadataInputsShowing = !inputTypesSelectorOpen && !stagedNewInputType;
  const inputTypeSelectorShowing = inputTypesSelectorOpen && inputTypes.length;
  const stagedItemFormShowing =
    stagedNewInputType && inputTypeProperties[stagedNewInputType.id].length;

  return (
    <main className="create-form">
      {metadataInputsShowing && (
        <>
          <p className="saved-status">
            <span className={`${saved ? "saved" : ""}`}></span>
            {saved ? "Saved Draft" : "Unsaved"}{" "}
            {!saved ? `(Autosaving in ${autoSaveCountdown}s)` : false}
          </p>
          <form className="title-and-description">
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Description"
            />
          </form>
          {addedInputs.length === 0 ? (
            <div className="no-items-yet">
              <p>You haven't added any items yet</p>
            </div>
          ) : (
            <div className="added-inputs">
              {addedInputs.map((input) => (
                <div className={`added-input ${input.is_active ? "" : "deleted"}`}>
                  <p className="name">{input.metadata_name}</p>
                  <div className="tags">
                    <p>{input.input_type_name || "Unnamed"}</p>
                    {input.num_custom_properties ? (
                      <p>{input.num_custom_properties} custom properties</p>
                    ) : (
                      false
                    )}
                  </div>
                  <button
                    className="popup-menu-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(input);
                      setIdForInputPopup(input.id);
                      setInputPopupToggled(
                        idForInputPopup == input.id ? !inputPopupToggled : true
                      );
                    }}
                  >
                    <ThreeDotsIcon />
                  </button>
                  {idForInputPopup == input.id && inputPopupToggled ? (
                    <InputPopupMenu
                      input={input}
                      setIdForInputPopup={setIdForInputPopup}
                      setInputPopupToggled={setInputPopupToggled}
                      handleChangeDraftInputEnabledStatus={() =>
                        handleChangeDraftInputEnabledStatus(input)
                      }
                    />
                  ) : (
                    false
                  )}
                </div>
              ))}
            </div>
          )}
          <button
            className="add-new-input"
            type="button"
            onClick={() => setInputTypesSelectorOpen(true)}
          >
            <PlusIcon /> Add new form item
          </button>
        </>
      )}

      {stagedItemFormShowing ? (
        <form className="staged-input-form">
          <div className="staged-input-type-info">
            <p className="name">{stagedNewInputType.name}</p>
            <p className="description">{stagedNewInputType.description}</p>
          </div>
          <div className="metadata">
            <input
              value={stagedInputName}
              onChange={(e) => setStagedInputName(e.target.value)}
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
            {/* <label>Properties</label> */}
            {inputTypeProperties[stagedNewInputType.id].map((itemTypeProperty) => (
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
      ) : (
        false
      )}

      {inputTypeSelectorShowing ? (
        <>
          <div className="navigation-buttons">
            <button
              className="navigation-button cancel"
              type="button"
              onClick={() => setInputTypesSelectorOpen(false)}
            >
              <XIcon /> Cancel
            </button>
          </div>
          <div className="input-types-selector">
            {inputTypes.map((inputType) => (
              <>
                <button
                  className={`${
                    stagedNewInputType?.id === inputType.id ? "selected" : ""
                  }`}
                  type="button"
                  onClick={() => {
                    handleInputReset();
                    setStagedNewInputType(stagedNewInputType ? null : inputType);
                    setInputTypesSelectorOpen(false);
                  }}
                >
                  <p className="name">{inputType.name}</p>
                  <p className="description">{inputType.description}</p>
                </button>
              </>
            ))}
          </div>
        </>
      ) : (
        false
      )}
      {stagedNewInputType ? (
        <div className="navigation-buttons">
          <button
            className="navigation-button back"
            type="button"
            onClick={() => handleInputReset()}
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
      ) : (
        false
      )}
    </main>
  );
};
export default CreateForm;
