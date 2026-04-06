import {v2} from 'cloudinary';
import fs from 'fs';

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localfilepath) =>{
    try{
        if(!localfilepath) return null;

        const response = await cloudinary.uploader.upload(localfilepath,{
            resource_type: 'auto'
        })

        console.log("File uploaded successfully on cloudinary",response.url)
        return response;
    }
    catch (error){
        fs.unlinkSync(localfilepath);
        return null;
    }
}

export {uploadOnCloudinary}