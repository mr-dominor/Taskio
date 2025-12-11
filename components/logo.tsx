import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { poppins,open } from "@/app/ui/fonts";
const Logo = () =>{
    return(
         <Link href="/">
            <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
                <Image 
                src="/logo.svg"
                alt="Logo"
                width={30}
                height={30}
                />
                <p className={cn("text-lg font-bold text-neutral-700 pb-1",open.className)}>Taskio</p>
            </div>
        </Link>
    );
}

export default Logo