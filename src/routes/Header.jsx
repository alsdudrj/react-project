import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUsername } from "../hooks/Username";

const Header = () => {
    let navigate = useNavigate();   //URL 이동시 html표시를 도와줌

    let username = useUsername(); //coustom hook을 불러옴

    let result = useQuery({ //Tanstack Query 사용
        queryKey: ['getName'],
        queryFn: () => 
            axios.get('https://codingapple1.github.io/userdata.json')
            .then(a => a.data )
    })

    return(
        <>
        <Navbar bg="dark" data-bs-theme="dark" className='narbar'>
            <Container fluid>
                <img src='/img/react.png' style={{width: "2%", cursor: "pointer"}} onClick={() => { navigate('/')}}/>
                <Navbar.Brand style={{cursor: "pointer"}} onClick={() => { navigate('/')}}>{username}신발샵이다</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link onClick={() => { navigate('/cart')}}>Cart</Nav.Link>
                </Nav>
                <Nav className="ms-auto headerName" style={{ width: "20%", textAlign: "right" }}>
                    { result.isPending && '로딩중'}
                    { result.isError && '못불러옴'}
                    { result.isSuccess && <p>반갑다 {result.data.name}</p>}
                </Nav>
            </Container>
        </Navbar>
        </>
    );
}
export default Header;