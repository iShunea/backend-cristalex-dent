const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const r2Client = require('./r2-client');

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'easyreservwebsiteb2b';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://d59ebf7a7ec395a225e24368d8355f1d.r2.cloudflarestorage.com/easyreservwebsiteb2b';

const uploadToR2 = async (file, subDir) => {
    if (!r2Client) {
        console.warn('R2 client not configured, skipping R2 upload');
        return null;
    }

    const fileName = uuidv4() + path.extname(file.originalname);
    const key = `${subDir}/${fileName}`;

    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await r2Client.send(command);
        console.log(`File uploaded to R2: ${key}`);
        
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
