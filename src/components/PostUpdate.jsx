import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { app } from '../firebaseInit'
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore'

const PostUpdate = ({ match, history }) => {
    const [changed, setChanged] = useState(false);
    const id = match.params.id;
    const db = getFirestore(app);
    const [form, setForm] = useState({
        id:'',
        title:'',
        body:'',
        date:'',
        email:''
    });
    const { title, body, date, email }= form;

    const getPost = async() => {
        const result=await getDoc(doc(db, 'posts', id));
        setForm(result.data());
    }

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
        setChanged(true);
    }

    const onUpdate = () => {
        if(changed) {
            if(!window.confirm('내용을 수정하실래요?')) return;
            setDoc(doc(db, 'posts', id), { ...form });
        }
        history.push('/posts');
    }

    useEffect(()=>{
        getPost();
    }, []);

    return (
        <Row className='my-5'>
            <Col>
                <h1 className='text-center mb-5'>게시글수정</h1>
                <Form>
                    <Form.Control className='my-2'
                        value={title} name="title" onChange={onChange}/>
                    <Form.Control className='my-2' as="textarea" rows={10}
                        value={body} name="body" onChange={onChange}/>
                    <div className='text-center mt-3'>
                        <Button className='px-5 me-2'
                            onClick={ onUpdate }>글수정</Button>
                        <Button className='px-5' variant='secondary'
                            onClick={ getPost }>취소</Button>
                    </div>
                </Form>
            </Col>
        </Row>
    )
}

export default PostUpdate