import { createContext, useContext, useState, ReactElement, useEffect } from "react";
import { UserContext } from "./UserContextProvider";
import { PublishedFormType } from "../lib/types";

export const IsFormAdminContext = createContext(false);

export const IsFormAdminContextProvider = ({
  children,
  form,
}: {
  children: ReactElement;
  form: PublishedFormType | null;
}) => {
  const { user } = useContext(UserContext);

  const [isFormAdmin, setIsFormAdmin] = useState(false);

  useEffect(() => {
    if (form && user) {
      console.log(form.created_by_id === user.id)
      setIsFormAdmin(form.created_by_id === user.id);
    }
  }, [form, user]);

  return (
    <IsFormAdminContext.Provider value={isFormAdmin}>
      {children}
    </IsFormAdminContext.Provider>
  );
};
