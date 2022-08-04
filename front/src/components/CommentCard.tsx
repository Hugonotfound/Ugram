import React  from 'react';

import { useState, useContext } from 'react';
import { Comment } from '../types/Comment';

import { AuthContext } from '../providers/AuthProvider';

import { MdDelete } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';

import CommentService from '../services/CommentService';
import LikecommentService from '../services/LikecommentService';

interface CommentProps {
    comment: Comment;
    onRefresh: () => void;
}
function CommentCard(props: CommentProps) : JSX.Element {

    const { state } = useContext(AuthContext);
    
    const [isLiked, setIsLiked] = useState<'FROMREQUEST'|'YES'|'NO'>('FROMREQUEST');
    function createLikecomment() : void {
        if (state.user){
            LikecommentService.createLikecomment(state.user.id_person, props.comment.id_comment).then(() => {
                setIsLiked('YES');
            });
        }
    }
    function deleteLikecomment() : void {
        if (state.user){
            LikecommentService.deleteLikecomment(state.user.id_person, props.comment.id_comment).then(() => {
                setIsLiked('NO');
            });
        }
    }

    function deleteComment() : void {
        if (state.user && state.user.id_person) {
            CommentService.deleteComment(props.comment.id_comment, state.user.id_person).then((res) => {
                if (res.data.err==='NO') props.onRefresh();
            });
        }
    }

    return (
        <div className='w-2/3 border-solid border-neutral-500 border p-3 flex flex-row justify-between'>
            <div>
                <div className='text-left text-white text-sm'>
                    {props.comment.person.forename_person} {props.comment.person.lastname_person} ({props.comment.person.username_person})
                </div>
                <div className='text-left text-white text-sm font-thin'>
                    {props.comment.text_comment}
                </div>
            </div>
            {(state.authenticated && state.user)
                ? <div className='flex flex-col justify-center items-center'>
                    <div className='flex flex-row items-center'>
                        <span className='text-sm mr-2'>
                            {(props.comment.likes_comment!==undefined) &&
                                <>
                                    {(isLiked==='FROMREQUEST') 
                                        ? props.comment.likes_comment
                                        : ((props.comment.likes_comment) 
                                            ? ((isLiked==='YES') ? props.comment.likes_comment : props.comment.likes_comment-1)
                                            : ((isLiked==='YES') ? props.comment.likes_comment+1 : props.comment.likes_comment)
                                        )
                                    }
                                </>
                            }
                        </span>
                        {((isLiked==='FROMREQUEST' && props.comment.isliked_comment) || isLiked==='YES')
                            ? <FaHeart size={15} className='text-red-600 cursor-pointer' onClick={deleteLikecomment} />
                            : <FaHeart size={15} className='cursor-pointer' onClick={createLikecomment} />
                        }
                    </div>
                    {state.user?.id_person===props.comment.person.id_person &&
                        <MdDelete className='text-white cursor-pointer mt-2' size={20} onClick={deleteComment} />
                    }
                </div>
                : <div className='flex flex-col justify-center items-center'>
                    <div className='flex flex-row items-center'>
                        <span className='text-sm mr-2'>
                            {(props.comment.likes_comment!==undefined) &&
                                <>
                                    {(isLiked==='FROMREQUEST') 
                                        ? props.comment.likes_comment
                                        : ((props.comment.likes_comment) 
                                            ? ((isLiked==='YES') ? props.comment.likes_comment : props.comment.likes_comment-1)
                                            : ((isLiked==='YES') ? props.comment.likes_comment+1 : props.comment.likes_comment)
                                        )
                                    }
                                </>
                            }
                        </span>
                        {((isLiked==='FROMREQUEST' && props.comment.isliked_comment) || isLiked==='YES')
                            ? <FaHeart size={15} className='text-red-600' />
                            : <FaHeart size={15} />
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default CommentCard;