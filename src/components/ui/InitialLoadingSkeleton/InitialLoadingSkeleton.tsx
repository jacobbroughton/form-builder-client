import HomeIcon from "../icons/HomeIcon";
import "./InitialLoadingSkeleton.css";

const InitialLoadingSkeleton = () => {
  return (
    <div className="initial-loading-skeleton">
      <nav>
        <div className="home-icon-container">
          <HomeIcon />
        </div>
        <div className="profile-picture-skeleton-container">
          <div className="profile-picture-skeleton"></div>
        </div>
      </nav>
      <div className="container"></div>
    </div>
  );
};
export default InitialLoadingSkeleton;
