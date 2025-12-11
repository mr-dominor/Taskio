import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {MedalIcon} from "lucide-react"
import { poppins } from "../ui/fonts"
import Link from "next/link"

const MarketingPage = () =>{
    return(
        <div className="flex justify-center items-center">
            <div className="flex justify-center items-center flex-col">
                <div className="bg-amber-200 flex items-center justify-center p-2 rounded-lg text-amber-600 text-xl md:text-2xl">
                    <MedalIcon className="mr-2" />
                    No.1 Task Manager
                </div>
                <div className="m-2 p-6 text-center">
                    <h1 className="text-3xl md:text-5xl font-semibold">Taskio Helps Build Teams</h1>
                </div>
                <div className="m-2 p-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-bold text-4xl md:text-7xl rounded-lg">
                    work forward
                </div>
              <div className={cn(" text-sm md:text-xl text-center text-neutral-400 max-w-sm md:max-w-2xl mx-auto mt-4",poppins.className)}>
            Collaborate, manage projects, and reach new productvity peaks. From high rise to the office,the way your team works is unique - accept accoplish it all with Taskio.
        </div>
                <Button className="mt-6" size={"lg"} asChild><Link href="/sign-up">Get Taskio For Free →</Link></Button>
            </div>
        </div>
    )
}

export default MarketingPage