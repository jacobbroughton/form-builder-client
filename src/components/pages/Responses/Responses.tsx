import { useParams } from "react-router-dom";
import { useResponses } from "../../../hooks/useResponses";
import FormHeader from "../../ui/FormHeader/FormHeader";
import "./Responses.css";

const Responses = () => {
  const { formId } = useParams();
  const { /*responses*/ form, loading } = useResponses();

  return (
    <main className="responses">
      <FormHeader form={form} setDeleteModalShowing={() => null} />
      <div className="container">
        <h3>Responses</h3>
        <p>{formId}</p>
      </div>
    </main>
  );
};
export default Responses;
