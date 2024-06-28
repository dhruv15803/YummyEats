import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const getCloudinaryUrl = async (localFilePath:string) => {
    const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    });
    const url = cloudinaryResponse.url;
    return url;
}

export {
    getCloudinaryUrl,
}