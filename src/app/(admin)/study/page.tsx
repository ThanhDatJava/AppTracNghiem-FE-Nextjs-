import { auth } from "@/auth";

import "./dashboardPage.css";

import StatisticsChartArea from "@/components/page/dashboard/statisticsChart";
import StatisticsChartActive from "@/components/page/dashboard/statisticsChartActive";
import StatisticsChartStudent from "@/components/page/dashboard/statisticsChartStudent";

const DashboardPage = async () => {
  const session = await auth();
  const role = session?.user.role;
  return (
    <div className="DashboardPage">
      <div className="Dashboard-Study">
        <h1>Số lượng người tham gia</h1>
        <StatisticsChartStudent />
        <StatisticsChartActive />
      </div>
      <div className="Dashboard-Quiz">
        <h1>Điểm Trung bình của các bài quiz</h1>
        <StatisticsChartArea />
      </div>
    </div>
  );
};

export default DashboardPage;
