import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../providers/UserContextProvider";
import { LogoutIcon } from "../icons/LogoutIcon";
import { PlusIcon } from "../icons/PlusIcon";
import "./UserMenu.css";

export function UserMenu({
  setUserMenuToggled,
}: {
  setUserMenuToggled: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useContext(UserContext);

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
      setUserMenuToggled(false);
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

  if (!user) return false;

  return (
    <div ref={userMenuRef} className="user-menu">
      <ul>
        <li>
          <p className="email">{user.email}</p>
        </li>
        <li>
          <Link to="/create-form" onClick={() => setUserMenuToggled(false)}>
            <PlusIcon /> Create a new form
          </Link>
        </li>
        <li>
          <button onClick={() => logout()}>
            <LogoutIcon /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
