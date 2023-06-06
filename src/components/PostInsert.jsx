import React, { useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { app } from '../firebaseInit'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import moment from 'moment'

const PostInsert = ({ history }) => {
    const db = getFirestore(app);
    const email = sessionStorage.getItem('email');    
    const [form, setForm] = useState({
        title: '',
        body: '',
        email: email,
        date: ''
    });
    const { title, body, date } = form;
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    const onReset = () => {
        setForm({
            title: '',
            body: '',
            email: email,
            date: ''
        });
    }

    const onInsert = async() => {
        const date=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        await addDoc(collection(db, 'posts'),{...form, date: date});
        history.push('/posts');
    }

    return (
        <Row className='my-5'>
            <Col>
                <h1 className='text-center mb-5'>글쓰기</h1>
                <Form >
                    <Form.Control className='my-2' 
                        placeholder='제목입력'
                        value={title} name="title" onChange={onChange}/>
                    <Form.Control as="textarea" rows={10} className='my-2'
                        placeholder='내용입력'
                        value={body} name="body" onChange={onChange}/>
                    <div className='text-center my-3'>
                        <Button className='mx-2 px-5'
                            onClick={ onInsert }>글등록</Button>
                        <Button className='mx-2 px-5' variant='secondary'
                            onClick={ onReset }>취소</Button>
                    </div>    
                </Form>
            </Col>
        </Row>
    );
}

export default PostInsert