import { BrowserRouter as Router, Route,Routes,Navigate } from 'react-router-dom';
import {AuthProvider,useAuth} from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Homepage from './pages/Home/Homepage';
import { ReactNode } from 'react';
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export interface IProtectedRouteProps{
  children:ReactNode;
}

const ProtectedRoute = ({children}:IProtectedRouteProps)=>{
  const auth = useAuth();
  return auth.user? children:<Navigate to='/login'/>
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