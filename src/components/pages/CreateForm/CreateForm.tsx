import { useEffect, useState } from "react";
import "./CreateForm.css";
import {
  FormItemTypeType,
  FormItemTypePropertyType,
  FormItemTypePropertyOptionType,
} from "../../../lib/types";
import ArrowLeftIcon from "../../ui/icons/ArrowLeftIcon";
import XIcon from "../../ui/icons/XIcon";

const CreateForm = () => {
  const [formItems, setFormItems] = useState([]);
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

  async function getFormItemTypes(): Promise<void> {
    try {
      const response = await fetch("http://localhost:3001/form/item-types");

      if (!response.ok) throw new Error("An error occured while fetching form types");

      const data = await response.json();

      setFormItemTypes(data);

      console.log("types", data);
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

      console.log("properties", data);
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

      console.log("options", data);
    } catch (error) {
      if (typeof error === "string") {
        console.log(error.toUpperCase());
      } else if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  useEffect(() => {
    getFormItemTypes();
    getFormItemTypeProperties();
    getFormItemTypePropertyOptions();
  }, []);

  return (
    <main className="create-form">
      <h1>Create Form</h1>
      {formItemTypesSelectorOpen ? (
        false
      ) : formItems.length === 0 ? (
        <div className="no-items-yet">
          <p>You haven't added any items yet</p>
        </div>
      ) : (
        <div>
          <i>Render items here</i>
        </div>
      )}
      <form>
        {formItemTypesSelectorOpen && formItemTypes.length ? (
          <div className="form-item-types">
            {formItemTypes
              .filter((itemTypeProperty) => {
                if (stagedNewFormItemType) {
                  if (itemTypeProperty.id === stagedNewFormItemType.id) return true;
                  return false;
                }
                return true;
              })
              .map((formItemType) => (
                <>
                  <button
                    className={`${
                      stagedNewFormItemType?.id === formItemType.id ? "selected" : ""
                    }`}
                    type="button"
                    onClick={() =>
                      setStagedNewFormItemType(
                        stagedNewFormItemType ? null : formItemType
                      )
                    }
                  >
                    <p className="name">{formItemType.name}</p>
                    <p className="description">{formItemType.description}</p>
                  </button>
                  {formItemTypeProperties[formItemType.id].length &&
                  stagedNewFormItemType?.id === formItemType.id ? (
                    <div className="properties">
                      <label>Properties</label>
                      {formItemTypeProperties[formItemType.id].map((itemTypeProperty) => (
                        <div
                          className={`property-container ${itemTypeProperty.property_type}`}
                        >
                          <label>{itemTypeProperty.property_name}</label>
                          {formItemTypePropertyOptions[itemTypeProperty.id] ? (
                            <div className="radio-options">
                              {formItemTypePropertyOptions[itemTypeProperty.id]?.map(
                                (option) => (
                                  <button>{option.option_name}</button>
                                )
                              )}
                            </div>
                          ) : (
                            <input
                              placeholder={itemTypeProperty.property_name}
                              type={itemTypeProperty.property_type || "text"}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    false
                  )}
                </>
              ))}
          </div>
        ) : (
          <button
            className="add-new-form-item"
            type="button"
            onClick={() => setFormItemTypesSelectorOpen(true)}
          >
            Add new form item
          </button>
        )}
        {stagedNewFormItemType ? (
          <button
            className="navigation-button"
            type="button"
            onClick={() => setStagedNewFormItemType(null)}
          >
            <ArrowLeftIcon /> Back
          </button>
        ) : formItemTypesSelectorOpen ? (
          <button
            className="navigation-button"
            type="button"
            onClick={() => setFormItemTypesSelectorOpen(false)}
          >
            <XIcon /> Cancel
          </button>
        ) : (
          false
        )}
      </form>
    </main>
  );
};
export default CreateForm;
