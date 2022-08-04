import React  from 'react';

import { FunctionComponent, useEffect, useRef, useState, useContext } from 'react';
import { IPost } from '../types/Post';
import { FaComment, FaHeart } from 'react-icons/fa';
import LikepostService from '../services/LikepostService';
import { AuthContext } from '../providers/AuthProvider';
import CommentModal from './CommentModal';

export interface EditPostModalProps {
    imgSrc: string;
    post: IPost;
    onClose: (withUpdate:boolean) => void;
    onSubmit: (post: {id_post:number, id_person:number, caption_post:string, hashtags_post:string}) => void;
    onDelete: () => void;
    duration?: number;
}
  
const EditPostModal: FunctionComponent<EditPostModalProps> = ({ imgSrc, post, onClose, onSubmit, onDelete, duration = 300 }) => {
    // Modal styling
    const modal = useRef<HTMLDivElement>(null);
    const modalBg = useRef<HTMLDivElement>(null);
    const modalContent = useRef<HTMLDivElement>(null);

    // States
    const [caption, setCaption] = useState<string>('');
    const [hashtags, setHashtags] = useState<string>('');
    const [isLiked, setIsLiked] = useState<'FROMREQUEST'|'YES'|'NO'>('FROMREQUEST');
    const [commentsNumber, setCommentsNumber] = useState<number|null>(null);
    const [commentModal, setCommentModal] = useState(false);

    useEffect(() => {

        setCaption(post.caption_post);
        setHashtags(post.hashtags_post);

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
    }, [duration, commentModal]);
    const closeHandler = () => {
        if (modal.current) modal.current.classList.add('disable-click');
        if (modalBg.current) modalBg.current.style.opacity = 0 + '';
        if (modalContent.current) {modalContent.current.style.opacity = 0 + ''; modalContent.current.style.top = '-100px';}
        setTimeout(() => {
            if (modal.current) modal.current.classList.remove('disable-click');
            onClose((isLiked!=='FROMREQUEST') || (commentsNumber!==null && commentsNumber!==post.comments_post));
        }, duration);
    };
  
    const { state } = useContext(AuthContext);

    function handleCaption(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setCaption(evt.target.value);
    }
    function handleHashtags(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setHashtags(evt.target.value);
    }
    function submit() : void {
        if (state.user){
            if (isLiked==='YES'){
                LikepostService.createLikepost(state.user.id_person, post.id_post);
            }
            else if (isLiked==='NO'){
                LikepostService.deleteLikepost(state.user.id_person, post.id_post);
            }
            onSubmit({
                id_post: post.id_post,
                id_person: post.person.id_person,
                caption_post: caption,
                hashtags_post: hashtags
            });
            closeHandler();
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
                    <div className='modal__bg' onClick={closeHandler} ref={modalBg}></div>
                    <div className='modal__inner' ref={modalContent}>
                        <div className='modal__head'>
                            <img className='rounded object-cover text-black' src={imgSrc} alt='no image' />
                            <button className='btn' onClick={closeHandler}>
                              &times;
                            </button>
                        </div>
                        <div className='modal__body'>
                            <div className='flex flex-row justify-center gap-3 text-neutral-50 mb-4'>
                                {((isLiked==='FROMREQUEST' && post.isliked_post) || isLiked==='YES')
                                    ? <FaHeart size={25} className='text-red-600 cursor-pointer' onClick={() => setIsLiked('NO')} />
                                    : <FaHeart size={25} className='cursor-pointer' onClick={() => setIsLiked('YES')} />
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
                            <div className='text-white'>Caption</div>
                            <input type='text' className='text-black' value={caption} onChange={handleCaption} />
                            <div className='text-white'>Hashtags</div>
                            <input type='text' className='text-black' value={hashtags} onChange={handleHashtags} />
                        </div>
                        <div className='modal__foot'>
                            <button className='mr-5' onClick={closeHandler}>Close</button>
                            <button className='mr-5' onClick={() => {onDelete(); closeHandler();}}>Delete</button>
                            <button onClick={submit}>Submit</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};
  
export default EditPostModal;