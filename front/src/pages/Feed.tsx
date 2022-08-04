import React  from 'react';

import { useEffect, useContext, useState } from 'react';

import { AuthContext } from '../providers/AuthProvider';

import Post from '../components/Post';
import { FaPlus } from 'react-icons/fa';
import CreatePostModal from '../components/CreatePostModal';

import { IPost } from '../types/Post';
import { UserName } from '../types/User';
import PostService from '../services/PostService';
import UserService from '../services/UserService';
import UserCard from '../components/UserCard';

function Feed() : JSX.Element {

    const { state } = useContext(AuthContext);
    
    const [posts, setPosts] = useState<IPost[]>([]);
    const [displayModal, setDisplayModal] = useState<boolean>(false);

    const [followersRecommandations, setFollowersRecommandations] = useState<UserName[]>([]);
    const [similaritiesRecommandations, setSimilaritiesRecommandations] = useState<UserName[]>([]);

    useEffect(() => {
        getPosts();
        getRecommandations();
    }, [state.authenticated]);

    function getPosts(): void {
        PostService.getLastPosts().then(res => {
            if (res.data.err === 'NO') setPosts(res.data.response);
        });
    }

    function getRecommandations() : void {
        UserService.getMostFollowersRecommandations().then(res => {
            if (res.data.err === 'NO') setFollowersRecommandations(res.data.response);
        });
        if (state.authenticated && state.user){
            UserService.getSimilaritiesRecommandations(state.user.id_person).then(res => {
                if (res.data.err === 'NO') setSimilaritiesRecommandations(res.data.response);
            });
        }
    }

    return (
        <div className='flex flex-col gap-3 items-center text-white relative'>
            {state.authenticated &&
              <button onClick={() => setDisplayModal(true)}>
                  <FaPlus size={32} />
              </button>
            }
            {displayModal && <CreatePostModal onClose={() => setDisplayModal(false)} onCreated={() => getPosts()} />}
            {posts.map(post => (
                <Post key={post.id_post} post={post} onRefresh={() => getPosts()}></Post>
            ))}
            {(followersRecommandations.length>0 || (state.authenticated && similaritiesRecommandations.length>0)) &&
              <div className='absolute top-0 right-5 w-1/4 p-2 border-solid border-neutral-500 border'>
                  {followersRecommandations.length>0 &&
                    <>
                        <div className='mb-2'>Most followed 🔥</div>
                        {followersRecommandations.map((followerRecommandation:UserName,index:number) => (
                            <UserCard user={followerRecommandation} userPicture='/profile.jpg' key={index} />
                        ))}
                    </>
                  }
                  {(state.authenticated && similaritiesRecommandations.length>0) &&
                    <>
                        <div className='mt-8 mb-2'>Same interests 🌴</div>
                        {similaritiesRecommandations.map((followerRecommandation:UserName,index:number) => (
                            <UserCard user={followerRecommandation} userPicture='/profile.jpg' key={index} />
                        ))}
                    </>
                  }
              </div>
            }
        </div>
    );
}

export default Feed;