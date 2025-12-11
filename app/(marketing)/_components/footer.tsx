import Logo from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export const Footer = ()=>{
    return (
        <div className=" fixed bottom-0 w-full h-20 bg-white flex border-t shadow-sm items-center px-4">
            <div className="md:max-w-screen-2xl max-auto flex items-center w-full justify-between">
                <Logo />
                <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
                    <Button size={"lg"} variant={"outline"} asChild>
                        <Link href="/sign-in">
                        Privacy Policy
                        </Link>
                    </Button>
                    <Button size={"lg"} variant={"outline"}>Terms & Services</Button>
                </div>
            </div>
        </div>
    );
} 