import { ReactElement } from "react";
import "./ActionButtonWithIcon.css";

const ActionButtonWithIcon = ({
  disabled,
  icon,
  iconPlacement,
  handleClick,
  label,
  color = "none",
}: {
  disabled: boolean;
  icon: ReactElement;
  iconPlacement: "before" | "after";
  handleClick: () => void;
  label: string;
  color: "green" | "red" | "none";
}) => {
  return (
    <button
      className={`action-button-with-icon ${color !== 'none' ? color : ''}`}
      disabled={disabled}
      onClick={handleClick}
    >
      {iconPlacement === "before" && icon} {label} {iconPlacement === "after" && icon}
    </button>
  );
};
export default ActionButtonWithIcon;
