import React  from 'react';

import { useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../providers/AuthProvider';

function OAuth() : JSX.Element {

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const { id_person, lastname_person, forename_person, username_person } = useParams();
    
    useEffect(() => {
        if (id_person && lastname_person && forename_person && username_person){
            dispatch({
                id_person: parseInt(id_person),
                lastname_person: lastname_person,
                forename_person: forename_person,
                username_person: username_person
            });
            navigate('/');
        }
    }, []);

    return (
        <></>
    );
}

export default OAuth;