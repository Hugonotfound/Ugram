import React  from 'react';

import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../providers/AuthProvider';
import { NotificationContext } from '../providers/NotificationProvider';

import { FaHome, FaSearch, FaRegCompass, FaBell } from 'react-icons/fa';
import { MdLogin, MdLogout } from 'react-icons/md';
import LoginModal from './LoginModal';

import LoginService from '../services/LoginService';
import NotificationService from '../services/NotificationService';

export const Navbar = () => {
  
    const { state, dispatch } = useContext(AuthContext);
    const { notifState, notifDispatch } = useContext(NotificationContext);
    const navigate = useNavigate();

    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

    function onLogin(loginObject:{mail_person:string; password_person:string;}) : void {
        LoginService.login(loginObject.mail_person, loginObject.password_person).then((res) => {
            if (res.data.err==='NO'){
                dispatch(res.data.response);
                NotificationService.countByPersonReceiving(res.data.response.id_person).then((resNotif) => {
                    notifDispatch(resNotif.data.response);
                });
            }
        });
        setShowLoginModal(false);
    }
    function onLogout() : void {
        if (state.user!==null){
            LoginService.logout(state.user?.id_person).then((res) => {
                if (res.data.err==='NO'){
                    dispatch(null);
                    notifDispatch(null);
                    navigate('/');
                }
            });
        }
    }

    function goToNotifications() : void {
        if (state.authenticated && state.user){
            navigate(`/notifications/${state.user.id_person}`);
        }
    }

    return (
        <div className='text-neutral-50 bg-neutral-800 border-solid border-b border-neutral-500 flex items-center justify-around py-3 px-10 mb-2'>
            <h2>UGRAM</h2>
            <div className='flex items-center flex-row-reverse gap-7'>
                {(state.authenticated)
                    ? <button onClick={onLogout}>
                        <MdLogout size={30} />
                    </button>
                    : <button onClick={() => setShowLoginModal(true)}>
                        <MdLogin size={30} />
                    </button>
                }
                {(state.authenticated && state.user) &&
                  <div className='relative'>
                      <Link to={`/notifications/${state.user.id_person}`}>
                          <FaBell size={30} />
                      </Link>
                      {(notifState.notificationsNumber!==null && notifState.notificationsNumber>0) &&
                        <span onClick={goToNotifications} className='inline-block w-5 h-5 bg-red-600 rounded-full absolute top-0 right-0 cursor-pointer'>
                            <span className='flex flex-row justify-center'>
                                <span className='flex flex-col items-center text-sm'>
                                    {notifState.notificationsNumber}
                                </span>
                            </span>
                        </span>
                      }
                  </div>
                }
                <Link to='/users'>
                    <FaSearch size={30} />
                </Link>
                <Link to='/explore'>
                    <FaRegCompass size={30} />
                </Link>
                <Link to='/'>
                    <FaHome size={30} />
                </Link>
            </div>
            {showLoginModal &&
              <LoginModal onClose={() => setShowLoginModal(false)} onSubmit={onLogin}/>
            }
        </div>
    );
};

export default Navbar;
