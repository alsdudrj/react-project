import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Header from './routes/Header';
import Home from './routes/Home';
import data from './data/data.jsx';
import { useEffect, useState, lazy } from 'react';
import Sidebar from './routes/Sidebar.jsx';
import { Col, Container, Row } from 'react-bootstrap';
import Register from './components/Register.jsx';
import { useFooterAlert } from './hooks/FooterAlert.jsx';
import { FooterText } from './styled/Detail.styles.js';
import AddProduct from './routes/AddProduct.jsx';
import { useLogout } from './hooks/Logout.jsx';
import MyPage from './routes/MyPage.jsx';
// import Detail from './routes/Detail.jsx';
// import Cart from './routes/Cart.jsx';
const Detail = lazy(() => import('./routes/Detail.jsx')); //lazy방식 import
const Cart = lazy(() => import('./routes/Cart.jsx'));


function App() {
  // let [shoes, setShoes] = useState(data.slice(0, 3)); //서버에서 가져온 데이터(라고 침)
  let [shoes, setShoes] = useState([]);        //상품추가 기능에 따른 배열 초기화
  let [mainCount, setMainCount] = useState(1); //메인페이지 더보기 클릭횟수 -> AddItem까지 props 시켜줌

  const [showLogin, setShowLogin] = useState(false); //로그인 폼 상태
  const [showFilter, setShowFilter] = useState(false); //검색 필터 폼 상태
  const [showRegister, setShowRegister] = useState(false); //회원가입 모달 상태

  const [footerFade, setFooterFade, footerMsg, setFooterMsg] = useFooterAlert();  //footer 애니메이션 Custom Hook

  const logout = useLogout(); //세션만료시 로그아웃을 위한 custom hook

  /* ======================================== */
  /* ====SessionStorage에 저장한 메세지 출력====*/
  useEffect(() => {
    const pendingMsg = sessionStorage.getItem("logoutMessage");
    if (pendingMsg) {
        // 푸터 메시지 띄우기 로직
        setFooterFade('');
        setTimeout(() => { 
            setFooterFade('footEnd'); 
            setFooterMsg(pendingMsg);
        }, 100);

        // 확인했으니 삭제
        sessionStorage.removeItem("logoutMessage");
    }
}, [setFooterFade, setFooterMsg]);


  /* ======================================================== */
  /* ====홈페이지 첫 접속시 sessionStorage에 본 상품 배열 생성==== */
  useEffect(() => {
    if(!sessionStorage.getItem('watchItem')){
      sessionStorage.setItem('watchItem', JSON.stringify([]))  
    }
  },[]);

  const authenticatedFetch = async (url, options) => {
    const res = await fetch(url, options);

    if (res.status === 401) {
        // 401 Unauthorized = 토큰 만료 혹은 유효하지 않음
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token"); // 토큰 삭제
        window.location.href = "/login";   // 로그인 페이지로 강제 이동
        return;
    }

    return res;
};


  /* ================================== */
  /* =============Route구간============= */ 
  return (
    <>
      <Header 
        setShowLogin={setShowLogin} showLogin={showLogin}
        showRegister={showRegister} setShowRegister={setShowRegister}
        showFilter={showFilter} setShowFilter={setShowFilter}
        setFooterFade={setFooterFade} setFooterMsg={setFooterMsg}
      />
      {showRegister == true && 
      <Register 
        setShowRegister={setShowRegister}
        setFooterFade={setFooterFade} setFooterMsg={setFooterMsg}
      />}
      

      <Container fluid className='p-0'>
        <div className="App">
          <Routes>
            <Route path="/" 
            element={<Home 
              shoes={shoes} setShoes={setShoes} 
              mainCount={mainCount} setMainCount={setMainCount}
              showLogin={showLogin}
            />}/>
            <Route path='/detail/:id' element={<Detail shoes={shoes} setFooterFade={setFooterFade} setFooterMsg={setFooterMsg}/>}/>
            <Route path="/cart" element={<Cart setFooterFade={setFooterFade} setFooterMsg={setFooterMsg}/>}/>
            <Route path="/add-product" element={<AddProduct setFooterFade={setFooterFade} setFooterMsg={setFooterMsg}/>}/>
            <Route path="/mypage" element={<MyPage setFooterFade={setFooterFade} setFooterMsg={setFooterMsg}/>}/>

            {/*잘못된 URL 접속시 보야주는 페이지*/}
            <Route path='*' element={<div>존재하지 않는 페이지이다</div>}/> 
          </Routes>
        </div>       

        {/*Sidebar*/}
        <Sidebar shoes={shoes}/>

        {/*FooterAlert*/}
        <FooterText className={`footer-animation ${footerFade ? 'footEnd' : 'footStart'}`}>
          {footerMsg}
        </FooterText>
      </Container>
    </>
  );
}
export default App
