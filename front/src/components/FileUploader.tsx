import React  from 'react';

import { LegacyRef, useRef, useState } from 'react';

import { FaPen } from 'react-icons/fa';

interface FileUploaderProps {
    onFileChange: CallableFunction;
}
  
function FileUploader(props: FileUploaderProps) : JSX.Element {

    const fileInput: LegacyRef<HTMLInputElement> = useRef(null);
    const [isHovering, setIsHovering] = useState<boolean>(false);
  
    function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) : void {
        if (!event.target.files) {
            return;
        }
        props.onFileChange(event.target.files[0]);
    }
  
    return (
        <div
            className='absolute w-24 h-24 rounded-full'
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {isHovering && (
                <div className='bg-black/50 w-24 h-24 flex justify-center rounded-full'>
                    <input ref={fileInput} className='hidden' type='file' accept='image/*' onChange={handleFileInput} />
                    <button onClick={() => fileInput.current && fileInput.current.click()}>
                        <FaPen size={30} />
                    </button>
                </div>
            )}
        </div>
    );
} 

export default FileUploader;