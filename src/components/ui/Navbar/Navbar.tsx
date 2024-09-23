import { Link } from "react-router-dom";
import "./Navbar.css";
import HomeIcon from "../icons/HomeIcon";
import UserIcon from "../icons/UserIcon";

import UserMenu from "../UserMenu/UserMenu";
import { useState } from "react";

export const Navbar = ({ authenticated }: { authenticated: boolean }) => {
  const [userMenuToggled, setUserMenuToggled] = useState(false);

  return (
    <nav>
      <Link to={authenticated ? `/dashboard` : "/"}>
        <HomeIcon />
      </Link>
      <ul>
        {authenticated ? (
          <li>
            <div className="user-menu-toggle-container">
              <button
                className="user-menu-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuToggled(!userMenuToggled);
                }}
              >
                <UserIcon />
              </button>
              {userMenuToggled ? (
                <UserMenu setUserMenuToggled={setUserMenuToggled} />
              ) : (
                false
              )}
            </div>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Log in</Link>
            </li>
            <li>
              <Link to="/create-account">Create account</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
