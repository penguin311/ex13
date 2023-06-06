import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Card } from 'react-bootstrap'
import { app } from '../firebaseInit'
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import LoadingPage from './LoadingPage'
import { Link } from 'react-router-dom'

const PostsPage = ({ history }) => {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [last, setLast] = useState(1);

    const uid=sessionStorage.getItem("uid");
    const db = getFirestore(app);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const getPosts = () => {
        const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
        
        setLoading(true);
        onSnapshot(q, (snapshot)=>{
            let rows=[];
            let size=3;
            let start=(page-1) * size;
            let end=(page*size)-1;
            snapshot.docs.forEach((row, index)=>{
                if(index >= start && index <= end) {
                    rows.push({ index:index+1, id:row.id, ...row.data() });
                }
            });
            setTotal(snapshot.docs.length);
            setLast(Math.ceil(snapshot.docs.length/size));
            setPosts(rows);
            setLoading(false);
        });
        
    }

    useEffect(()=>{
        getPosts();
    }, [page]);

    const onClickInsert = () => {
        if(uid) {
            history.push('/posts/insert');
        }else {
            sessionStorage.setItem('target', '/posts/insert');
            history.push('/login');
        }
    }

    if(loading) return <LoadingPage/>
    return (
        <Row className='my-5'>
            <Col>
                <h1 className='text-center mb-5'>게시글</h1>
                <div className='text-end mb-2'>
                    <Button className='btn-sm'
                        onClick={ onClickInsert }>글쓰기</Button>
                </div>
                <div style={{fontSize:'0.8rem'}}>
                    {posts.map(post=>
                    <Card className='mb-3' key={post.id}>
                        <Card.Body>
                            <Link to={`/posts/read/${post.id}`}>
                                <h5>[{post.index}] {post.title}</h5>
                            </Link>
                            <div className='ellipsis'>{post.body}</div>
                        </Card.Body>
                        <Card.Footer style={{fontSize:'0.5rem'}}>
                            Posted on {post.date} by {post.email}
                        </Card.Footer>
                    </Card>
                    )}
                </div>
                <div className='text-center my-3'>
                    <Button disabled={ page===1 }
                        onClick={ ()=>setPage(page-1) }>이전</Button>
                    <span className='px-3'>{ page } / { last }</span>
                    <Button disabled={ page===last}
                        onClick={ ()=>setPage(page+1) }>다음</Button>
                </div>
            </Col>
        </Row>
    )
}

export default PostsPage