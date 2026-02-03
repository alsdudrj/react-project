const Register = () => {
    return(
        <>
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
            >
            <Modal.Dialog>
                <Modal.Header closeButton>
                <Modal.Title>초간단 회원가입</Modal.Title>
                </Modal.Header>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="아이디" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="패스워드" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Control type="password" placeholder="이름" />
                </Form.Group>

                <Form.Check type="checkbox" label="일반인" className="login-checkbox"/>
                <Form.Check type="checkbox" label="관리자" className="login-checkbox"/>

                <Modal.Footer>
                <Button variant="outline-secondary">가입안해</Button>
                <Button variant="outline-danger">회원가입</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
        </>
    );
}
export default Register;