import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios';
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comment from './Sections/Comment'
import LikeDislikes from './Sections/LikeDislikes'
function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    //이렇게 가져올수 있는 이유는, App.js에서 path를 "/video/:videoId" 로 설정했기때문 
    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])

    const [Comments, setComments] = useState([])

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 정보를 가져오는데 실패했습니다.')
                }
            })

        Axios.post('/api/comment/getComments', variable)
            .then(response=>{
                if(response.data.success){
                    setComments(response.data.comments)
                }else{
                    alert('댓글 정보를 가져오는 것을 실패했습니다.')
                }
            })

    }, [])

    /* Comment 컴포넌트나 SingleComment 컴포넌트에서
    새로운 댓글을 추가했을 때:
    VideoDetaliPage에서 모든 댓글을 관리하기 때문에,
    refreshFunction을 props로 주고
    onSubmit을 할 때 refreshFunction을 실행킨다.
    concat 메서드를 이용해서 새로운 댓글을 추가시킨다.
    */
    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }

    if (VideoDetail.writer) {

        // 현재 로그인한 유저의 id와 비디오를 업로드한 유저의 id가 다를 때에만 구독버튼이 보이도록!
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24} >
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />

                        <List.Item
                            actions={[<LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId} />,subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>

                        {/* Comments */}
                        <Comment refreshFunction={refreshFunction} commentlists={Comments} postId={videoId}/>


                    </div>
                </Col>
                <Col lg={6} xs={24} >
                    <SideVideo />
                </Col>
            </Row>
        )
    } else {

        return (

            <div>...Loading...</div>
        )
    }
}

export default VideoDetailPage