import React  from 'react';

import { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../providers/AuthProvider';
import UserService from '../services/UserService';
import { User, UserWithFollow } from '../types/User';

export interface EditProfileModalProps {
    user?: User|UserWithFollow;
    onClose: () => void;
    onUpdate: () => void;
    duration?: number;
}

const EditProfileModal: FunctionComponent<EditProfileModalProps> = ({ user, onClose, onUpdate, duration = 300 }) => {
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
    const closeHandler = () => {
        if (modal.current) modal.current.classList.add('disable-click');
        if (modalBg.current) modalBg.current.style.opacity = 0 + '';
        if (modalContent.current) {modalContent.current.style.opacity = 0 + ''; modalContent.current.style.top = '-100px';}
        setTimeout(() => {
            if (modal.current) modal.current.classList.remove('disable-click');
            onClose();
        }, duration);
    };

    const [forename, setForename] = useState<string>(user ? user.forename_person : '');
    const [lastname, setLastname] = useState<string>(user ? user.lastname_person : '');
    const [email, setEmail] = useState<string>(user ? user.mail_person : '');
    const [phone, setPhone] = useState<string>(user ? user.phone_person : '');
    const { state } = useContext(AuthContext);

    function createPost(): void {
        if (!state.user || !user || !forename || !lastname || !email || !phone) return;
        if (state.user?.id_person) {
            UserService.updateUser(
                user.id_person,
                forename,
                lastname,
                email,
                phone,
                user.username_person
            ).then(res => {
                if (res.status >= 400) {
                    toast.error('Cannot update');
                }
                else{
                    toast.success('Profile updated !');
                    onUpdate();
                    closeHandler();
                }
            });
        } 
        else {
            toast.error('You must be connected to update your profile !');
        }
    }

    function handleFirstNameChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        setForename(evt.target.value);
    }
    function handleLastNameChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        setLastname(evt.target.value);
    }
    function handleEmailChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        setEmail(evt.target.value);
    }
    function handlePhoneChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        setPhone(evt.target.value);
    }

    return (
        <div className='modal' ref={modal}>
            <div className='modal__bg' onClick={closeHandler} ref={modalBg}></div>
            <div className='modal__inner' ref={modalContent}>
                <div className='modal__head'>
                    <button className='btn' onClick={closeHandler}>
                      &times;
                    </button>
                </div>
                <div className='modal__body'>
                    <input
                        className='bg-neutral-700 rounded-lg p-1 border-transparent focus:border-transparent focus:ring-0 mb-2'
                        type='text'
                        placeholder='Forename'
                        value={forename}
                        onChange={handleFirstNameChange}
                    />
                    <input
                        className='bg-neutral-700 rounded-lg p-1 border-transparent focus:border-transparent focus:ring-0 mb-2'
                        type='text'
                        placeholder='Lastname'
                        value={lastname}
                        onChange={handleLastNameChange}
                    />
                    <input
                        className='bg-neutral-700 rounded-lg p-1 border-transparent focus:border-transparent focus:ring-0 mb-2'
                        type='text'
                        placeholder='Email'
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <input
                        className='bg-neutral-700 rounded-lg p-1 border-transparent focus:border-transparent focus:ring-0 mb-2'
                        type='text'
                        placeholder='Phone'
                        value={phone}
                        onChange={handlePhoneChange}
                    />
                </div>
                <div className='modal__foot'>
                    <button className='mr-5' onClick={() => createPost()}>
                      Update
                    </button>
                    <button onClick={closeHandler}>Close</button>
                </div>
            </div>
        </div>
    );
};

export { EditProfileModal };