import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { app } from '../firebaseInit'
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore'
import LoadingPage from './LoadingPage'
import { Link } from 'react-router-dom'

const PostRead = ({ match, history }) => {
    const id = match.params.id;
    const email = sessionStorage.getItem('email');
    const db = getFirestore(app);
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState({
        id: '',
        title:'',
        body:'',
        date:'',
        email:'',
    });
    
    const getPost = async() => {
        setLoading(true);
        const result= await getDoc(doc(db, 'posts', id));
        //console.log(result.data());
        setPost({ id:result.id, ...result.data() });
        setLoading(false);
    }

    useEffect(()=>{
        getPost();
    }, []);

    const onDelete = async(id) => {
        if(!window.confirm(id + '번 게시글을 삭제하실래요?')) return;
        await deleteDoc(doc(db, 'posts', id));
        history.push('/posts');
    }

    const onUpdate = async(id) => {
        history.push(`/posts/update/${id}`);
    }

    if(loading) return <LoadingPage/>
    return (
        <Row className='my-5'>
            <Col>
                <h1 className='text-center mb-5'>게시글정보</h1>
                {post.email===email && 
                <div className='text-end mb-2'>    
                    <Button className='btn-sm mx-2' 
                        onClick={ ()=>onUpdate(post.id) }>수정</Button>
                    <Button className='btn-sm' 
                        onClick={ ()=>onDelete(post.id) }>삭제</Button>
                </div>
                }
                <Card>
                    <Card.Body>
                        <h5>{post.title}</h5>
                        <hr/>
                        {post.body}
                    </Card.Body>
                    <Card.Footer>
                        Posted on {post.date} by {post.email}
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
    )
}

export default PostRead