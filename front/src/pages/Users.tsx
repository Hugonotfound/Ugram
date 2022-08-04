import React  from 'react';

import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import UserCard from '../components/UserCard';

import { User } from '../types/User';
import UserService from '../services/UserService';

function Users() : JSX.Element {
  
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        getAllUsers();
    }, []);
    function getAllUsers() : void {
        UserService.getAllUsers().then(res => {
            if (res.status >= 400 || res.data.err !== 'NO') {
                console.log('error');
                toast.error('Could not retreive users');
                return;
            }
            setUsers(res.data.response);
        });
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) : void {
        if (event.target.value === '') {
            getAllUsers();
        }
        else UserService.searchUser(event.target.value).then(res => {
            if (res.data.err === 'NO') setUsers(res.data.response);
        });
    }

    return (
        <div className='flex flex-col items-center gap-5'>
            <input
                className='bg-neutral-700 rounded-lg p-1 border-transparent focus:border-transparent focus:ring-0'
                type='text'
                placeholder='Search'
                onChange={handleInputChange}
            />
            <div className='flex flex-col items-start'>
                {users.map(user => (
                    <UserCard
                        key={user.id_person}
                        user={user}
                        userPicture='/profile.jpg'
                    />
                ))}
            </div>
        </div>
    );
}

export default Users;
