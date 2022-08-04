import React  from 'react';

import { useState, useEffect, useContext } from 'react';

import { AuthContext } from '../providers/AuthProvider';

import { FaHeart, FaComment } from 'react-icons/fa';

import { IPost } from '../types/Post';
import PostService from '../services/PostService';
import { toast } from 'react-toastify';
import PostModal from './PostModal';
import EditPostModal from './EditPostModal';

interface ProfilePostProps {
    post: IPost;
    onRefresh: () => void;
}

function ProfilePost(props: ProfilePostProps): JSX.Element {

    const { state } = useContext(AuthContext);

    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [postImage, setPostImage] = useState<string>('');
    const [modal, setModal] = useState<boolean>(false);

    useEffect(() => {
        PostService.getPost(props.post.id_post).then(res => {
            if (res.status >= 400) {
                toast.error('Error while retreiving post');
                return;
            }
        });
        PostService.getPostImage(props.post.id_post).then(async res => {
            const data = await res.blob();
            setPostImage(URL.createObjectURL(data));
        });
    }, []);

    const handleClick = (): void => {
        setModal(true);
    };

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

    function onClosePostModal(withUpdate:boolean) : void {
        setModal(false);
        if (withUpdate) props.onRefresh();
    }

    return (
        <div
            className='w-32 h-32 lg:w-72 lg:h-72'
            onClick={() => handleClick()}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {modal && 
              <>
                  {(state.user && state.user.id_person===props.post.person.id_person)
                      ? <EditPostModal
                          imgSrc={postImage}
                          post={props.post}
                          onClose={() => setModal(false)}
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
            }
            <img className='absolute w-32 h-32 lg:w-72 lg:h-72 object-cover' src={postImage} alt='post' />
            {isHovering && (
                <div className='absolute w-32 lg:w-72 bg-black/50'>
                    <div className='h-32 lg:h-72 flex justify-center items-center font-bold text-white p-2'>
                        {(props.post.isliked_post)
                            ? <FaHeart size={25} className='text-red-600 mr-2'/>
                            : <FaHeart size={25} className='mr-2'/>
                        }
                        <span className='pr-5'>{props.post.likes_post}</span>
                        <FaComment size={25} className='mr-2' />
                        <span>{props.post.comments_post}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePost;
