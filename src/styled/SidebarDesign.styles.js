import styled from "styled-components";

export const SidebarDesign = styled.div`
    position: fixed;   
    right: 2%;
    width: 10vw;       
    top: 150px;
    min-width: 80px;
    max-width: 210px;            
    z-index: 100;      
    
    background: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

export const SidebarImg = styled.img`
    cursor: pointer;
    height: 4.6vw;
    min-height: 32px;
    max-height: 117px;
    width: 7.25vw;
    min-width: 50px;
    max-width: 185px;
    border-radius: 100px;
`;

export const SidebarH6 = styled.h6`
    cursor: pointer;
    marginTop: 6px;
`;
