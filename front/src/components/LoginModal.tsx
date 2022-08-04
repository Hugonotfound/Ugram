import React  from 'react';

import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';


export interface LoginModalProps {
    onClose: () => void;
    onSubmit: (loginObject:{mail_person:string; password_person:string;}) => void;
    duration?: number;
}
  
const LoginModal: FunctionComponent<LoginModalProps> = ({ onClose, onSubmit, duration = 300 }) => {
    // Modal styling
    const modal = useRef<HTMLDivElement>(null);
    const modalBg = useRef<HTMLDivElement>(null);
    const modalContent = useRef<HTMLDivElement>(null);
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        if (modal.current) modal.current.classList.add('disable-click');
        if (modalBg.current) modalBg.current.style.transitionDuration = duration + 'ms';
        if (modalContent.current) modalContent.current.style.transitionDuration = duration + 'ms';
        setTimeout(() => {
            if (modalBg.current) modalBg.current.style.opacity = 0.2 + '';
            if (modalContent.current) {modalContent.current.style.opacity = 1 + '';modalContent.current.style.top = 0 + '';}
        }, 20);
        setTimeout(() => {
            if (modal.current) modal.current.classList.remove('disable-click');
        }, duration + 20);
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, [duration]);
    const modalCloseHandler = () => {
        if (modal.current) modal.current.classList.add('disable-click');
        if (modalBg.current) modalBg.current.style.opacity = 0 + '';
        if (modalContent.current) {modalContent.current.style.opacity = 0 + ''; modalContent.current.style.top = '-100px';}
        setTimeout(() => {
            if (modal.current) modal.current.classList.remove('disable-click');
            onClose();
        }, duration);
    };
  
    // States
    const [mail, setMail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // Events
    function handleMail(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setMail(evt.target.value);
    }
    function handlePassword(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setPassword(evt.target.value);
    }
  
    return (
        <div className='modal' ref={modal}>
            <div className='modal__bg' onClick={modalCloseHandler} ref={modalBg}></div>
            <div className='modal__inner' ref={modalContent}>
                <div className='modal__head'>
                    <button className='btn' onClick={modalCloseHandler}>
                      &times;
                    </button>
                </div>
                <div className='modal__body'>
                    <div>Mail</div>
                    <input type='text' className='text-black' value={mail} onChange={handleMail} />
                    <div>Password</div>
                    <input type='password' className='text-black' value={password} onChange={handlePassword} />
                </div>
                <div className='modal__foot'>
                    <button className='mr-5' onClick={modalCloseHandler}>Close</button>
                    <button onClick={() => onSubmit({mail_person:mail, password_person:password})}>Submit</button>
                </div>
                <div className='container'>
                    <div className='jumbotron text-center text-primary'>
                        <h1><span className='fa fa-lock'></span> Social Authentication</h1>
                        <p>Login or Register with:</p>
                        <a href={`${process.env.REACT_APP_API_URL}/auth/google`} className='btn btn-danger'><span className='fa fa-google'></span> SignIn with Google</a>
                    </div>
                </div>
                <div className='flex justify-center'>
                    <div>Not registered yet ? Create an account:</div>
                </div>
                <div className='flex justify-center mb-5'>
                    <Link to='/register' className='font-bold border border-white p-2' onClick={modalCloseHandler}>
                      Register
                    </Link>
                </div>
            </div>
        </div>
    );
};
  
export default LoginModal;