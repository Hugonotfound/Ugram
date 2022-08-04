import React, { createContext, useReducer } from 'react';

import { UserName } from '../types/User';

interface AuthProviderProps {
    children: JSX.Element
}

interface AuthContextState {
  authenticated:boolean;
  user:UserName|null;
}
interface AuthContextObject {
  state: AuthContextState,
  dispatch:React.Dispatch<UserName|null>
}
const initialValue = {state:{authenticated:false, user:null}, dispatch:()=>{return;}};
const AuthContext = createContext<AuthContextObject>(initialValue);

function AuthProvider({children}:AuthProviderProps) : JSX.Element {

    const [state, dispatch] = useReducer((state:AuthContextState, action:UserName|null) => {
        if (action===null){
            const myState = {authenticated:false, user:null};
            sessionStorage.setItem('authenticate',JSON.stringify(myState));
            return myState;
        }
        else if (typeof action === 'object') {
            const myState = {authenticated:true, user:action};
            sessionStorage.setItem('authenticate',JSON.stringify(myState));
            return myState;
        }
        else{
            throw new Error();
        }
    }, {authenticated:false, user:null});

    function getState() : AuthContextState {
        const item = sessionStorage.getItem('authenticate');
        if (item!==null && item!==undefined && item!=='undefined'){
            const myState:AuthContextState = JSON.parse(item);
            return myState;
        }
        else{
            return state;
        }
    }

    return (
        <AuthContext.Provider value={{ state:getState(), dispatch:dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, AuthContext };