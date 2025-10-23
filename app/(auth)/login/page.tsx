import Login from "@/components/Auth/Login";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getCurrentUser();

  if (session) {
    return redirect("/");
  }
  return <Login />;
}
