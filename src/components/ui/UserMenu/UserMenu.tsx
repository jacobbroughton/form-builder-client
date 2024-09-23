import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../../../providers/UserContextProvider";
import "./UserMenu.css";

const UserMenu = ({
  setUserMenuToggled,
}: {
  setUserMenuToggled: React.Dispatch<React.SetStateAction<false>>;
}) => {
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { setUser } = useContext(UserContext);

  async function logout() {
    try {
      const response = await fetch("http://localhost:3001/api/sessions/logout", {
        credentials: "include",
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(`Error: ${body.message || "There was an error logging out"}`);
      }

      const data = await response.json();

      console.log("Logged out", data);
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as HTMLElement)) {
        setUserMenuToggled(false);
      }
    }

    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div ref={userMenuRef} className="user-menu">
      <ul>
        <li>
          <button onClick={() => logout()}>Logout</button>
        </li>
      </ul>
    </div>
  );
};
export default UserMenu;
