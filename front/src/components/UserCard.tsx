import React  from 'react';

import { useNavigate } from 'react-router-dom';

import { User, UserName } from '../types/User';

interface UserCardProps {
    user: User|UserName;
    userPicture?: string;
}
function UserCard(props: UserCardProps) : JSX.Element {

    const navigate = useNavigate();

    function handleClick() : void {
        navigate(`/profile/${props.user.id_person}`);
    }

    return (
        <div className='cursor-pointer mb-3' onClick={() => handleClick()}>
            <img className='rounded-full w-8 inline-block mr-2' src={props.userPicture} alt='profile' />
            <p className='text-white inline align-middle text-sm'>{props.user.forename_person} {props.user.lastname_person} ({props.user.username_person})</p>
        </div>
    );
}

export default UserCard;