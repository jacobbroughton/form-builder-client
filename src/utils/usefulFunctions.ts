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
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (days < 30) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  } else {
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }
}

export function handleCatchError(
  error: Error | string | unknown,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLocalError: React.Dispatch<React.SetStateAction<string | null>> | null
) {
  let errorMessage = "";

  if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = String(error);
  }

  console.error(errorMessage);

  setError(errorMessage);
  if (setLocalError !== null) setLocalError(errorMessage);
}
