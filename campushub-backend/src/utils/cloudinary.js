import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary =  async( localFilePath) => {
    try{
      if( !localFilePath ) return null;
      //upload file on cloudinary 
      const responce = await cloudinary.uploader.upload(localFilePath, {
        resource_type: 'raw',
        access_mode: 'public',

         use_filename: true,
      unique_filename: false
      })
      // file uploaded successfully
      // console.log("uploaded file on cloudinary :",responce.url)

      fs.unlinkSync(localFilePath)
      return responce;
        
    }catch (error) {
        fs.unlinkSync(localFilePath) //remove locally  save temporary file as the upload operation got failed;
        return null;
    }

}

export {uploadOnCloudinary}
