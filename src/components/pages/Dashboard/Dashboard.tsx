import { useGetMyForms } from "../../../hooks/useGetMyForms";
import { useGetPublicForms } from "../../../hooks/useGetPublicForms";
import { useGetAnsweredForms } from "../../../hooks/useGetAnsweredForms";
import FormsContainer from "../../ui/FormsContainer/FormsContainer";
import "./Dashboard.css";

export const Dashboard = () => {
  const { getMyForms } = useGetMyForms();
  const { getPublicForms } = useGetPublicForms();
  const { getAnsweredForms } = useGetAnsweredForms();

  return (
    <main className="forms">
      <div className="container">
        <FormsContainer label="Public Forms" getFormsFunc={getPublicForms} />
        <FormsContainer label="My Forms" getFormsFunc={getMyForms} />
        <FormsContainer label="Answered Forms" getFormsFunc={getAnsweredForms} />
      </div>
    </main>
  );
};
