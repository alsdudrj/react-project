import { useState } from "react";

/**
 * 카카오 주소 검색 API 결과 처리 및 모달 상태 관리 훅
 * @returns {Array} [handleAddress, address, isOpen, setIsOpen]
 */
export function useKakaoAddress() {
    const [address, setAddress] = useState("");     //주소 저장용 state
    const [isOpen, setIsOpen] = useState(false);    //모달 제어용 state


    /**
     * 카카오 주소 API에서 주소 선택 시 실행되는 핸들러
     * @param {Object} data 카카오 API가 반환하는 주소 데이터 객체
     */
    const handleAddress = (data) => {
        let fullAddress = data.address; //기본 주소
        let extraAddress = '';          //디테일 주소

        //도로명 주소(R)일 경우 추가 정보 조합 로직
        if (data.addressType === 'R') {
            //법정동명이 있을 경우 추가
            if (data.bname !== '') extraAddress += data.bname;

            //건물명이 있을 경우 추가
            if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);

            //참고 항목이 존재하면 괄호로 감싸서 기본 주소 뒤에 붙임
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        //상태 업데이트
        setAddress(fullAddress);
        setIsOpen(false);
    };

    return [handleAddress, address, isOpen, setIsOpen];
};