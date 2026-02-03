import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './routes/Header';
import Home from './routes/Home';
import About from './routes/About.jsx';
import Event from './routes/Event.jsx';
import data from './components/data.jsx';
import { createContext, useEffect, useState, lazy } from 'react';
import Sidebar from './routes/Sidebar.jsx';
import { Col, Container, Row } from 'react-bootstrap';
import Umm from './routes/umm.jsx';
// import Detail from './routes/Detail.jsx';
// import Cart from './routes/Cart.jsx';
const Detail = lazy(() => import('./routes/Detail.jsx')); //lazy방식 import
const Cart = lazy(() => import('./routes/Cart.jsx'));


/*Context를 만들어줌*/
export let Context1 = createContext();

function App() {
  let [shoes, setShoes] = useState(data); //서버에서 가져온 데이터(라고 침)
  let [qty, setQty] = useState([10, 11, 12]); //상품의 재고

  let [mainCount, setMainCount] = useState(0); //메인페이지 더보기 클릭횟수 -> AddItem까지 props 시켜줌

  
  let location = useLocation();     //현재 URL 정보를 받아옴

  /*홈페이지 첫 접속시 localStorage에 본 상품 배열 생성*/
  useEffect(() => {
    if(!localStorage.getItem('watchItem')){
      localStorage.setItem('watchItem', JSON.stringify([]))  
    }
  },[]);

  return (
    <>
      <Header/>

      <Container fluid className='p-0'>
          <Row>
            <Col md={11}> {/*sticky 확인을 위해 150vh 추가*/}
              <div className="App">
                <Routes>
                  <Route path="/" 
                  element={<Home 
                    shoes={shoes} setShoes={setShoes} 
                    mainCount={mainCount} setMainCount={setMainCount}
                  />}/>
                  <Route path='/detail/:id' element={
                    <Context1.Provider value={{shoes, qty}}>
                      <Detail shoes={shoes}/>
                    </Context1.Provider>}/>
                  <Route path="/cart" element={<Cart/>}/>

                  {/*Nested Routes 연습용*/}
                  <Route path='/about' element={<About/>}>
                    <Route path='member' element={<div>멤버임</div>}/>
                  </Route>
                  <Route path='/event' element={<Event/>}>
                    <Route path='one' element={<h4>첫 주문시 양배추즙 서비스</h4>}/>
                    <Route path='two' element={<h4>생일기념 쿠폰받기</h4>}/>
                  </Route>
                  
                  <Route path='/umm' element={<Umm/>}></Route>

                  {/*잘못된 URL 접속시 보야주는 페이지*/}
                  <Route path='*' element={<div>머임 여기서 나가셈</div>}/> 
                </Routes>
              </div>
            </Col>
            
            {/*Sidebar*/}
            <Col md={1}>
                <Sidebar shoes={shoes}/>
            </Col>
          </Row>
      </Container>
    </>
  );
}
export default App
