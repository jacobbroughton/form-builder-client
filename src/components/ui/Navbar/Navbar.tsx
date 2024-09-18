import { Link } from "react-router-dom";
import "./Navbar.css";
import HomeIcon from "../icons/HomeIcon";
import UserIcon from "../icons/UserIcon";
import { useEffect, useRef, useState } from "react";

export const Navbar = () => {
  const userMenuRef = useRef<HTMLElement>(null);
  const [userMenuToggled, setUserMenuToggled] = useState(false);

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
    <nav>
      <Link to={`/`}>
        <HomeIcon />
      </Link>
      <ul>
        <li>
          <div className="user-menu-toggle-container">
            <button
              className="user-menu-toggle"
              onClick={(e) => {
                e.stopPropagation()
                setUserMenuToggled(!userMenuToggled);
              }}
            >
              <UserIcon />
            </button>
            {userMenuToggled ? (
              <div ref={userMenuRef} className="user-menu">
                <ul>
                  <li>Logout</li>
                </ul>
              </div>
            ) : (
              ""
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
};
