import Header from "@/components/Layout/Header/Header";
import Landing from "@/components/Layout/Home/Landing";

export default function Home() {
  return (
    <main className="container mx-auto min-h-screen overflow-x-hidden">
      <Header />
      <Landing />
    </main>
  );
}
