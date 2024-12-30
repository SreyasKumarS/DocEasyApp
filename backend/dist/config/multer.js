// import multer, { FileFilterCallback } from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';
// import { Request } from 'express';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//   const filetypes = /jpeg|jpg|png|gif/; 
//   const mimetype = filetypes.test(file.mimetype);
//   if (mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Only images are allowed!'));
//   }
// };
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.resolve(process.cwd(), 'backend/public/doctorFiles');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + '_' + Date.now() + path.extname(file.originalname)
//     );
//   }
// });
// export const multerDoctor = multer({
//   storage: storage,
//   limits: { fileSize: 2 * 1024 * 1024 }, 
//   fileFilter: fileFilter 
// }).fields([
//   { name: 'licenseFile', maxCount: 1 },
//   { name: 'idProof', maxCount: 1 },
//   { name: 'profilePicture', maxCount: 1 }
// ]);
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});
console.log('S3 client initialized.');
const fileFilter = (req, file, cb) => {
    console.log('File received for upload:', file.originalname);
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
        console.log('File type valid:', file.mimetype);
        cb(null, true);
    }
    else {
        cb(new Error('Only images are allowed!'));
    }
};
const multerDoctor = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
            console.log('Setting metadata for:', file.originalname);
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const fileName = `doctorFiles/${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
            console.log('Generated S3 key:', fileName);
            cb(null, fileName);
        },
    }),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: fileFilter,
}).fields([
    { name: 'licenseFile', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 },
]);
export { multerDoctor };
