import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Subscribe(props) {

    const userTo = props.userTo
    const userFrom = props.userFrom

    const [Subscribed, setSubscribed] = useState(0)
    const [SubscribeNumber, setSubscribeNumber] = useState(false)

    useEffect(() => {

        const variable = { userTo: userTo, userFrom: userFrom }

        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })

        Axios.post('/api/subscribe/subscribed', variable)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert('정보를 받아오지 못했습니다.')
                }
            })
    }, [])


    const onSubscribe = () => {

        let subscribedVariables = {

            userTo: userTo,
            userFrom: userFrom
        }

        // 이미 구독 중이라면
        if (Subscribed) {

            Axios.post('/api/subscribe/unSubscribe', subscribedVariables)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 취소 하는데 실패했습니다.')
                    }
                })
        }
        // 아직 구독 중이 아니라면
        else {
            Axios.post('/api/subscribe/subscribe', subscribedVariables)
                .then(response => {
                    if (response.data.success) {

                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)

                    } else {
                        alert('구독 하는데 실패했습니다.')
                    }
                })
        }
    }
    return (
        <div>
            <button
                style={{ backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadious: '4px', color: 'white', padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase' }}
                onClick={onSubscribe}
            >

                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}

            </button>
        </div>
    )
}

export default Subscribe
