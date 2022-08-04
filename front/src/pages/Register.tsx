import React  from 'react';

import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../providers/AuthProvider';

import { User } from '../types/User';
import UserService from '../services/UserService';

const Register = () => {

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleNameChange(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setName(evt.target.value);
    }

    function handleLastNameChange(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setLastName(evt.target.value);
    }
    function handlePhoneNumberChange(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setPhoneNumber(evt.target.value);
    }
    function handleUserNameChange(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setUserName(evt.target.value);
    }
    function handleBirthDateChange(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setBirthDate(evt.target.value);
    }
    function handleEmailChange(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setEmail(evt.target.value);
    }
    function handlePasswordChange(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setPassword(evt.target.value);
    }

    function handleSubmit() : void {
        const id = Math.floor(Math.random() * 123456789);
        const user: User = {
            id_person: id,
            lastname_person: lastName,
            forename_person: name,
            gender_person: 'M',
            birthdate_person: new Date(birthDate),
            username_person: userName,
            mail_person: email,
            password_person: password,
            phone_person: phoneNumber,
            profilepicture_person: '',
            confidentiality_person: 'PUBLIC',
            displayonline_person: true,
        };
        UserService.createUser(user).then((res) => {
            if (res.data.err==='NO') {
                dispatch({
                    id_person: res.data.response,
                    lastname_person: lastName,
                    forename_person: name,
                    username_person: userName,
                });
                navigate(`/profile/${res.data.response}`);
            }
        });
    }

    return (
        <div>
            <form className='flex flex-col gap-3 items-center' noValidate>
                <h1 className='text-white bold'>Register</h1>
                <h2 className='mt-3 text-white'>General informations</h2>
                <div className='flex flex-col mt-3'>
                    <label className='text-white'>Name</label>
                    <input
                        onChange={handleNameChange}
                        type='text'
                        className='pl-2 pr-2 h-8 rounded bg-white-200'
                        placeholder='John'
                    />
                </div>
                <div className='flex flex-col mt-1'>
                    <label className='text-white'>Last name</label>
                    <input
                        onChange={handleLastNameChange}
                        type='text'
                        className='pl-2 pr-2 h-8 rounded bg-white-200'
                        placeholder='Doe'
                    />
                </div>
                <div className='flex flex-col mt-1'>
                    <label className='text-white'>Phone number</label>
                    <input
                        onChange={handlePhoneNumberChange}
                        type='tel'
                        pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
                        placeholder='(581)-123-4567'
                        className='pl-2 pr-2 h-8 rounded bg-white-200'
                    />
                </div>
                <div className='flex flex-col mt-1'>
                    <label className='text-white'>Username</label>
                    <input
                        onChange={handleUserNameChange}
                        type='text'
                        className='pl-2 pr-2 h-8 rounded bg-white-200'
                        placeholder='Johnydu13'
                    />
                </div>
                <div className='flex flex-row mt-1 gap-3'>
                    <div className='flex flex-col mt-1'>
                        <label className='text-white'>Gender</label>
                        <select
                            // onChange={handleNameChange} 
                            className='pl-2 pr-2 h-8 rounded bg-white-200'
                            name='gender'
                            id='gender'
                        >
                            <option value='M'>Male</option>
                            <option value='F'>Female</option>
                        </select>
                    </div>
                    <div className='flex flex-col mt-1'>
                        <label className='text-white'>Birth date</label>
                        <input
                            onChange={handleBirthDateChange}
                            type='date'
                            max='2022-03-01'
                            className='pl-2 pr-2 h-8 rounded bg-white-200'
                        />
                    </div>
                </div>
                <h2 className='mt-4 text-white'>Login informations</h2>
                <div className='flex flex-col mt-1'>
                    <label className='text-white'>Email address</label>
                    <input
                        onChange={handleEmailChange}
                        type='text'
                        className='pl-2 pr-2 h-8 rounded bg-white-200'
                        placeholder='john.doe@ulaval.ca'
                    />
                </div>
                <div className='flex flex-col mt-1'>
                    <label className='text-white'>Password</label>
                    <input
                        onChange={handlePasswordChange}
                        type='password'
                        className='pl-2 pr-2 h-8 rounded bg-white-200'
                        placeholder='azerty1234'
                    />
                </div>
                <button onClick={() => handleSubmit()} className='mt-2 mb-5 h-10 w-24 pl-2 pr-2 rounded bg-cyan-500 text-white' type='button'>
                  Submit
                </button>
            </form>
        </div>
    );
};

export default Register;
