const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const { Subscriber } = require('../models/Subscriber');


//=================================
//             Video
//=================================


// Storage Multer Config
let storage = multer.diskStorage({
    //파일을 올렸을 때 어디에다가 저장할지
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    //어떤 파일이름으로 저장할지
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }, // ex : 20210126_hello
    //비디오 업로드니까 mp4만 받기 위해서.
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

//위에서 정의한 storage 옵션주고, file은 single로 받을 수 있게.
const upload = multer({ storage: storage }).single("file");





router.post('/uploadfiles', (req, res) => {

    // 클라이언트에서 받은 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.post('/thumbnail', (req, res) => {

    // 썸네일 생성 하고 비디오 러닝타임도 가져오기

    let filePath = "";
    let fileDuration = "";

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata); // all metadata
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });


    // 썸네일 생성
    ffmpeg(req.body.url) //비디오 저장경로를 ffmpeg에 넣어준다.
        .on('filenames', function (filenames) { //썸네일 파일이름 생성
            console.log('Will generate' + filenames.join(', '))
            console.log(filenames)

            filePath = "uploads/thumbnails/" + filenames[0]
        })
        .on('end', function () { //썸네일 생성이후 뭘할것인지
            console.log('Screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration })
        })
        .on('error', function (err) { //에러가 났을 시
            console.error(err);
            return res.json({ success: false, err });
        })
        .screenshots({ //옵션을 줄 수 있음.
            // Will take screenshots at 20%, 40%, 60%, 80% of the video
            count: 3, // 3개의 썸네일생성하겠다는 뜻
            folder: 'uploads/thumbnails', // 썸네일을 저장할 폴더
            size: '320x240',
            //'%b' : input basename (filename w/o extension)
            filename: 'thumbnail-%b.png'
        })
})

router.post('/uploadVideo', (req, res) => {

    // 비디오 정보들을 저장한다.

    const video = new Video(req.body)

    // save는 몽고db의 메소드. db의 저장하는건 굉장히 간단하다.
    video.save((err, doc) => {
        if (err) {
            return res.json({ success: false, err })
        }
        res.status(200).json({ success: true })
    })

})

router.get('/getVideos', (req, res) => {

    // 비디오를 DB에서 가져와서 클라이언트에 보낸다.

    // 몽고db의 find 메서드. Video Collection안에 있는 모든 데이터를 가져온다.
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, videos })
        })
})

router.post('/getVideoDetail', (req, res) => {


    Video.findOne({ "_id": req.body.videoId })
        .populate('writer') // populate의 인자로 전달해주는 정보를 가지고 나머지 정보도 다 가져온다.
        .exec((err, videoDetail) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, videoDetail })
        })

})

router.post('/getSubscriptionVideos', (req, res) => {

    // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
    Subscriber.find({ 'userFrom': req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if (err) return res.status(400).send(err);

            // 자신이 구독하는 사람들이 담길 배열
            let subscribedUser = [];

            // map을 사용해서 구독하는 사람들을 배열에 담아준다.
            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo)
            })

            // 찾은 사람들의 비디오를 가지고 온다.

            // 몽고db의 $in 메소드를 사용. 대상이 여러개일 때 사용.
            // 이유는 subscribedUser가 당연히 여러명일 수 있기 때문에!
            Video.find({ writer: { $in: subscribedUser } })
                .populate('writer')
                .exec((err, videos) => {
                    if (err) return res.status(400).send(err);
                    res.status(200).json({ success: true, videos })
                })
        })
});

module.exports = router;
