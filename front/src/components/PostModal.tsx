import React  from 'react';

import { FunctionComponent, useEffect, useRef, useState, useContext } from 'react';
import { IPost } from '../types/Post';
import './PostModal.css';
import { FaComment, FaHeart } from 'react-icons/fa';
import LikepostService from '../services/LikepostService';
import { AuthContext } from '../providers/AuthProvider';
import CommentModal from './CommentModal';

export interface PostModalProps {
    imgSrc: string;
    post: IPost;
    onClose: (withUpdate:boolean) => void;
    duration?: number;
}

const PostModal: FunctionComponent<PostModalProps> = ({ imgSrc, post, onClose, duration = 300 }) => {
    const modal = useRef<HTMLDivElement>(null);
    const modalBg = useRef<HTMLDivElement>(null);
    const modalContent = useRef<HTMLDivElement>(null);
    
    const [isLiked, setIsLiked] = useState<'FROMREQUEST'|'YES'|'NO'>('FROMREQUEST');
    const [commentsNumber, setCommentsNumber] = useState<number|null>(null);
    const [commentModal, setCommentModal] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        if (modal.current) {
            modal.current.classList.add('disable-click');
        }
        if (modalBg.current) {
            modalBg.current.style.transitionDuration = duration + 'ms';
        }
        if (modalContent.current) {
            modalContent.current.style.transitionDuration = duration + 'ms';
        }
        setTimeout(() => {
            if (modalBg.current) {
                modalBg.current.style.opacity = 0.2 + '';
            }
            if (modalContent.current) {
                modalContent.current.style.opacity = 1 + '';
                modalContent.current.style.top = 0 + '';
            }
        }, 20);
        setTimeout(() => {
            if (modal.current) {
                modal.current.classList.remove('disable-click');
            }
        }, duration + 20);
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, [duration, commentModal]);

    const { state } = useContext(AuthContext);

    const modalCloseHandler = () => {
        if (modal.current) {
            modal.current.classList.add('disable-click');
        }
        if (modalBg.current) {
            modalBg.current.style.opacity = 0 + '';
        }
        if (modalContent.current) {
            modalContent.current.style.opacity = 0 + '';
            modalContent.current.style.top = '-100px';
        }
        setTimeout(() => {
            if (modal.current) {
                modal.current.classList.remove('disable-click');
            }
            onClose((isLiked!=='FROMREQUEST') || (commentsNumber!==null && commentsNumber!==post.comments_post));
        }, duration);
    };

    function createLikepost(id_post:number) : void {
        if (state.user){
            LikepostService.createLikepost(state.user.id_person, id_post).then(() => {
                setIsLiked('YES');
            });
        }
    }
    function deleteLikepost(id_post:number) : void {
        if (state.user){
            LikepostService.deleteLikepost(state.user.id_person, id_post).then(() => {
                setIsLiked('NO');
            });
        }
    }
    
    function onCloseCommentModal(comNum:number) : void {
        setCommentModal(false);
        setCommentsNumber(comNum);
    }

    return (
        <>
            {commentModal
                ? <CommentModal 
                    id_post={post.id_post} 
                    onClose={onCloseCommentModal}
                />
                : <div className='modal' ref={modal}>
                    <div className='modal__bg' onClick={modalCloseHandler} ref={modalBg}></div>
                    <div className='modal__inner' ref={modalContent}>
                        <div className='modal__head'>
                            <img className='rounded object-cover text-black' src={imgSrc} alt='no image' />
                            <button className='btn' onClick={modalCloseHandler}>
                              &times;
                            </button>
                        </div>
                        <div className='modal__body'>
                            <div className='flex flex-row justify-center gap-3 text-neutral-50 mb-4'>
                                {((isLiked==='FROMREQUEST' && post.isliked_post) || isLiked==='YES')
                                    ? <FaHeart size={25} className='text-red-600 cursor-pointer' onClick={() => deleteLikepost(post.id_post)} />
                                    : <FaHeart size={25} className='cursor-pointer' onClick={() => createLikepost(post.id_post)} />
                                }
                                <p className='text-sm text-neutral-400 mt-1'>
                                    {(isLiked==='FROMREQUEST') 
                                        ? post.likes_post 
                                        : ((post.isliked_post) 
                                            ? ((isLiked==='YES') ? post.likes_post : post.likes_post-1)
                                            : ((isLiked==='YES') ? post.likes_post+1 : post.likes_post)
                                        )
                                    }
                                </p>
                                <FaComment size={25} className='cursor-pointer' onClick={() => setCommentModal(true)}/>
                                <p className='text-sm text-neutral-400 mt-1'>{(commentsNumber===null) ? post.comments_post : commentsNumber}</p>
                            </div>
                            <h3 className='text-white'>{post.caption_post}</h3>
                            <p className='text-sm text-neutral-400'>{post.hashtags_post}</p>
                        </div>
                        <div className='modal__foot'>
                            <button onClick={modalCloseHandler}>Close</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};
export default PostModal;