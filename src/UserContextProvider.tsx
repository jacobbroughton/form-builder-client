import React, { createContext, useState } from "react";
import { UserType } from "./lib/types";

interface UserContext {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}

export const UserContext = createContext<UserContext>({} as UserContext);

const UserContextProvider = () => {
  const [user, setUser] = useState<UserType>({
    id: "a5421182-901d-48b7-80c3-1b47ba42a430",
    isAdmin: false,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      UserContextProvider
    </UserContext.Provider>
  );
};
export default UserContextProvider;
