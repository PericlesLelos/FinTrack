import Image from "next/image";
import NavBar from "@/Components/NavBar";
import Splash from "@/Components/Splash";
export default function Home() {
  return (
    <div className="bg-white">
      <NavBar />
      <Splash />
    </div>
  );
}
