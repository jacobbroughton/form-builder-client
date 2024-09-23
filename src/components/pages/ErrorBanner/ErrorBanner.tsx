import { XIcon } from "../../ui/icons/XIcon";
import "./ErrorBanner.css"

export const ErrorBanner = ({
  message,
  setError,
}: {
  message: string;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <div className="error-banner">
      <p>{message}</p>
      <button onClick={() => setError(null)}><XIcon/></button>
    </div>
  );
};
