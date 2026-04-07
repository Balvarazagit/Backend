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

        const response = await v2.uploader.upload(localfilepath,{
            resource_type: 'auto'
        })
        fs.unlinkSync(localfilepath);
        return response;
    }
    catch (error){
        console.log("Cloudinary Error:", error);
        fs.unlinkSync(localfilepath);
        return null;
    }
}

export {uploadOnCloudinary}