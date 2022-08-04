import React  from 'react';

import { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { MdSend } from 'react-icons/md';

import { AuthContext } from '../providers/AuthProvider';

import CommentService from '../services/CommentService';
import { Comment } from '../types/Comment';
import CommentCard from './CommentCard';

export interface CommentModalProps {
  id_post: number;
  onClose: (commentsNumber:number) => void;
  duration?: number;
}

const CommentModal: FunctionComponent<CommentModalProps> = ({ id_post, onClose, duration = 300 }) => {
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
            onClose(comments.length);
        }, duration);
    };
    
    // Hooks
    const { state } = useContext(AuthContext);

    // States
    const [comment, setComment] = useState<string>('');
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        getComments();
    },[]);

    function handleComment(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setComment(evt.target.value);
    }

    function getComments() : void {
        CommentService.getByPost(id_post).then((res) => {
            if (res.data.err==='NO') setComments(res.data.response);
        });
    }

    function createComment(): void {
        if (state.user && state.user.id_person) {
            CommentService.createComment(id_post, state.user.id_person, comment).then((res) => {
                if (res.data.err==='NO'){
                    setComment('');
                    getComments();
                }
            });
        } 
        else toast.error('You must be connected to add photos !');
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
                <div className='modal__body flex flex-col items-center'>
                    {comments.map((comment:Comment,index:number) => (
                        <CommentCard comment={comment} key={index} onRefresh={() => getComments()} />
                    ))}
                    {state.authenticated &&
                      <div className='flex flex-row mt-5'>
                          <input type='text' className='text-black' value={comment} onChange={handleComment} />
                          <MdSend className='text-white ml-4 cursor-pointer' size={25} onClick={createComment} />
                      </div>
                    }
                </div>
                <div className='modal__foot'>
                    <button className='mr-5' onClick={closeHandler}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default CommentModal;