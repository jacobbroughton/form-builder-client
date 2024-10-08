import { useState } from "react";
import PropertiesIcon from "../icons/PropertiesIcon";
import "./InputPropertiesContainer.css";
import { InputTypePropertyType, InputTypePropertyOptionType } from "../../../lib/types";
import { useInputTypePropertyOptions } from "../../../hooks/useInputTypePropertyOptions";
import { useInputTypeProperties } from "../../../hooks/useInputTypeProperties";
import CaretIcon from "../icons/CaretIcon";

const InputPropertiesContainer = ({ inputTypeId }: { inputTypeId: number }) => {
  const { inputTypeProperties, setInputTypeProperties } = useInputTypeProperties();
  const { inputTypePropertyOptions, setInputTypePropertyOptions } =
    useInputTypePropertyOptions();
  const [propertiesToggled, setPropertiesToggled] = useState(false);

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
    console.log(inputTypeProperties, value, property);
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

  return (
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
            <CaretIcon direction={propertiesToggled? 'up' : 'down'} />
          </div>
        </button>
      </div>
      {propertiesToggled ? (
        <div className="properties">
          {inputTypeProperties[inputTypeId]?.map((itemTypeProperty) => (
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
                  onChange={(e) => handleInputChange(e.target.value, itemTypeProperty)}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        false
      )}
    </div>
  );
};
export default InputPropertiesContainer;
