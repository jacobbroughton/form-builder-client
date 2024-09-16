import { EmotionlessFace } from "../icons/EmotionlessFace";
import "./NoPromptsMessage.css";

export const NoPromptsMessage = () => {
  return (
    <div className="no-prompts-message">
      <EmotionlessFace />
      <p>Hmm... This form appears to not have any prompts...</p>
    </div>
  );
};
