import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'

function Comment(props) {

    // redux state에서 user 정보를 가져옴
    const user = useSelector(state => state.user);

    // 상위컴포넌트에서 props로 videoId를 받아온다.
    const videoId = props.postId;

    const [commentValue, setcommentValue] = useState("")

    const handleClick = (e) => {
        setcommentValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id, // 지금까진 localStorage로 가져왔지만, 이번엔 redux로 가져왔다.


            postId: videoId
        }
        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result)
                    setcommentValue("")
                    props.refreshFunction(response.data.result)
                } else {
                    alert('댓글을 저장하지 못했습니다.')
                }
            })
    }

    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />


            {/* Comment Lists */}

            {props.commentlists && props.commentlists.map((comment, index) => (
                // responseTo가 없는애들. 즉 root 댓글들만 출력
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={videoId} commentlists={props.commentlists} />
                    </React.Fragment>
                )
            ))}

            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"

                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}
                >Submit</button>

            </form>
        </div>
    )
}

export default Comment
