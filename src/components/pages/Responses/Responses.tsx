import { useParams } from "react-router-dom";
import "./Responses.css";
import { useEffect } from "react";
import { useResponses } from "../../../hooks/useResponses";
import { ArrowLeftIcon } from "../../ui/icons/ArrowLeftIcon";
import { Link } from "react-router-dom";

const Responses = () => {
  const { formId } = useParams();
  const { responses } = useResponses();

  useEffect(() => {
    console.log({ responses });
  }, []);

  return (
    <main className="responses">
      <div className="container">
        <Link className="go-back" to={`/form/${formId}`}>
          <ArrowLeftIcon /> <p>Go back to form</p>
        </Link>
        <h3>Responses</h3>
        <p>{formId}</p>
      </div>
    </main>
  );
};
export default Responses;
