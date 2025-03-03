import React from "react";
import { Carousel } from "antd";
import "./bannerHomePage.css";
import { useRouter } from "next/navigation";

const BannerHomePage: React.FC = () => {
  const router = useRouter(); // Khởi tạo useRouter từ Next.js

  const handleClick = () => {
    // Điều hướng đến trang đăng nhập khi người dùng nhấn nút
    router.push("/auth/login");
  };

  return (
    <Carousel autoplay>
      <div className="banner-homepage banner-1">
        <div className="banner-content">
          <h3>Học hỏi là chìa khóa thành công</h3>
          <p>Khám phá kiến thức và nâng cao kỹ năng mỗi ngày.</p>
          <button className="btn-banner" onClick={handleClick}>
            Bắt đầu khóa học !
          </button>
        </div>
      </div>
      <div className="banner-homepage banner-2">
        <div className="banner-content banner-content-2-4">
          <h3>Giáo dục là vũ khí mạnh mẽ nhất</h3>
          <p>Sử dụng giáo dục để thay đổi tương lai của bạn.</p>
          <button className="btn-banner" onClick={handleClick}>
            Bắt đầu khóa học !
          </button>
        </div>
      </div>
      <div className="banner-homepage banner-3">
        <div className="banner-content ">
          <h3>Phát triển bản thân mỗi ngày</h3>
          <p>Không ngừng học hỏi và hoàn thiện mình.</p>
          <button className="btn-banner" onClick={handleClick}>
            Bắt đầu khóa học !
          </button>
        </div>
      </div>
      <div className="banner-homepage banner-4">
        <div className="banner-content banner-content-2-4">
          <h3>Tương lai tươi sáng nhờ học tập</h3>
          <p>Đầu tư vào học tập chính là đầu tư vào tương lai của bạn.</p>
          <button className="btn-banner" onClick={handleClick}>
            Bắt đầu khóa học !
          </button>
        </div>
      </div>
    </Carousel>
  );
};

export default BannerHomePage;
