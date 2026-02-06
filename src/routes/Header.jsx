import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button, Container, Form, InputGroup, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUsername } from "../hooks/Username";
import LoginForm from "../components/LoginForm";

const Header = ({showLogin, setShowLogin, showRegister, setShowRegister}) => {
    let navigate = useNavigate();   //URL 이동시 html표시를 도와줌
    let username = useUsername();   //coustom hook을 불러옴


    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
        <Navbar bg="dark" data-bs-theme="dark" className='narbar header'>
            <Container fluid>
                <img src='/img/react.png' style={{width: "2%", cursor: "pointer"}} onClick={() => { navigate('/')}}/>
                <Navbar.Brand style={{cursor: "pointer"}} onClick={() => { navigate('/')}}>{username}신발샵이다</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link onClick={() => { navigate('/cart')}}>장바구니</Nav.Link>
                </Nav>
                <Nav className="ms-auto headerName" style={{ width: "auto", paddingRight: "15%", textAlign: "right" }}>
                    <div className="login-anchor d-flex gap-2">
                        <Button variant="outline-light" onClick={() => {navigate("/"); alert('아직 안만듬');}}>상품추가</Button>
                        <Button variant="outline-light" onClick={() => setShowLogin(!showLogin)}>로그인</Button>

                        {showLogin && <LoginForm setShowLogin={setShowLogin} showRegister={showRegister} setShowRegister={setShowRegister}/>}
                    </div>
                </Nav>
                <Nav style={{ textAlign: "right" }}>
                    <InputGroup>
                            <Form.Control
                            placeholder="검색 (아직 안만듬)"
                            aria-label="search"
                            />
                            <Button variant="primary"
                            onClick={() => {
                                alert('아직 안만들었다고')
                            }}
                            >검색</Button>
                            <Button variant="outline-info">필터</Button>
                    </InputGroup>
                </Nav>
            </Container>
        </Navbar>
        </>
    );
}
export default Header;