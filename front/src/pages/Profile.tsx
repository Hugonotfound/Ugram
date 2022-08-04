import React  from 'react';

import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { IPost } from '../types/Post';

import { AuthContext } from '../providers/AuthProvider';

import { RiUserFollowFill } from 'react-icons/ri';
import FileUploader from '../components/FileUploader';
import ProfilePost from '../components/ProfilePost';

import { UserWithFollow } from '../types/User';
import UserService from '../services/UserService';
import { EditProfileModal } from '../components/EditProfileModal';
import FollowService from '../services/FollowService';

function Profile() : JSX.Element {

    const { state } = useContext(AuthContext);

    const { id } = useParams();
    let userIDInt: number | null = null;
    if (id) userIDInt = parseInt(id);

    const [user, setUser] = useState<UserWithFollow>();
    const [profileImage, setProfileImage] = useState<string>('');
    const [isSubscribedTo, setIsSubscribedTo] = useState<boolean>(false);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [displayModal, setDisplayModal] = useState<boolean>(false);

    if (id) {
        userIDInt = parseInt(id);
    }

    useEffect(() => {
        if (!id) {
            return;
        }
        if (userIDInt != null && userIDInt != undefined) {
            // Get User
            getUser();
            // Get Profile Picture
            UserService.getProfileImage(userIDInt).then(async res => {
                const data = await res.blob();
                setProfileImage(URL.createObjectURL(data));
            });
            // Get posts
            getPosts();
            // Get subscription information if authenticated
            if(state.authenticated && state.user && state.user.id_person!==userIDInt){
                getIsSubscribedTo(state.user.id_person, userIDInt);
            }
        }
    }, []);
    function getUser() : void {
        if (userIDInt != null && userIDInt != undefined) {
            UserService.getUser(userIDInt).then(res => {
                if (res.status < 400 && res.data.err === 'NO') {
                    setUser(res.data.response);
                }
            });
        }
    }
    function getPosts() : void {
        if (userIDInt != null && userIDInt != undefined) {
            UserService.getUserPosts(userIDInt).then(res => {
                setPosts(res.data.response);
            });
        }
    }
    function getIsSubscribedTo(id_person:number, id_person_tocheck:number) : void {
        FollowService.isSubscribedTo(id_person,id_person_tocheck).then((res) => {
            if (res.data.err === 'NO') setIsSubscribedTo(res.data.response);
        });
    }

    function createSubscription() : void {
        if (state.user && user){
            FollowService.createSubscription(state.user.id_person, user.id_person).then((res) => {
                if (res.data.err === 'NO'){
                    setIsSubscribedTo(true);
                    const tempUser = {...user};
                    tempUser.followersnumber_person+=1;
                    setUser(tempUser);
                }
            });
        }
    }
    function deleteSubscription() : void {
        if (state.user && user){
            FollowService.deleteSubscription(state.user.id_person, user.id_person).then((res) => {
                if (res.data.err === 'NO'){
                    setIsSubscribedTo(false);
                    const tempUser = {...user};
                    tempUser.followersnumber_person-=1;
                    setUser(tempUser);
                }
            });
        } 
    }

    function handleFileInput(files: any): void {
        const formData = new FormData();
        if (!files || files.length === 0) {
            return;
        }
        if (state.user && state.user.id_person) {
            formData.append('id_person', state.user.id_person.toString());
            formData.append('image', files);
            UserService.postProfilePicture(state.user.id_person, formData).then(() => {
                setProfileImage(URL.createObjectURL(files));
            }).catch(err => err);
        }
    }

    return (
        <div className='text-neutral-50 p-1 lg:p-20 flex flex-col justify-center items-center text-white'>
            {state.user?.id_person === userIDInt && <button onClick={() => setDisplayModal(true)}>Update Profile</button>}
            {displayModal && <EditProfileModal user={user} onClose={() => setDisplayModal(false)} onUpdate={() => getUser()} />}
            <div className='flex flex-col lg:flex-row items-center gap-x-72 pb-5 lg:pb-20'>
                <div className='w-24 h-24 rounded-full'>
                    {profileImage && (
                        <img className='absolute rounded-full h-24 object-cover mt-2 lg:mt-0' src={profileImage} alt='profile' />
                    )}
                    {state.user?.id_person === userIDInt && <FileUploader onFileChange={handleFileInput} />}
                </div>
                <p className='font-bold text-xl pt-5 lg:pt-0'>
                    {user?.forename_person} {user?.lastname_person} ({user?.username_person})
                </p>
                <div className='flex gap-5 lg:block pt-5 lg:pt-0'>
                    <div>
                        <span className='font-bold'>{posts.length}</span> Posts
                    </div>
                    <div>
                        <span className='font-bold'>{user?.followersnumber_person}</span> Followers
                    </div>
                    <div>
                        <span className='font-bold'>{user?.followingnumber_person}</span> Following
                    </div>
                </div>
            </div>
            {(state.authenticated && user?.id_person===state.user?.id_person) &&
              <div className='flex mb-5 justify-around w-full'>
                  <div>Phone: {user?.phone_person}</div>
                  <div>Email: {user?.mail_person}</div>
              </div>
            }
            {(state.authenticated && user?.id_person!==state.user?.id_person) &&
              <div className='mb-5 flex flex-col items-center'>
                  {isSubscribedTo 
                      ? <>
                          <RiUserFollowFill size={25} className='cursor-pointer text-green-800' onClick={deleteSubscription} />
                          <div>Subscribed</div>
                      </>
                      : <>
                          <RiUserFollowFill size={25} className='cursor-pointer text-gray-600' onClick={createSubscription} />
                          <div>Not subscribed</div>
                      </>
                  }
              </div>
            }
            <hr className='w-1/2 border-neutral-500 pb-5 lg:pb-20' />
            <div className='flex flex-wrap justify-center gap-1 lg:gap-5 lg:w-1/2'>
                {posts.map((post:IPost) => (
                    <ProfilePost post={post} key={post.id_post} onRefresh={() => getPosts()} />
                ))}
            </div>
        </div>
    );
}

export default Profile;
