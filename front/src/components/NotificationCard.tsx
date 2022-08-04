import React  from 'react';

import { useState, useContext } from 'react';
import { Notification } from '../types/Notification';

import { AuthContext } from '../providers/AuthProvider';
import NotificationService from '../services/NotificationService';

import { BiCommentCheck } from 'react-icons/bi';
import { FaComment, FaHeart } from 'react-icons/fa';
import { RiUserFollowFill } from 'react-icons/ri';
import { NotificationContext } from '../providers/NotificationProvider';

interface NotificationProps {
    notification: Notification;
}
function NotificationCard(props: NotificationProps) : JSX.Element {

    const { state } = useContext(AuthContext);
    const { notifState, notifDispatch } = useContext(NotificationContext);

    const [isRead, setIsRead] = useState<boolean>(false);

    function onReadNotification() : void {
        if (state.user && !isRead){
            NotificationService.readNotification(props.notification.id_notification, state.user.id_person).then((res) => {
                if (res.data.err==='NO'){
                    setIsRead(true);
                    notifDispatch(notifState.notificationsNumber-1);
                }
            });
        }
    }

    return (
        <div className='cursor-pointer w-2/3 border-solid border-neutral-500 border p-3' onClick={onReadNotification}>
            <div className='flex flex-row items-center'>
                <div className={(props.notification.isread_notification) ? 'text-white' : ((isRead) ? 'text-white' : 'text-red-600')}>
                    {props.notification.type_notification==='LIKEPOST' && <FaHeart className='mr-2' />}
                    {props.notification.type_notification==='COMMENT' && <FaComment className='mr-2' />}  
                    {props.notification.type_notification==='LIKECOMMENT' && <BiCommentCheck className='mr-2' />}  
                    {props.notification.type_notification==='FOLLOWER' && <RiUserFollowFill className='mr-2' />}  
                </div>   
                <div className={`text-white text-sm ${(props.notification.isread_notification) ? 'font-thin' : ((isRead) ? 'font-thin' : 'font-semibold')}`}>
                    {props.notification.person_sending.forename_person} {props.notification.person_sending.lastname_person} ({props.notification.person_sending.username_person})
                    {props.notification.type_notification==='LIKEPOST' && <> has liked your post &apos;{props.notification.post?.caption_post}&apos;</>}
                    {props.notification.type_notification==='COMMENT' && <> has written a comment on your post &apos;{props.notification.post?.caption_post}&apos;</>}
                    {props.notification.type_notification==='LIKECOMMENT' && <> has liked your comment on the post &apos;{props.notification.post?.caption_post}&apos;</>}
                    {props.notification.type_notification==='FOLLOWER' && <> has begun to follow you.</>}
                </div>       
            </div>
        </div>
    );
}

export default NotificationCard;