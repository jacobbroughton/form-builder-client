import { Link } from "react-router-dom";
import HomeIcon from "../icons/HomeIcon";
import UserIcon from "../icons/UserIcon";
import "./Navbar.css";
import { useContext, useState } from "react";
import UserMenu from "../UserMenu/UserMenu";
import { UserContext } from "../../../providers/UserContextProvider";

export const Navbar = ({ authenticated }: { authenticated: boolean }) => {
  const [userMenuToggled, setUserMenuToggled] = useState<boolean>(false);
  const { user } = useContext(UserContext);

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
                {user?.picture ? (
                  <div
                    className="profile-picture"
                    style={{ backgroundImage: `url(${user?.picture})` }}
                  ></div>
                ) : (
                  <UserIcon />
                )}
              </button>
              {Boolean(user) && userMenuToggled ? (
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
