import { useState } from "react";
import "./MultipleChoiceCreator.css";
import { XIcon } from "../icons/XIcon";
import { PlusIcon } from "../icons/PlusIcon";

type OptionType = {
  id: number;
  label: string;
};

export const MultipleChoiceCreator = () => {
  const [options, setOptions] = useState<OptionType[]>([
    {
      id: 1,
      label: "",
    },
    {
      id: 2,
      label: "",
    },
    {
      id: 3,
      label: "",
    },
  ]);

  function handleOptionLabelChange(e: React.ChangeEvent, option: OptionType) {
    setOptions(
      options.map((innerOption) => {
        console.log(innerOption, option);
        return {
          ...innerOption,
          ...(innerOption.id === option.id && {
            label: (e.target as HTMLInputElement).value,
          }),
        };
      })
    );
  }

  function handleAddOption() {
    const lastChoiceId = options[options.length - 1].id || 0;

    setOptions([...options, { id: lastChoiceId + 1, label: "" }]);
  }

  function handleDeleteOption(option: OptionType) {
    const newOptions = options.filter((innerOption) => innerOption.id !== option.id);
    setOptions(newOptions);
  }

  return (
    <div className="multiple-choice-creator">
      {options.length === 0 ? (
        <p>No option created yet</p>
      ) : (
        <div className="options">
          {options.map((option, i) => (
            <div key={option.id} className="option">
              <input
                onChange={(e) => handleOptionLabelChange(e, option)}
                value={option.label}
                placeholder={`Option ${i}`}
              />
              <button type="button" onClick={() => handleDeleteOption(option)}>
                <XIcon/>
              </button>
            </div>
          ))}
        </div>
      )}
      <button type="button" onClick={handleAddOption} className="add-option">
        <PlusIcon/> Add option
      </button>
    </div>
  );
};
