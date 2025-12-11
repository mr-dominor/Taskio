import { cn } from "@/lib/utils"
import { raleway } from "../ui/fonts";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

const MarketingLayout = ({children}:{children:React.ReactNode}) =>{
    return(
        <div className={"bg-slate-100 h-full font-sans"}>
            <main className="pt-40 pb-20 bg-slate-100">
                <Navbar />
                {children}
                <Footer />
            </main>
        </div>
    )
}

export default MarketingLayout;