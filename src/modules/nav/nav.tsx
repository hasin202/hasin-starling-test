import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

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

const Navbar: React.FC = () => {
  return (
    <div className="w-full flex justify-between">
      <div>
        <Image src="/logo.svg" alt="starling logo" width={30} height={30} />
      </div>

      <div className="hidden md:flex gap-4 items-center">
        {routes.map((r) => (
          <Link href={r.url}>{r.name}</Link>
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
