import { InputTypeType } from "../../../lib/types";
import "./InputTypeInfo.css";

const InputTypeInfo = ({ inputType }: { inputType: InputTypeType }) => {
  return (
    <div className="input-type-info">
      <p className="name">{inputType?.name}</p>
      <p className="description">{inputType?.description}</p>
    </div>
  );
};
export default InputTypeInfo;
