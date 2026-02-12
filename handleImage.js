const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const r2Client = require('./r2-client');

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'easyreservwebsiteb2b';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://d59ebf7a7ec395a225e24368d8355f1d.r2.cloudflarestorage.com/easyreservwebsiteb2b';

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const JPEG_QUALITY = 82;
const PNG_QUALITY = 80;
const WEBP_QUALITY = 82;

const IMAGE_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff', 'image/bmp'];

const optimizeImage = async (buffer, mimetype) => {
    if (!IMAGE_MIMETYPES.includes(mimetype)) {
        return { buffer, mimetype, ext: null };
    }

    try {
        const metadata = await sharp(buffer).metadata();
        let pipeline = sharp(buffer).rotate(); // auto-rotate based on EXIF

        // Resize if larger than max dimensions
        if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
            pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        // Compress based on format
        if (mimetype === 'image/png') {
            pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
            const optimized = await pipeline.toBuffer();
            return { buffer: optimized, mimetype: 'image/png', ext: '.png' };
        } else if (mimetype === 'image/webp') {
            pipeline = pipeline.webp({ quality: WEBP_QUALITY });
            const optimized = await pipeline.toBuffer();
            return { buffer: optimized, mimetype: 'image/webp', ext: '.webp' };
        } else {
            // JPEG, TIFF, BMP → convert to JPEG
            pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
            const optimized = await pipeline.toBuffer();
            return { buffer: optimized, mimetype: 'image/jpeg', ext: '.jpg' };
        }
    } catch (err) {
        console.warn('Image optimization failed, uploading original:', err.message);
        return { buffer, mimetype, ext: null };
    }
};

const uploadToR2 = async (file, subDir) => {
    if (!r2Client) {
        console.warn('R2 client not configured, skipping R2 upload');
        return null;
    }

    // Optimize image before upload
    const optimized = await optimizeImage(file.buffer, file.mimetype);
    const ext = optimized.ext || path.extname(file.originalname);
    const fileName = uuidv4() + ext;
    const key = `${subDir}/${fileName}`;

    const originalSize = (file.buffer.length / 1024).toFixed(0);
    const newSize = (optimized.buffer.length / 1024).toFixed(0);

    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: optimized.buffer,
            ContentType: optimized.mimetype,
        });

        await r2Client.send(command);
        console.log(`File uploaded to R2: ${key} (${originalSize}KB → ${newSize}KB)`);

        return `${R2_PUBLIC_URL}/${key}`;
    } catch (error) {
        console.error('Error uploading to R2:', error);
        throw error;
    }
};

const createMulterStorage = (subDir) => {
    const dir = `./images/${subDir}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const uniqueName = uuidv4() + path.extname(file.originalname); 
            cb(null, uniqueName);
            console.log(`File created: ${uniqueName}`);
        }
    });
};

const checkExistingFiles = (subDir) => (req, file, cb) => {
    const dir = `./images/${subDir}`;
    const filePath = path.join(dir, file.originalname);
    
    if (fs.existsSync(filePath)) {
        console.log(`File already exists: ${file.originalname}`);
        cb(null, false);
    } else {
        cb(null, true);
    }
};

const deleteUploadedFiles = (files) => {
    files.forEach((file) => {
        const filePath = path.join(__dirname, file.path);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Failed to delete file:', filePath, err);
            } else {
                console.log('Successfully deleted file:', filePath);
            }
        });
    });
};

function updateObjectWithUploadedFiles(req, inputObject, path) {
    const setObjectValueByPath = (obj, pathString, value) => {
        const pathArray = pathString
            .replace(/\[(\w+)\]/g, '.$1')
            .split('.');
        
        pathArray.reduce((acc, key, idx) => {
            if (idx === pathArray.length - 1) {
                acc[key] = value;
            } else {
                if (!acc[key]) {
                    acc[key] = isNaN(Number(pathArray[idx + 1])) ? {} : [];
                }
                return acc[key];
            }
        }, obj);
    };

    if (!req.files) return;

    req.files.forEach(file => {
        const filePath = path + file.filename;
        setObjectValueByPath(inputObject, file.fieldname, filePath);
    });
}

const uploadJobs = multer({ storage: createMulterStorage('jobs'), fileFilter: checkExistingFiles('jobs') });
const uploadWork = multer({ storage: createMulterStorage('work'), fileFilter: checkExistingFiles('work') });
const uploadBlogs = r2Client 
    ? multer({ storage: multer.memoryStorage() })
    : multer({ storage: createMulterStorage('blogs'), fileFilter: checkExistingFiles('blogs') });
const uploadTeam = multer({ storage: createMulterStorage('team'), fileFilter: checkExistingFiles('team') });
const uploadServices = multer({ 
    storage: createMulterStorage('services'),
    fileFilter: checkExistingFiles('services')
});
const uploadNone = multer().none();

module.exports = {
    uploadJobs,
    uploadWork,
    uploadBlogs,
    uploadTeam,
    uploadNone,
    uploadServices,
    updateObjectWithUploadedFiles,
    deleteUploadedFiles,
    uploadToR2,
    R2_PUBLIC_URL
};
