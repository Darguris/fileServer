const express = require("express")
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const fileUpload = require('express-fileupload');
const short = require('short-uuid');

const fileStoragePath = path.join(__dirname, '/fileStorage')
const app = express()
const port = 4000
app.use(cors())
app.use(fileUpload());

app.post('/files', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    var filePath = path.join(fileStoragePath, "/" + req.files.fileName.name)

    // fs.access(filePath, (err) => {
    //     if (err) {
    //         req.files.fileName.mv(filePath, err => {
    //             if (err)
    //                 return res.status(500).send(err);

    //             res.send('File uploaded!');
    //         });
    //         return
    //     }
    //     var uuid = short.generate();
    //     var fileId = filePath + uuid;
    //     req.files.fileName.mv(fileId, err => {
    //         if (err)
    //             return res.status(500).send(err);

    //         res.send('File uploaded 2x!');
    //     });
    // });
    req.files.fileName.mv(filePath, err => {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

app.get('/files', (req, res) => {

    fs.readdir(fileStoragePath, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            res.send(result)
        }
    })

})

app.delete('/files/:fileName', (req, res) => {
    var filePath = path.join(fileStoragePath, '/' + req.params.fileName)

    fs.access(filePath, (err) => {
        if (err) {
            console.error(err)
            res.send("file does not exist")
            return
        }

        fs.unlink(filePath, (error) => {
            if (error) {
                console.log(error);
                res.send("error occured")
                return
            }
            res.send("file successfully deleted")
        })
        //file exists
    })

})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


