import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "./ErrorContextProvider";

interface UserContext {
  loading: boolean;
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}

export const UserContext = createContext<UserContext>({} as UserContext);

const UserContextProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const { setError } = useContext(ErrorContext);

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/sessions/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          const body = await response.json();
          throw new Error(`Error: ${body.message || "There was an issue getting user"}`);
        }

        const data = await response.json();

        setUser(data.user);
        setLoading(false);
      } catch (error) {
        handleCatchError(error, setError);
      }
    }

    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ loading, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserContextProvider;
