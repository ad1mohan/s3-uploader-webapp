const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Multer configuration
const upload = multer({ dest: 'uploads/' });

// AWS S3 configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const bucket_name = process.env.BUCKET_NAME;
console.log("Bucket name:", bucket_name);

// Route for serving the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route for handling file upload
app.post('/upload', upload.array('files'), (req, res) => {
    const files = req.files;

    // Upload each file to S3 bucket
    files.forEach(file => {
        const params = {
            Bucket: bucket_name,
            Key: file.originalname,
            Body: fs.createReadStream(file.path),
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error uploading file to S3');
            } else {
                console.log('File uploaded successfully to S3:', data.Location);
                res.send('File uploaded successfully!');
            }
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});