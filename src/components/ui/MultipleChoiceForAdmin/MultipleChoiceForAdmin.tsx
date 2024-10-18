import { MultipleChoiceOptionType } from "../../../lib/types";
import { PlusIcon } from "../icons/PlusIcon";
import { XIcon } from "../icons/XIcon";
import "./MultipleChoiceForAdmin.css";

export function MultipleChoiceForAdmin ({
  options,
  setOptions,
}: {
  options: MultipleChoiceOptionType[];
  setOptions: React.Dispatch<React.SetStateAction<MultipleChoiceOptionType[]>>;
}) {
  function handleOptionLabelChange(
    e: React.ChangeEvent,
    option: MultipleChoiceOptionType
  ) {
    setOptions(
      options.map((innerOption) => {
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
    const lastChoiceId = options[options.length - 1]?.id || 0;

    setOptions([...options, { id: lastChoiceId + 1, label: "" }]);
  }

  function handleDeleteOption(option: MultipleChoiceOptionType) {
    const newOptions = options.filter((innerOption) => innerOption.id !== option.id);
    setOptions(newOptions);
  }

  const addOptionDisabled = options.length === 10;

  return (
    <div className="multiple-choice-for-admin">
      {/* {options.length === 0 ? (
        <p>No option created yet</p>
      ) : ( */}
        <div className="options">
          {options.map((option, i) => (
            <div key={option.id} className="option">
              <input
                onChange={(e) => handleOptionLabelChange(e, option)}
                value={option.label}
                placeholder={`Option ${i + 1}`}
              />
              <button type="button" onClick={() => handleDeleteOption(option)}>
                <XIcon />
              </button>
            </div>
          ))}
          {options.length <= 1 && <p className='small-text red italic'><i>Must have at least <strong>2</strong> options</i></p>}
        </div>
      {/* )} */}
      <button
        type="button"
        onClick={handleAddOption}
        className="add-option"
        disabled={addOptionDisabled}
      >
        <PlusIcon /> Add option
      </button>
    </div>
  );
};
