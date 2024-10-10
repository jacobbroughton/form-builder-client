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

  console.log(location.pathname);

  return (
    <nav>
      <Link to={authenticated ? `/dashboard` : "/"}>
        <HomeIcon />
      </Link>
      <p className="small-text bold" style={{ marginRight: "auto", marginLeft: "5px" }}>
        {location.pathname === "/"
          ? "Home"
          : location.pathname.includes("/login")
          ? "Login"
          : location.pathname.includes("/create-account")
          ? "Create Account"
          : location.pathname.includes("/dashboard")
          ? "Dashboard"
          : location.pathname.includes("/form/")
          ? "Form"
          : location.pathname.includes("/draft/")
          ? "Draft"
          : location.pathname.includes("/edit-draft-form/")
          ? "Edit Draft"
          : location.pathname.includes("/edit-published-form/")
          ? "Edit Form"
          : location.pathname.includes("/create-form")
          ? "Create Form"
          : location.pathname.includes("/edit-input/")
          ? "Edit Input"
          : ""}
      </p>
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
