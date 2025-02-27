import { auth } from "@/auth";

const DashboardPage = async () => {
  const session = await auth();
  const role = session?.user.role;
  return <div>{role}</div>;
};

export default DashboardPage;
