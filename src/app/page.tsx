import { Feature17 } from "@/components/homepage/features";
import { Hero7 } from "@/components/homepage/hero";
import { Navbar1 } from "@/components/homepage/navbar";

export default function Home() {
  // redirect("/auth/login");
  return (
    <div>
      <Navbar1 />
      <div className="h-dvh flex items-center justify-center bg-background">
        <Hero7 />
      </div>
      <div className="px-8 py-8 md:px-10 lg:px-20">
        <Feature17 />
      </div>
    </div>
  );
}
