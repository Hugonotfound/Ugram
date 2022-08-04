import React  from 'react';

import { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';

import { AuthContext } from '../providers/AuthProvider';

import { toast } from 'react-toastify';
import PostService from '../services/PostService';

export interface CreatePostModalProps {
  onClose: () => void;
  onCreated: () => void;
  duration?: number;
}

const CreatePostModal: FunctionComponent<CreatePostModalProps> = ({ onClose, onCreated, duration = 300 }) => {
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
            onClose();
        }, duration);
    };
    
    // Hooks
    const { state } = useContext(AuthContext);

    // States
    const [caption, setCaption] = useState<string>('');
    const [hashtags, setHashtags] = useState<string>('');
    const [file, setFile] = useState<FormData>(new FormData());

    function handleCaption(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setCaption(evt.target.value);
    }
    function handleHashtags(evt: React.ChangeEvent<HTMLInputElement>) : void {
        setHashtags(evt.target.value);
    }
    function handleFileInput(evt: React.ChangeEvent<HTMLInputElement>): void {
        const formData = new FormData();
        if (!evt.target.files || evt.target.files.length === 0) {
            return;
        }
        formData.append('image', evt.target.files[0]);
        setFile(formData);
    }

    function createPost(): void {
        if (state.user && state.user.id_person) {
            PostService.createPost({id_person: state.user.id_person, caption_post: caption, hashtags_post: hashtags}, file).then(()=> {
                onCreated();
                closeHandler();
            });
        } 
        else {
            toast.error('You must be connected to add photos !');
        }
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
                <div className='modal__body'>
                    <input type='file' accept='image/*' className='mb-10' onChange={handleFileInput} />
                    <div>Caption</div>
                    <input type='text' className='text-black' value={caption} onChange={handleCaption} />
                    <div>Hashtags</div>
                    <input type='text' className='text-black' value={hashtags} onChange={handleHashtags} />
                </div>
                <div className='modal__foot'>
                    <button className='mr-5' onClick={closeHandler}>Close</button>
                    <button onClick={() => createPost()}>Create</button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
