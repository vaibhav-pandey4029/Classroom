import {createContext,useState,useEffect,useContext} from 'react'
import { IProtectedRouteProps } from '../App';
import { User } from '../interfaces/interfaces';

const AuthContext = createContext({user:null,loading:true});
export const useAuth = ()=>{
    return useContext(AuthContext);
}
export const AuthProvider = ({children}:IProtectedRouteProps) => {
    const [auth,setAuth] = useState<User>({user:null,loading:true});
    useEffect(()=>{
        const user =  localStorage.getItem('user')!==null?JSON.parse(localStorage.getItem('user')):null;
        if(user){
            setAuth({user,loading:false});
        }else{
            setAuth({user:null,loading:false});
        }
    },[])
    const login = (userData:string|null)=>{ 
        localStorage.setItem('user',JSON.stringify(userData));
        setAuth({user:userData,loading:false})
    }
    const logout = ()=>{
        localStorage.removeItem('user');
        setAuth({user:null,loading:false});
    }
  return (
    <AuthContext.Provider value={{auth,login,logout}}>
        {!auth.loading && children}
    </AuthContext.Provider>
  )
}
