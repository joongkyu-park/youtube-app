const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const videoSchema = mongoose.Schema({

    // 여기에 적어주는것이 Field

    writer: {
        // Schema.Types.ObjectId는 참조하는 스키마에서 id를 가져오게 할 수 있다. 다른 정보들에도 모두 접근가능. 여기서는 참조하는 스키마가 User이다.
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }
    

    //timestamp로 만든날짜와 업데이트날짜 표시 가능
}, {timestamp: true})

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }