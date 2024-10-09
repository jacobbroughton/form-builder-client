import { Location, useLocation } from "react-router-dom";

export function timeAgo(date: string) {
  const nowMs = new Date().getTime();
  const passedDateMs = new Date(date).getTime();
  const diff = nowMs - passedDateMs; // Difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Rough approximation
  const years = Math.floor(days / 365); // Rough approximation

  if (seconds < 60) {
    return `${seconds} s${seconds !== 1 ? "s" : ""} ago`;
  } else if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `${hours} h${hours !== 1 ? "s" : ""} ago`;
  } else if (days < 30) {
    return `${days} d${days !== 1 ? "s" : ""} ago`;
  } else if (months < 12) {
    return `${months} mon${months !== 1 ? "s" : ""} ago`;
  } else {
    return `${years} y${years !== 1 ? "s" : ""} ago`;
  }
}

export function elapseTime(date: string) {
  const nowMs = new Date().getTime();
  const passedDateMs = new Date(date).getTime();
  const diff = nowMs - passedDateMs; // Difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Rough approximation
  const years = Math.floor(days / 365); // Rough approximation

  if (seconds < 60) {
    return `${seconds}s`;
  } else if (minutes < 60) {
    return `${minutes}min`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else if (days < 30) {
    return `${days}d`;
  } else if (months < 12) {
    return `${months}mon`;
  } else {
    return `${years}y`;
  }
}

export function handleCatchError(
  error: Error | string | unknown,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLocalError: React.Dispatch<React.SetStateAction<string | null>> | null
) {
  console.error(error);
  let errorMessage = "";

  if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = String(error);
  }

  setError(errorMessage);
  if (setLocalError !== null) setLocalError(errorMessage);
}

export function getErrorMessage(error: Error | string | unknown) {
  console.error(error);

  let errorMessage = "";

  if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = String(error);
  }

  return errorMessage;
}

export function copyUrlToClipboard(locationFromReactRouter: Location) {
  const location = locationFromReactRouter;

  const url = window.location.origin + location.pathname + location.search;

  navigator.clipboard
    .writeText(url)
    .then(() => {
      console.log("Url copied to clipboard", url);
    })
    .catch(() => {
      console.error("failed to copy the url", url);
    });
}
