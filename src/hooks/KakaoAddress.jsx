import { useState } from "react";

export function useKakaoAddress() {
    const [address, setAddress] = useState("");     // 주소 저장용 state
    const [isOpen, setIsOpen] = useState(false);    // 모달 제어용 state

    const handleAddress = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') extraAddress += data.bname;
            if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setAddress(fullAddress);
        setIsOpen(false);
    };

    return [handleAddress, address, isOpen, setIsOpen];
};