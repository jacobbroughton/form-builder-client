import { InputTypeType } from "../../../lib/types";
import { InfoIcon } from "../icons/InfoIcon";
import "./InputTypeInfo.css";

export function InputTypeInfo({ inputType }: { inputType: InputTypeType }) {
  return (
    <div className="input-type-info">
      <div className="heading">
        <InfoIcon />
        <p className="name">{inputType?.name}</p>
      </div>
      <div className="content">
        <p className="description">{inputType?.description}</p>
      </div>
    </div>
  );
}
