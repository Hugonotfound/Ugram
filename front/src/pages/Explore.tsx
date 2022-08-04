import React  from 'react';

import { useEffect, useState } from 'react';
import { Hashtag, IPost } from '../types/Post';
import PostService from '../services/PostService';
import ProfilePost from '../components/ProfilePost';
import HashtagService from '../services/HashtagService';

function Explore() : JSX.Element {

    const [searchText, setSearchText] = useState<string>('');
    const [posts, setPosts] = useState<IPost[]>([]);
    const [hashtags, setHashtags] = useState<Hashtag[]>([]);

    useEffect(() => {
        getRandomPosts();
    }, []);
    function getRandomPosts() : void {
        PostService.getRandomPosts().then((res) => {
            if (res.data.err==='NO') setPosts(res.data.response);
        });
    }
    function getHashtags(search_text:string) : void {
        const searchTextSanitized = search_text.replace(/\s/g, '').replace(/#/g, '');
        if (searchTextSanitized === '') {
            HashtagService.getMostUsedHashtags().then((res) => {
                if (res.data.err === 'NO') setHashtags(res.data.response);
            });
            PostService.getRandomPosts().then((res) => {
                if (res.data.err==='NO') setPosts(res.data.response);
            });
        } 
        else {
            HashtagService.searchHashtags(searchTextSanitized).then(res => {
                if (res.data.err === 'NO') setHashtags(res.data.response);
            });
        }
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) : void {
        setSearchText(event.target.value);
        getHashtags(event.target.value);
    }

    function launchPostSearch(hashtag:Hashtag) : void {
        setSearchText(hashtag.name_hashtag);
        setHashtags([]);
        PostService.getByHashtag(hashtag.id_hashtag).then((res) => {
            if (res.data.err==='NO') setPosts(res.data.response);
        });
    }

    return (
        <div className='flex flex-col items-center'>
            <input
                className='mt-2 bg-neutral-700 rounded-lg p-1 border-transparent focus:border-transparent focus:ring-0'
                type='text'
                placeholder='Search'
                value={searchText}
                onChange={handleInputChange}
                onFocus={() => getHashtags('')}
            />
            {hashtags.map((hashtag:Hashtag,index:number) => (
                <div className='cursor-pointer text-white' onClick={() => launchPostSearch(hashtag)} key={index}>#{hashtag.name_hashtag}</div>
            ))}
            <div className='mt-5 flex flex-wrap justify-center gap-1 lg:gap-5 lg:w-1/2'>
                {posts.map((post:IPost) => (
                    <ProfilePost post={post} key={post.id_post} onRefresh={() => getRandomPosts()} />
                ))}
            </div>
        </div>
    );
}

export default Explore;