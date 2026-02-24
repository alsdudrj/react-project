import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const DetailSkeletonImg = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        {/* 이미지 스켈레톤 */}
        <div className="col-md-6">
          <Skeleton height={500} borderRadius={10} />
        </div>
        
        {/* 상품 정보 스켈레톤 */}
        <div className="col-md-6 mt-4 mt-md-0">
          <Skeleton width="40%" height={30} className="mb-4" /> {/* 제목 */}
          <Skeleton width="30%" height={20} className="mb-2" /> {/* 제조사 */}
          <Skeleton width="25%" height={25} className="mb-4" /> {/* 가격 */}
          
          <div className="mb-4">
            <Skeleton width="100%" height={40} /> {/* 사이즈 선택바 */}
          </div>
          
          <Skeleton width="140px" height={45} borderRadius={5} /> {/* 버튼 */}
        </div>
      </div>
    </div>
  );
};

export default DetailSkeletonImg;