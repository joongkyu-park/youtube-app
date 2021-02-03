import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios'

function LikeDislikes(props) {


    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)

    let variables = {}

    if (props.video) {
        variables = { videoId: props.videoId, userId: props.userId }
    } else {
        variables = { commentId: props.commentId, userId: props.userId }
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', variables)
            .then(response => {
                if (response.data.success) {

                    // 얼마나 많은 좋아요를 받았는지

                    setLikes(response.data.likes.length)


                    // 내가 이미 그 좋아요를 눌렀는지


                    // 수많은 좋아요를 누른 사람중에 내가 있다면, setLikeAction을 실행하는 코드
                    response.data.likes.map(like => {
                        if (like.userId === props.userId) {
                            setLikeAction('liked')
                        }
                    })


                } else {
                    alert('Likes의 정보를 가져오지 못했습니다.')
                }
            })


        Axios.post('/api/like/getDislikes', variables)
            .then(response => {
                if (response.data.success) {

                    // 얼마나 많은 싫어요를 받았는지

                    setDislikes(response.data.dislikes.length)


                    // 내가 이미 그 싫어요를 눌렀는지

                    response.data.dislikes.map(dislike => {
                        if (dislike.userId === props.userId) {
                            setDislikeAction('disliked')
                        }
                    })


                } else {
                    alert('Dislikes의 정보를 가져오지 못했습니다.')
                }
            })
    }, [])

    const onLike = () => {
        if (LikeAction === null) {
            // 좋아요 버튼이 아직 클릭이 안되었을 때

            Axios.post('/api/like/uplike', variables)
                .then(response => {
                    if (response.data.success) {

                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        if(DislikeAction !== null){
                            setDislikeAction(null)
                            setDislikes(Dislikes-1)
                        }

                    } else {
                        alert('좋아요를 누르는데 실패했습니다.')
                    }
                })
        } else {
            // 좋아요가 클릭되어 있었을 때
            Axios.post('/api/like/unlike', variables)
            .then(response => {
                if (response.data.success) {
                    
                    setLikes(Likes -1)
                    setLikeAction(null)
                } else {
                    alert('좋아요를 누르는데 실패했습니다.')
                }
            })
        }
    }

    const onDislike = () => {

        if(DislikeAction !== null) {

            Axios.post('/api/like/unDislike', variables)
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes-1)
                    setDislikeAction(null)

                    
                }else {
                    alert('싫어요를 누르는데 실패했습니다.')
                }
            })
        } else{

            Axios.post('/api/like/upDislike', variables)
            .then(response => {
                if(response.data.success) {

                    setDislikes(Dislikes +1)
                    setDislikeAction('disliked')

                    if(LikeAction !== null){
                        setLikeAction(null)
                        setLikes(Likes-1)
                    }

                }else {
                    alert('싫어요를 누르는데 실패했습니다.')
                }
            })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike} />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>&nbsp;&nbsp;

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike} />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>

            </span>&nbsp;&nbsp;
        </div>
    )
}

export default LikeDislikes
