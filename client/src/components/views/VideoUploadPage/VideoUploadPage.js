import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
// import TextArea from 'antd/lib/input/TextArea';
import Axios from 'axios';

// Redux store을 이용하기 위한 import
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography;


const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" }
]
const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
]

function VideoUploadPage(props) {

    //리덕스 store에서 user의 정보를 가져와서 변수에 담는다.
    const user = useSelector(state => state.user)


    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value);
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value);
    }
    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value);
    }
    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value);
    }
    const onDrop = (files) => {
        // files 파라메터에는 클라이언트에서 올린 파일이 담긴다.

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    //console.log(response.data)

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }

                    setFilePath(response.data.url)

                    Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                console.log(response.data)

                                setDuration(response.data.fileDuration)
                                setThumbnailPath(response.data.url)

                            } else {
                                alert('썸네일 생성에 실패했습니다.')
                                console.error();
                            }
                        })
                } else {
                    alert('비디오 업로드를 실패했습니다.')
                }
            })

    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }
        Axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if (response.data.success) {
                    //console.log(response.data)

                    message.success('성공적으로 업로드가 되었습니다.')
                    
                    //3초후에 랜딩페이지로 보내기 위해서
                    setTimeout(() => {
                        props.history.push('/')
                    }, 3000);
                    
                } else {
                    alert('비디오 업로드에 실패 했습니다.')
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>


            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Drop zone*/}

                    <Dropzone
                        onDrop={onDrop}
                        multiple={false} //한번에 파일을 1번올릴건지 많이올릴건지
                        maxSize={100000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />
                            </div>
                        )}
                    </Dropzone>

                    {/* Thubmnail */}

                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />

                <select onChange={onPrivateChange}>

                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}

                    {/* 위의 내용은 아래 두줄과 같은 내용이다.
                <option key value></option>
                <option key value></option>
                */}

                </select>
                <br />
                <br />
                <select onChange={onCategoryChange}>

                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}

                </select>
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
            </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage