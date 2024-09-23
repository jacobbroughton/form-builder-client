import React, { createContext, ReactElement, useEffect, useState } from "react";
import { UserType } from "./lib/types";
import { handleCatchError } from "./utils/usefulFunctions";
import { useNavigate } from "react-router-dom";

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

        if (!response.ok) throw new Error("There was an issue getting user");

        const data = await response.json();

        setUser(data);
      } catch (error) {
        handleCatchError(error);
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    // if (user) navigate("/dashboard");
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
  );
};
export default UserContextProvider;
