const DetailTap_ProductData = ({item}) => {
    const tabs = [
        { id: 'detail', label: '상품상세', value: `${item.title} (${item.content})`},
        { id: 'producer', label: '생산자', value: '我是中国人' },
        { id: 'origin', label: '원산지', value: 'CHINA'},
        { id: 'shipping', label: '배송/교환/반품', value: '불가능' },
    ];

  return (
    <>
        <div style={{ borderTop: '2px solid #333', marginTop: '20px' }}>
        {tabs.map((item, i) => (
            <div key={i} style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            <div style={{ width: '150px', background: '#f9f9f9', padding: '10px', fontSize: '14px' }}>
                {item.label}
            </div>
            <div style={{ flex: 1, padding: '10px', fontSize: '14px' }}>
                {item.value}
            </div>
            </div>
        ))}
        </div>
    </>
  );
};
export default DetailTap_ProductData;