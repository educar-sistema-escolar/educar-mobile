import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { currentSession, restoreSession, subscribe } from './api';
const AuthContext=createContext({session:currentSession(),ready:false});
export function AuthProvider({children}:PropsWithChildren) {
 const [session,setSession]=useState(currentSession());const [ready,setReady]=useState(false);
 useEffect(()=>{const unsubscribe=subscribe(()=>setSession(currentSession()));restoreSession().catch(()=>undefined).finally(()=>setReady(true));return unsubscribe;},[]);
 return <AuthContext.Provider value={{session,ready}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
