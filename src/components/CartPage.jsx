import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { app } from "../firebase/firebaseInit";
import { getDatabase, ref, remove, onValue } from "firebase/database";
import Book from "./Book";

const CartPage = () => {
  const db = getDatabase(app);
  const uid = sessionStorage.getItem("uid");

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBook = () => {
    setLoading(true);
    onValue(ref(db, `book/${uid}`), (snapshot) => {
      let rows = [];
      snapshot.forEach((row) => {
        rows.push({ key: row.key, ...row.val() });
      });

      setBooks(rows);
      setLoading(false);
    });
  };

  const deleteBook = async (id) => {
    if (window.confirm("정말 데이터를 삭제하시겠습니까?"))
      await remove(ref(db, `book/${uid}/${id}`));
  };

  useEffect(() => {
    getBook();
  }, []);

  if (loading) return <h1 className="text-center my-5">로딩중......</h1>;
  return (
    <Row className="justify-content-center my-5">
      <Col md={5}>
        <h1 className="text-center">장바구니</h1>
      </Col>

      <Row>
        <Table>
          <thead>
            <tr>
              <td>제목</td>
              <td>가격</td>
              <td>보기</td>
              <td>삭제</td>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.key}>
                <td>{book.title}</td>
                <td>{book.price}</td>
                <td>
                  <Book book={book} />{" "}
                </td>
                <td>
                  <Button
                    onClick={() => deleteBook(book.key)}
                    className="btn-sm"
                    variant="danger"
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Row>
  );
};

export default CartPage;