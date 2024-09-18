// import {  ref,uploadBytes  } from 'firebase/storage';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../Firebase/Firebase'

export const UploadImage = (file: File): Promise<string> => {
    // Define the allowed file types in an array
    // const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    // Check if the file type is allowed
    // if (!allowedFileTypes.includes(file.type)) {
    //     return Promise.reject('File type not allowed. Allowed types: jpeg, png, gif, webp.');
    // }

    const storageRef = ref(storage, `images/${file?.name}`); // Add timestamp to filename to ensure uniqueness
    const metadata = {
        contentType: file?.type,
    };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    console.log(file.type)

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {

                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject('image upload problem' + error.code)
            },
            () => {

                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: any) => {
                    resolve(downloadURL)
                });
            }
        );
    })

}