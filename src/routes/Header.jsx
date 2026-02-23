import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button, Container, Form, InputGroup, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUsername } from "../hooks/Username";
import LoginForm from "../components/LoginForm";
import FilterForm from "../components/FilterForm";
import { jwtDecode } from "jwt-decode";
import { useToken } from "../hooks/Token";
import { useState } from "react";
import { useLogout } from "../hooks/Logout";

const Header = ({showLogin, setShowLogin, showRegister, setShowRegister, showFilter, setShowFilter, setFooterFade, setFooterMsg}) => {
    let navigate = useNavigate();   //URL 이동시 html표시를 도와줌
    let username = useUsername();   //coustom hook을 불러옴
    const [token, userRole] = useToken();      //유저정보 확인을 위한 Custom Hook

    
    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
        <Navbar bg="dark" data-bs-theme="dark" className='narbar header'>
            <Container fluid>
                <img src='/img/react.png' style={{width: "2%", cursor: "pointer"}} onClick={() => { navigate('/')}}/>
                <Navbar.Brand style={{cursor: "pointer"}} onClick={() => { navigate('/')}}>{username}신발샵이다</Navbar.Brand>
                {token &&
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => { navigate('/cart')}}>장바구니</Nav.Link>
                    </Nav>
                }

                {/*버튼*/}
                <Nav className="ms-auto headerName" style={{ width: "auto", paddingRight: "15%", textAlign: "right" }}>
                    <div className="login-anchor d-flex gap-2">
                        {userRole === 'ROLE_ADMIN' &&
                            <Button variant="outline-light" onClick={() => {navigate("/add-product");}}>상품추가</Button>
                        }
                        {!token ?
                            <Button variant="outline-light" onClick={() => setShowLogin(!showLogin)}>로그인</Button>
                        :
                            <Button variant="outline-danger"
                            onClick={() => {
                                localStorage.removeItem("token");
                                window.dispatchEvent(new Event('login-change'));

                                setFooterFade('');
                                setTimeout(() => { setFooterFade('footEnd'); }, 10);
                                setFooterMsg("🔴 로그아웃 성공");
                                navigate('/');
                            }}
                            >로그아웃</Button>
                        }

                        {/*로그인 폼*/}
                        {showLogin && 
                        <LoginForm 
                            setShowLogin={setShowLogin} 
                            showRegister={showRegister} 
                            setShowRegister={setShowRegister}
                            setFooterFade={setFooterFade} 
                            setFooterMsg={setFooterMsg}
                        />}
                    </div>
                </Nav>
                <Nav style={{ textAlign: "right" }}>
                    <InputGroup className="search-anchor">
                        <Form.Control
                        placeholder="검색 (아직 안만듬)"
                        aria-label="search"
                        />
                        <Button variant="primary"
                        onClick={() => {
                            alert('아직 안만들었다고')
                        }}
                        >검색</Button>
                        <Button variant="outline-info" onClick={() => setShowFilter(!showFilter)}>필터</Button>

                        {showFilter && <FilterForm setShowFilter={setShowFilter}/>}
                    </InputGroup>
                </Nav>
            </Container>
        </Navbar>
        </>
    );
}
export default Header;