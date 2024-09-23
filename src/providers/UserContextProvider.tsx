import React, { createContext, ReactElement, useEffect, useState } from "react";
import { UserType } from "../lib/types";
import { printError } from "../utils/usefulFunctions";

interface UserContext {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}

export const UserContext = createContext<UserContext>({} as UserContext);

const UserContextProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<UserType>(null);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch(`http://localhost:3001/api/sessions/me`, {
          method: "get",
          credentials: "include",
        });

        if (!response.ok) {
          const body = await response.json();
          throw new Error(`Error: ${body.message || "There was an issue getting user"}`);
        }

        const data = await response.json();

        setUser(data);
      } catch (error) {
        printError(error);
      }
    }

    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
  );
};
export default UserContextProvider;
