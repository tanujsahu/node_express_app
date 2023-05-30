import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { router } from './src/routes/index.js';
import path from 'path';
import multer from 'multer'

dotenv.config();
const app = express();
const __dirname = path.resolve();

const port = process.env.PORT;
const maintenance = process.env.MAINTENANCE;
const maintenanceTemplate = "/templates/maintenance.html";
const homeTemplate = "/templates/home.html";
const errorTemplate = "/templates/404.html";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('templates'))

if (maintenance == "On") {
    app.get('/', (req, res) => {
        res.sendFile(__dirname + maintenanceTemplate)
    });
} else {
    app.use('/api/v1', router);
    app.get('/', (req, res) => {
        res.sendFile(__dirname + homeTemplate)
    });
}

app.get('*', (req, res) => {
    res.sendFile(__dirname + errorTemplate);
});

// ****************************************************** start upload file ******************************************************
// Configuration for Multer storage
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
    cb(null, true);
    //-------- if you want to match mimetype ------
    // if (file.mimetype.split("/")[1] === "pdf") {
    //     cb(null, true);
    // } else {
    //     cb(new Error("Not a PDF File!!"), false);
    // }
};

//Calling the "multer" Function
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

app.post('/file_upload', upload.single('uploaded_file'), async (req, res) => {
    console.log(req.file)
    try {
        res.status(200).json({ status: "success", message: "File created successfully!!", });
    } catch (error) {
        res.json({ error, });
    }
});

// ****************************************************** end upload file ******************************************************


const server = app.listen(port, () => {
    const port = server.address().port
    console.log("Server listening at http://0.0.0.0:" + port);
})