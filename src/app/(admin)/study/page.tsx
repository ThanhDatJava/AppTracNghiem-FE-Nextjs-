import { auth } from "@/auth";

export default async function HomePageMain() {
  const session = await auth();
  const role = session?.user?.role;

  return <>{role}</>;
}
