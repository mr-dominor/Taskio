import Logo from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export const Navbar = ()=>{
    return (
        <div className=" fixed top-0 w-full h-14 bg-white flex border-b shadow-sm items-center px-4">
            <div className="md:max-w-screen-2xl max-auto flex items-center w-full justify-between">
                <Logo />
                <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
                    <Button size={"sm"} variant={"outline"} asChild>
                        <Link href="/sign-in">
                        Login
                        </Link>
                    </Button>
                    <Button size={"sm"}>Get Taskio fro free</Button>
                </div>
            </div>
        </div>
    );
}