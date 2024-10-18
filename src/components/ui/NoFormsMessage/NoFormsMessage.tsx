export function NoFormsMessage({ labelForSwitch }: { labelForSwitch: string }) {
  let message = "";

  switch (labelForSwitch) {
    case "Public Forms": {
      message = "No public forms are available";
      break;
    }
    case "My Forms": {
      message = "You have not created any forms";
      break;
    }
    case "Answered Forms": {
      message = "You have not answered any forms";
      break;
    }
    default: {
      message = "No forms found";
      break;
    }
  }

  return <p className="small-text">{message}</p>;
}
