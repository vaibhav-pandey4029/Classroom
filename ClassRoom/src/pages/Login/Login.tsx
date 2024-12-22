import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router";
import styles from './Login.module.css';
import { toast } from "react-toastify";

const Login =()=>{
  const [email,setEmail] = useState<string>('');
  const [loading,setLoading]= useState<boolean>(false);
  const [password,setPassword] = useState<string>('');
  const {login} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!email||!password){
      toast.error('Email and Password are required');
      return;
    }
    try{
      setLoading(true);
    const response = await fetch(`http://localhost:5000/auth/login`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({email,password}),
      credentials:'include', //include cookies for cors
    })
    const data = await response.json();
    if(response.ok) {
      toast.success('Logged in Successfully');
      login(data.data);
      navigate('/');
    }else{
      toast.error(data.message||'Login failed');
    }
  }catch(error){
    toast.error('Error during registration');
  }finally{
    setLoading(false);
  }
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