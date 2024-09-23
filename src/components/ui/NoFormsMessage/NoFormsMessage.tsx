import { EmotionlessFace } from "../icons/EmotionlessFace";
import "./NoFormsMessage.css";

const NoFormsMessage = () => {
  return (
    <div className="no-forms-message">
      <EmotionlessFace />
      <p className="small-text">You have not created any forms</p>
    </div>
  );
};
export default NoFormsMessage;
