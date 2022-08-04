import React, { createContext, useReducer } from 'react';

interface NotificationProviderProps {
    children: JSX.Element
}

interface NotificationContextState {
  notificationsNumber:number;
}
interface NotificationContextObject {
  notifState: NotificationContextState,
  notifDispatch:React.Dispatch<number|null>
}
const initialValue = {notifState:{notificationsNumber:0}, notifDispatch:()=>{return;}};
const NotificationContext = createContext<NotificationContextObject>(initialValue);

function NotificationProvider({children}:NotificationProviderProps) : JSX.Element {

    const [notifState, notifDispatch] = useReducer((notifState:NotificationContextState, action:number|null) => {
        if (action===null){
            const myState = {notificationsNumber:0};
            sessionStorage.setItem('notificationsNumber',JSON.stringify(myState));
            return myState;
        }
        else if (typeof action === 'number') {
            const myState = {notificationsNumber:action};
            sessionStorage.setItem('notificationsNumber',JSON.stringify(myState));
            return myState;
        }
        else{
            throw new Error();
        }
    }, {notificationsNumber:0});

    function getState() : NotificationContextState {
        const item = sessionStorage.getItem('notificationsNumber');
        if (item!==null && item!==undefined && item!=='undefined'){
            const myState:NotificationContextState = JSON.parse(item);
            return myState;
        }
        else{
            return notifState;
        }
    }

    return (
        <NotificationContext.Provider value={{ notifState:getState(), notifDispatch:notifDispatch }}>
            {children}
        </NotificationContext.Provider>
    );
}

export { NotificationProvider, NotificationContext };