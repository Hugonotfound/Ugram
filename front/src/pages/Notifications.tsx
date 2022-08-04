import React  from 'react';

import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NotificationCard from '../components/NotificationCard';

import { AuthContext } from '../providers/AuthProvider';

import { Notification } from '../types/Notification';
import NotificationService from '../services/NotificationService';
import { NotificationContext } from '../providers/NotificationProvider';

function Notifications() : JSX.Element {

    const { id_person } = useParams();
    let idPerson: number | null = null;
    if (id_person) idPerson = parseInt(id_person);

    const { state } = useContext(AuthContext);
    const { notifDispatch } = useContext(NotificationContext);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (state.user && idPerson===state.user.id_person){
            NotificationService.getByPersonReceiving(idPerson).then((res) => {
                if (res.data.err==='NO'){
                    setNotifications(res.data.response);
                    let countUnread = 0;
                    res.data.response.forEach((notif:Notification) => {
                        if (!notif.isread_notification) countUnread++;
                    });
                    notifDispatch(countUnread);
                }
            });
        }
        else{
            navigate('/');
        }
    },[]);

    return (
        <div className='flex flex-col gap-3 items-center'>
            {notifications.map((notification:Notification,index:number) => (
                <NotificationCard notification={notification} key={index} />
            ))}
        </div>
    );
}

export default Notifications;