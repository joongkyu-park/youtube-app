import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    useEffect(() => {
        let commentNumber = 0;

        props.commentlists.map((comment) => {
            if (comment.responseTo === props.parentCommentId) {
                commentNumber++;
            }
        })
        setChildCommentNumber(commentNumber)
    }, [props.commentlists])

    let renderReplyComment = (parentCommentId) => {
        return( // 이 return을 강의에서 안붙여서 고생했다 ㅠㅠ 중괄호를 붙여줄거면 렌더링할 때 return은 꼭!
        props.commentlists.map((comment, index) => (
            <React.Fragment>
                {
                    comment.responseTo === parentCommentId &&
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.postId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommnetId={comment._id} postId={props.postId} commentlists={props.commentlists} />
                    </div>
                }
            </React.Fragment>
        ))
        )

    }

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }
    return (
        <div>

            { ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>
            }

            {OpenReplyComments && renderReplyComment(props.parentCommentId)}



        </div>
    )
}

export default ReplyComment
