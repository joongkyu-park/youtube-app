import React,{useEffect, useState} from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios';
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    //이렇게 가져올수 있는 이유는, App.js에서 path를 "/video/:videoId" 로 설정했기때문 
    const variable = { videoId: videoId }

const [VideoDetail, setVideoDetail] = useState([])

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response=>{
                if(response.data.success){
                    setVideoDetail(response.data.videoDetail)
                }else{
                    alert('비디오 정보를 가져오는데 실패했습니다.')
                }
            })
    }, [])

    if(VideoDetail.writer){
    return (
        <Row gutter={[16, 16]}>
            <Col lg={18} xs={24} >
                <div style={{ width: '100%', padding: '3rem 4rem' }}>
                    <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />

                    <List.Item
                        actions={[<Subscribe userTo={VideoDetail.writer_id}/>]}
                    >
                        <List.Item.Meta
                            avatar = {<Avatar src={VideoDetail.writer.image} />}
                            title = {VideoDetail.writer.name}
                            description = {VideoDetail.description}
                        />
                    </List.Item>

                    {/* Comments */}

                </div>
            </Col>
            <Col lg={6} xs={24} >
                <SideVideo />
            </Col>
        </Row>
    )
} else{
    
    return(
        
        <div>...Loading...</div>
    )
}
}

export default VideoDetailPage