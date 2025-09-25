import { Icons } from "@/components/icons";
import { TextAlignJustify } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import NavigationMenuNav from "./NavigationMenu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "../Logo";

export default function Header() {
  return (
    <header>
      <div className="flex items-center justify-between py-4 max-sm:p-2">
        <Logo />
        <div className="hidden lg:flex gap-1">
          <NavigationMenuNav />
        </div>
        <div className="hidden lg:flex gap-1">
          <div className="flex gap-2">
            <Link
              href="login"
              className={cn(
                buttonVariants({ size: "sm", variant: "ghost" }),
                "cursor-pointer"
              )}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "sm" }), "cursor-pointer")}
            >
              SignUp
            </Link>
          </div>
        </div>
        <div className="lg:hidden">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <TextAlignJustify />
          </Button>
        </div>
      </div>
    </header>
  );
}
