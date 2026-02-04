import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonImg = () => {
return (
  <>
  <div className="container mt-5">
    <div className="row">
            {/*스켈레톤 이미지 3개씩 로딩*/}
      {[1, 2, 3].map((v) => (
        <div className="col-md-4 p-4" key={v}>
          <Skeleton height={300} borderRadius={10}/>              {/* 이미지 */}
          <div className="text-center mt-3">
            <Skeleton width="60%" height={25}/>                   {/* 제목 */}
            <Skeleton width="60%" height={20} className="mt-2"/>  {/* 가격 */}
          </div>  
        </div>
      ))}
    </div>
  </div>
  </>
  );
};
export default SkeletonImg;