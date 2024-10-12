import { useContext } from "react";
import { FormContext } from "../../../providers/FormProvider";
import "./FormCreator.css";
import { elapseTime } from "../../../utils/usefulFunctions";

const FormCreator = () => {
  const { form } = useContext(FormContext);

  return (
    <div className="form-creator-container">
      <div className="profile-picture-container">
        <img src={form?.created_by_profile_picture} />
      </div>
      <p className="small-text bold">@{form?.created_by_username} </p>
      <p className="tiny-text">
        {new Date(form?.created_at as string).toLocaleDateString()} |{" "}
        {elapseTime(form?.created_at || "")} ago
      </p>
    </div>
  );
};
export default FormCreator;
