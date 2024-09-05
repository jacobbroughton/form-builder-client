import { useEffect, useState } from "react";
import "./CreateForm.css";
import {
  FormItemTypeType,
  FormItemTypePropertyType,
  FormItemTypePropertyOptionType,
  FormItemTypePropertyValueType,
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
  const [descriptionToggled, setDescriptionToggled] = useState<boolean>(false);
  const [formItems, setFormItems] = useState<object[]>([]);
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

  async function handleAddNewFormItem(): Promise<void> {
    try {
      const inputTypeId =
        formItemTypeProperties[stagedNewFormItemType!.id][0].input_type_id;
      const optionKeys = Object.keys(formItemTypePropertyOptions).filter((key) =>
        key.includes(`${inputTypeId}-`)
      );

      const properties = formItemTypeProperties[stagedNewFormItemType!.id];
      const options = optionKeys.map((key) => formItemTypePropertyOptions[key]);

      setFormItems([
        ...formItems,
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
  }, []);

  const metadataInputsShowing = !formItemTypesSelectorOpen && !stagedNewFormItemType;
  const formItemTypeSelectorShowing = formItemTypesSelectorOpen && formItemTypes.length;
  const stagedItemFormShowing =
    stagedNewFormItemType && formItemTypeProperties[stagedNewFormItemType.id].length;

  return (
    <main className="create-form">
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
          {formItems.length === 0 ? (
            <div className="no-items-yet">
              <p>You haven't added any items yet</p>
            </div>
          ) : (
            <div className="added-form-items">
              {formItems.map((formItem) => (
                <div className="added-form-item" onClick={() => console.log(formItem)}>
                  <p className="name">{formItem.metadata.name}</p>
                  <div className="tags">
                    <p>{formItem.inputType.name}</p>
                    <p>
                      {
                        formItem.properties.filter((property) => property.value !== "")
                          .length
                      }{" "}
                      custom properties
                    </p>
                  </div>
                  <button className='edit-button'>
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
