import { Link } from "react-router-dom";
import "./NotFound.scss";

const NotFound = () => (
  <main className="not-found">
    <div className="not-found__inner">
      <span className="not-found__code">404</span>
      <h1 className="not-found__title">Page Not Found</h1>
      <p className="not-found__text">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="not-found__btn">
        ← Back to Home
      </Link>
    </div>
  </main>
);

export default NotFound;
