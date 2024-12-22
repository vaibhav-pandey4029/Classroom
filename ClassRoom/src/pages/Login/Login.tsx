import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router";
import styles from './Login.module.css';

const Login =()=>{
  const [email,setEmail] = useState<string>('');
  const [password,setPassword] = useState<string>('');
  const {login} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e)=>{
    e.preventDefault();
    const userData = {email,role:'submit'};
    login(userData);
    navigate('/');
  }
    return (
        <div className={styles.loginPage}>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}} required></input>
            <input type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}} required></input>
            <button type="submit">Login</button>
          </form>
          <div className={styles.signupLink}>
            <p>Don't have an account?<Link to='/signup'>Sign up</Link></p>
          </div>
        </div>
      )
}

export default Login;