import { useLocation } from "react-router-dom";
import { XIcon } from "../../ui/icons/XIcon";
import "./ErrorBanner.css";

export function ErrorBanner ({
  message,
  setError,
}: {
  message: string;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const location = useLocation();

  const accountForSidebar = location.pathname.includes("/dashboard");

  return (
    <div className={`error-banner ${accountForSidebar ? "account-for-sidebar" : ""}`}>
      <p>{message}</p>
      <button onClick={() => setError(null)}>
        <XIcon />
      </button>
    </div>
  );
};
