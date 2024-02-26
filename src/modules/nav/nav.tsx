import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import NavSkeleton from "./nav-skeleton";

const routes = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Savings",
    url: "/savings",
  },
];

const Navbar = () => {
  const { initalLoading } = useSelector((state: RootState) => state.userInfo);

  if (initalLoading) return <NavSkeleton />;
  return (
    <div className="w-full flex justify-between">
      <div>
        <Image src="/logo.svg" alt="starling logo" width={30} height={30} />
      </div>

      <div className="hidden md:flex gap-4 items-center">
        {routes.map((r, i) => (
          <Link key={i} href={r.url}>
            {r.name}
          </Link>
        ))}
      </div>
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 items-start">
              {routes.map((r, i) => (
                <Link key={i} href={r.url}>
                  {r.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
