import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router";
import styles from './Signup.module.css'
import { toast } from "react-toastify";

const Signup = () => {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setpassword] = useState('');
  const [otp,setOtp] = useState('');
  const [role,setRole] = useState('student');
  const [loading,setLoading] = useState<boolean>(false);
  const {login} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!name||!email||!password||!otp){
      toast.error('All Fields are required');
      return;
    }
    try{
      setLoading(true);
      const response = await fetch(`http://localhost:5000/auth/register`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({name,email,password,otp,role}),
        credentials:'include', //include cookies for cors
      })
      const data = await response.json();
      if(response.ok) {
        toast.success('Registration Successful');
        login({email,role});
        navigate('/');
      }else{
        toast.error(data.message||'Registration failed');
      }
    }catch(error){
      toast.error('Error during registration');
    }finally{
      setLoading(false);
    }
  }

  const handleSendOtp= async ()=>{
    if(!email){
      toast.error('Please enter email first');
      return;
    }
    try{
      setLoading(true);
      // console.log("process",process.env.REACT_APP_API_BASE_URL)
      const response = await fetch(`http://localhost:5000/auth/sendotp`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({email}),
        credentials:'include',// include cookies for response
      })
      const data = await response.json();
      if(response.ok){
        toast.success('OTP sent successfully')
      }else{
        toast.error(data.message||'Failed to send OTP');
      }
    }catch(error){
      toast.error('Error sending OTP')
    }
  }
  return (
    <div className={styles.signupPage}>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required></input>
        <div className={styles.emailOtpContainer}>
          <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
          <button type="button" onClick={handleSendOtp} className={styles.sendOtpBtn}>
            {loading?'Wait...':'Send OTP'}
          </button>
        </div>
        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} required/>
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setpassword(e.target.value)} required/>
        <select value={role} onChange={(e)=>setRole(e.target.value)}>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <button type="submit">Sign up</button>
      </form>
      <div className={styles.loginLink}>
        <p>Already have an account? <Link to='/login'>Login here</Link></p>
      </div>
    </div>
  )
}

export default Signup