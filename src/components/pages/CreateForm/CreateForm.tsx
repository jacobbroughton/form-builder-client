import { useEffect, useState } from "react";
import "./CreateForm.css";
import { FormItemTypeType, FormItemTypePropertyType } from "../../../lib/types";

const CreateForm = () => {
  const [formItems, setFormItems] = useState([]);
  const [formItemTypes, setFormItemTypes] = useState<FormItemTypeType[]>([]);
  const [formItemTypesSelectorOpen, setFormItemTypesSelectorOpen] =
    useState<boolean>(false);
  const [stagedNewFormItemType, setStagedNewFormItemType] =
    useState<FormItemTypeType | null>(null);
  const [formItemTypeProperties, setFormItemTypeProperties] = useState<
    FormItemTypePropertyType[]
  >([]);

  async function addNewFormItem(): Promise<void> {
    try {
      console.log("swag");
    } catch (error) {
      if (typeof error === "string") {
        console.log(error.toUpperCase()); // works, `e` narrowed to string
      } else if (error instanceof Error) {
        console.log(error.message); // works, `e` narrowed to Error
      }
    }
  }

  async function getFormItemTypes(): Promise<void> {
    try {
      const response = await fetch("http://localhost:3001/form/item-types");

      if (!response.ok) throw new Error("An error occured while fetching form types");

      const data = await response.json();

      setFormItemTypes(data);

      console.log(data);
    } catch (error) {
      if (typeof error === "string") {
        console.log(error.toUpperCase()); // works, `e` narrowed to string
      } else if (error instanceof Error) {
        console.log(error.message); // works, `e` narrowed to Error
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

      console.log(data);
    } catch (error) {
      if (typeof error === "string") {
        console.log(error.toUpperCase()); // works, `e` narrowed to string
      } else if (error instanceof Error) {
        console.log(error.message); // works, `e` narrowed to Error
      }
    }
  }

  useEffect(() => {
    getFormItemTypes();
    getFormItemTypeProperties();
  }, []);

  console.log({ formItemTypeProperties, stagedNewFormItemType });

  return (
    <main className="create-form">
      <h1>Create Form</h1>

      <form>
        {formItemTypesSelectorOpen && formItemTypes.length ? (
          <ul className="form-item-types">
            {formItemTypes.map((formItemType) => (
              <>
                <button
                  className={`${
                    stagedNewFormItemType?.id === formItemType.id ? "selected" : ""
                  }`}
                  type="button"
                  onClick={() => setStagedNewFormItemType(formItemType)}
                >
                  <p className="name">{formItemType.name}</p>
                  <p className="description">{formItemType.description}</p>
                </button>
                {formItemTypeProperties[formItemType.id].length &&
                stagedNewFormItemType?.id === formItemType.id ? (
                  <div className="properties">
                    <p>Properties</p>
                    {console.log(formItemTypeProperties[formItemType.id])}
                    {formItemTypeProperties[formItemType.id].map((itemTypeProperty) => (
                      <div>{itemTypeProperty.property_name}</div>
                    ))}
                  </div>
                ) : (
                  false
                )}
              </>
            ))}
            <button type="button" onClick={() => setFormItemTypesSelectorOpen(false)}>
              Cancel
            </button>
          </ul>
        ) : (
          <button
            className="add-new-form-item"
            type="button"
            onClick={() => setFormItemTypesSelectorOpen(true)}
          >
            Add new form item
          </button>
        )}
      </form>
    </main>
  );
};
export default CreateForm;
