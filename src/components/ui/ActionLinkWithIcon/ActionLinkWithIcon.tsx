import { ReactElement } from "react";
import "./ActionLinkWithIcon.css";
import { Link } from "react-router-dom";

export function ActionLinkWithIcon({
  icon,
  iconPlacement,
  url,
  label,
  color = "none",
}: {
  icon: ReactElement;
  iconPlacement: "before" | "after";
  url: string;
  label: string;
  color: "green" | "green-icon" | "red" | "none";
}) {
  return (
    <Link className={`action-link-with-icon ${color !== "none" ? color : ""}`} to={url}>
      {iconPlacement === "before" && icon} {label} {iconPlacement === "after" && icon}
    </Link>
  );
}
