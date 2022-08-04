import React  from 'react';

import { useEffect, useState, useContext } from 'react';

import { AuthContext } from '../providers/AuthProvider';

import { FaComment, FaHeart } from 'react-icons/fa';
import PostModal from './PostModal';
import EditPostModal from './EditPostModal';
import { toast } from 'react-toastify';

import { IPost } from '../types/Post';
import PostService from '../services/PostService';
import UserService from '../services/UserService';
import LikepostService from '../services/LikepostService';
import CommentModal from './CommentModal';

interface PostProps {
  post: IPost;
  onRefresh: () => void;
}

function Post(props: PostProps) {

    const { state } = useContext(AuthContext);

    const [userImage, setUserImage] = useState<string>('');
    const [isLiked, setIsLiked] = useState<'FROMREQUEST'|'YES'|'NO'>('FROMREQUEST');
    const [commentsNumber, setCommentsNumber] = useState<number|null>(null);
    const [postImage, setPostImage] = useState<string>('');
    const [modal, setModal] = useState(false);
    const [commentModal, setCommentModal] = useState(false);

    useEffect(() => {
        // Get post image
        getImage();
        // Get profile picture of the person that made the post
        UserService.getProfileImage(props.post.person.id_person).then((res) => {
            res.blob().then((data) => {
                setUserImage(URL.createObjectURL(data));
            });
        });
    }, []);

    function getImage() : void {
        PostService.getPostImage(props.post.id_post).then((res) => {
            res.blob().then((data) => {
                if (data.size===0) getImage();
                else setPostImage(URL.createObjectURL(data));
            });
        });
    }

    function handleSubmit(pst:{id_post:number, id_person:number, caption_post:string, hashtags_post:string}): void {
        if (!pst || !pst.id_post || !pst.id_person || !pst.caption_post) {
            return;
        }
        PostService.updatePost(pst).then(res => {
            if (res.status >= 400) toast.error('Could not update Post');
            else{
                toast.success('Post Updated');
                props.onRefresh();
            }
        });
    }
    function handleDelete() : void {
        PostService.deletePost(props.post.person.id_person, props.post.id_post).then((res) => {
            if (res.data.err==='NO'){
                props.onRefresh();
            }
        });
    }

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

    function onClosePostModal(withUpdate:boolean) : void {
        setModal(false);
        if (withUpdate){
            setIsLiked('FROMREQUEST');
            setCommentsNumber(null);
            props.onRefresh();
        }
    }
    function onCloseCommentModal(comNum:number) : void {
        setCommentModal(false);
        setCommentsNumber(comNum);
    }

    return (
        <div className='border-solid border-neutral-500 border w-2/5'>
            {modal && (
                <>
                    {(state.user && state.user.id_person===props.post.person.id_person)
                        ? <EditPostModal
                            imgSrc={postImage}
                            post={props.post}
                            onClose={onClosePostModal}
                            onSubmit={handleSubmit}
                            onDelete={handleDelete}
                        />
                        : <PostModal
                            imgSrc={postImage}
                            post={props.post}
                            onClose={onClosePostModal}
                        />
                    }
                </>        
            )}
            {commentModal && (
                <>
                    <CommentModal 
                        id_post={props.post.id_post} 
                        onClose={onCloseCommentModal}
                    />
                </>
            )}
            <div className='flex gap-2 items-center p-3'>
                <img className='rounded-full w-8' src={userImage} alt='profile'/>
                <span className='text-neutral-50'>{props.post.person.forename_person} {props.post.person.lastname_person} ({props.post.person.username_person})</span>
            </div>
            <img src={postImage} alt='post' className='cursor-pointer' onClick={() => setModal(true)}/>
            <div className='p-3'>
                <div className='text-neutral-50 flex align-right gap-3'>
                    {((isLiked==='FROMREQUEST' && props.post.isliked_post) || isLiked==='YES')
                        ? <FaHeart size={25} className='text-red-600 cursor-pointer' onClick={() => deleteLikepost(props.post.id_post)} />
                        : <FaHeart size={25} className='cursor-pointer' onClick={() => createLikepost(props.post.id_post)} />
                    }
                    <p className='text-sm text-neutral-400 mt-1'>
                        {(isLiked==='FROMREQUEST') 
                            ? props.post.likes_post 
                            : ((props.post.isliked_post) 
                                ? ((isLiked==='YES') ? props.post.likes_post : props.post.likes_post-1)
                                : ((isLiked==='YES') ? props.post.likes_post+1 : props.post.likes_post)
                            )
                        }
                    </p>
                    <FaComment size={25} className='cursor-pointer' onClick={() => setCommentModal(true)}/>
                    <p className='text-sm text-neutral-400 mt-1'>{(commentsNumber===null) ? props.post.comments_post : commentsNumber}</p>
                </div>
                <div className='text-neutral-50 pt-4'>{props.post.caption_post}</div>
                <p className='text-sm text-neutral-400'>{props.post.hashtags_post}</p>
            </div>
        </div>
    );
}

export default Post;
