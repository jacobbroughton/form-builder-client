import { useEffect, useState } from "react";
import "./CreateForm.css";
import {
  FormItemTypeType,
  FormItemTypePropertyType,
  FormItemTypePropertyOptionType,
  AddedFormItemType,
} from "../../../lib/types";
import ArrowLeftIcon from "../../ui/icons/ArrowLeftIcon";
import XIcon from "../../ui/icons/XIcon";
import CheckIcon from "../../ui/icons/CheckIcon";
import PlusIcon from "../../ui/icons/PlusIcon";
import ThreeDotsIcon from "../../ui/icons/ThreeDotsIcon";

const CreateForm = () => {
  const [formTitle, setFormTitle] = useState<string>("Untitled");
  const [formDescription, setFormDescription] = useState<string>("");
  const [stagedInputName, setStagedInputName] = useState<string>("Untitled");
  const [stagedInputDescription, setStagedInputDescription] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState(5);
  const [needsAutoSave, setNeedsAutoSave] = useState(true);
  const [descriptionToggled, setDescriptionToggled] = useState<boolean>(false);
  const [addedFormItems, setAddedFormItems] = useState<AddedFormItemType[]>([]);
  const [formItemTypes, setFormItemTypes] = useState<FormItemTypeType[]>([]);
  const [formItemTypesSelectorOpen, setFormItemTypesSelectorOpen] =
    useState<boolean>(false);
  const [stagedNewFormItemType, setStagedNewFormItemType] =
    useState<FormItemTypeType | null>(null);
  const [formItemTypeProperties, setFormItemTypeProperties] = useState<{
    [key: string]: FormItemTypePropertyType[];
  }>({});
  const [formItemTypePropertyOptions, setFormItemTypePropertyOptions] = useState<{
    [key: string]: FormItemTypePropertyOptionType[];
  }>({});
  const [prevSavedForm, setPrevSavedForm] = useState({
    title: formTitle,
    description: formDescription,
    formItems: addedFormItems,
  });

  async function handleAddNewFormItem(): Promise<void> {
    try {
      const properties = formItemTypeProperties[stagedNewFormItemType!.id];

      setAddedFormItems([
        ...addedFormItems,
        {
          inputType: stagedNewFormItemType,
          metadata: {
            name: stagedInputName,
            description: stagedInputDescription,
          },
          properties,
        },
      ]);

      handleInputReset();

      setFormItemTypesSelectorOpen(false);

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

  async function getFormItemTypes(): Promise<void> {
    try {
      const response = await fetch("http://localhost:3001/form/item-types");

      if (!response.ok) throw new Error("An error occured while fetching form types");

      const data = await response.json();

      setFormItemTypes(data);
    } catch (error) {
      if (typeof error === "string") {
        console.log(error.toUpperCase());
      } else if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  async function getFormItemTypeProperties(): Promise<void> {
    try {
      const response = await fetch("http://localhost:3001/form/item-type-properties");

      if (!response.ok)
        throw new Error("An error occured while fetching form item type properties");

      const data = await response.json();

      setFormItemTypeProperties(data);
    } catch (error) {
      if (typeof error === "string") {
        console.log(error.toUpperCase());
      } else if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  async function getFormItemTypePropertyOptions(): Promise<void> {
    try {
      const response = await fetch(
        "http://localhost:3001/form/item-type-property-options"
      );

      if (!response.ok)
        throw new Error(
          "An error occured while fetching form item type property options"
        );

      const data = await response.json();

      setFormItemTypePropertyOptions(data);
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
      if (isStoring) return;
      isStoring = true;
      const response1 = await fetch(
        "http://localhost:3001/form/check-for-existing-draft?userId=1"
      );

      if (!response1.ok)
        throw new Error("An error occured while checking for existing draft");

      const data = await response1.json();

      console.log(data);

      if (data.length == 0) {
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
        // TODO: Do something with existing draft
        // console.log("Found existing draft", data);
      }
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
    property: FormItemTypePropertyType,
    option: FormItemTypePropertyOptionType
  ) {
    setFormItemTypePropertyOptions({
      ...formItemTypePropertyOptions,
      [`${property.input_type_id}-${property.id}`]: formItemTypePropertyOptions[
        `${property.input_type_id}-${property.id}`
      ].map((op) => ({
        ...op,
        checked: op.id === option.id,
      })),
    });

    setFormItemTypeProperties({
      ...formItemTypeProperties,
      [property.input_type_id]: formItemTypeProperties[property.input_type_id].map(
        (prop) => ({
          ...prop,
          ...(prop.id === property.id && {
            value: option.option_value,
          }),
        })
      ),
    });
  }

  function handleInputChange(value: string, property: FormItemTypePropertyType) {
    setFormItemTypeProperties({
      ...formItemTypeProperties,
      [property.input_type_id]: formItemTypeProperties[property.input_type_id].map(
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
    setStagedNewFormItemType(null);
  }

  useEffect(() => {
    getFormItemTypes();
    getFormItemTypeProperties();
    getFormItemTypePropertyOptions();
    storeDraftForm();
  }, []);

  useEffect(() => {
    async function autoSaveDraft(): Promise<void> {
      try {
        console.log("Saved", {
          metadata: { title: formTitle, description: formDescription },
          formItems: addedFormItems,
        });
        setPrevSavedForm({
          title: formTitle,
          description: formDescription,
          formItems: addedFormItems,
        });

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
    }, 5000);

    return () => {
      clearInterval(interval1);
    };
  }, [needsAutoSave, addedFormItems, formDescription, formTitle]);

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
      formTitle !== prevSavedForm?.title ||
      formDescription !== prevSavedForm?.description ||
      addedFormItems !== prevSavedForm?.formItems
    ) {
      console.log("Yes");
      setSaved(false);
      setNeedsAutoSave(true);
    } else {
      console.log("no");
    }
  }, [
    addedFormItems,
    formDescription,
    formTitle,
    prevSavedForm?.description,
    prevSavedForm?.formItems,
    prevSavedForm?.title,
  ]);

  const metadataInputsShowing = !formItemTypesSelectorOpen && !stagedNewFormItemType;
  const formItemTypeSelectorShowing = formItemTypesSelectorOpen && formItemTypes.length;
  const stagedItemFormShowing =
    stagedNewFormItemType && formItemTypeProperties[stagedNewFormItemType.id].length;

  return (
    <main className="create-form">
      <p className="saved-status">
        <span className={`${saved ? "saved" : ""}`}></span>
        {saved ? "Saved Draft" : "Unsaved"}{" "}
        {!saved ? `(Autosaving in ${autoSaveCountdown}s)` : false}
      </p>
      {metadataInputsShowing && (
        <>
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
          {addedFormItems.length === 0 ? (
            <div className="no-items-yet">
              <p>You haven't added any items yet</p>
            </div>
          ) : (
            <div className="added-form-items">
              {addedFormItems.map((formItem) => (
                <div className="added-form-item" onClick={() => console.log(formItem)}>
                  <p className="name">{formItem.metadata.name}</p>
                  <div className="tags">
                    <p>{formItem.inputType?.name || "Unnamed"}</p>
                    <p>
                      {
                        formItem.properties.filter((property) => property.value !== "")
                          .length
                      }{" "}
                      custom properties
                    </p>
                  </div>
                  <button className="edit-button">
                    <ThreeDotsIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            className="add-new-form-item"
            type="button"
            onClick={() => setFormItemTypesSelectorOpen(true)}
          >
            <PlusIcon /> Add new form item
          </button>
        </>
      )}

      {stagedItemFormShowing ? (
        <form className="staged-form-item-form">
          <div className="staged-form-item-type-info">
            <p className="name">{stagedNewFormItemType.name}</p>
            <p className="description">{stagedNewFormItemType.description}</p>
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
            {formItemTypeProperties[stagedNewFormItemType.id].map((itemTypeProperty) => (
              <div className={`property-container ${itemTypeProperty.property_type}`}>
                <label className="property-name">{itemTypeProperty.property_name}</label>
                <p className="property-description">
                  {itemTypeProperty.property_description}
                </p>
                {formItemTypePropertyOptions[
                  `${itemTypeProperty.input_type_id}-${itemTypeProperty.id}`
                ] ? (
                  <div className="radio-options">
                    {formItemTypePropertyOptions[
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

      {formItemTypeSelectorShowing ? (
        <>
          <div className="navigation-buttons">
            <button
              className="navigation-button cancel"
              type="button"
              onClick={() => setFormItemTypesSelectorOpen(false)}
            >
              <XIcon /> Cancel
            </button>
          </div>
          <div className="form-item-types-selector">
            {formItemTypes.map((formItemType) => (
              <>
                <button
                  className={`${
                    stagedNewFormItemType?.id === formItemType.id ? "selected" : ""
                  }`}
                  type="button"
                  onClick={() => {
                    handleInputReset();
                    setStagedNewFormItemType(stagedNewFormItemType ? null : formItemType);
                    setFormItemTypesSelectorOpen(false);
                  }}
                >
                  <p className="name">{formItemType.name}</p>
                  <p className="description">{formItemType.description}</p>
                </button>
              </>
            ))}
          </div>
        </>
      ) : (
        false
      )}
      {stagedNewFormItemType ? (
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
            onClick={handleAddNewFormItem}
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
