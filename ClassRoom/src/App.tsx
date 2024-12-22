import { BrowserRouter as Router, Route,Routes,Navigate, useNavigate } from 'react-router-dom';
import {AuthProvider,useAuth} from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Homepage from './pages/Home/Homepage';
import { ReactNode, useEffect, useState } from 'react';
import './App.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export interface IProtectedRouteProps{
  children:ReactNode;
}

const ProtectedRoute = ({children}:IProtectedRouteProps)=>{
  const { auth, login } = useAuth();
  const [loading, setLoading] = useState(true); // Loading state while checking auth
  const navigate = useNavigate();


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/checklogin`, {
          method: 'GET',
          credentials: 'include', // Include cookies for the auth token
        });
        const data = await response.json();
        console.log("data ",data)
        if (response.ok && data.ok) {
          login({ userId: data.userId }); // Set user in context
          setLoading(false); // User is logged in, loading is done
        } else {
          toast.error(data.message || 'Session expired. Please log in again.');
          navigate('/login');
        }


      }
      catch (error) {
        toast.error('Error checking login status.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    checkLoginStatus();

  }, [navigate])
  if (loading) {
    return <div>Loading...</div>;
  }

  return auth.user ? children : <Navigate to="/login" />;
}


const App =()=>{
  return (
      <AuthProvider>
        <Router>
            <Navbar />
          <Routes>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
            <Route path='/' element={<ProtectedRoute><Homepage/></ProtectedRoute>}/>
          </Routes>
            <ToastContainer/>
        </Router>
      </AuthProvider>
    )
}
export default App;