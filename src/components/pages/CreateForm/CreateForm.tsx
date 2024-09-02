import { useEffect, useState } from "react";
import "./CreateForm.css";

const CreateForm = () => {
  const [formItems, setFormItems] = useState([]);
  const [formItemTypes, setFormItemTypes] = useState([]);
  const [formItemTypesSelectorOpen, setFormItemTypesSelectorOpen] = useState(false);

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
      const response = await fetch("http://localhost:3001/form-item-types");

      if (!response.ok) throw new Error("An error occured while fetching form types");

      const data = await response.json();

      setFormItemTypes(data)

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
  }, []);

  return (
    <main>
      <h1>Create Form</h1>

      <form>
        {formItemTypesSelectorOpen && formItemTypes.length ? (
          <div>
            {formItemTypes.map((formItemType) => (
              <button type="button">{formItemType.name}</button>
            ))}
          </div>
        ) : (
          <button type="button" onClick={() => setFormItemTypesSelectorOpen(true)}>
            Add new form item
          </button>
        )}
      </form>
    </main>
  );
};
export default CreateForm;
