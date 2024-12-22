import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from './Navbar.module.css'

const Navbar = () => {
  const { auth, logout } = useAuth();
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Link to="/" className={styles.logo}>Classroom</Link>
        <input type="text" placeholder="Search classrooms" className={styles.searchInput}></input>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={styles.size6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      <div className={styles.navbarRight}>
        {auth.user ? (
          <>
            <Link to="profile" className={styles.profileIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={styles.size6}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </Link>
            <button className={styles.logoutBtn} onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.loginBtn}>
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
