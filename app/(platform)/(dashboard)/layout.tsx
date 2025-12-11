import { Footer } from "@/app/(marketing)/_components/footer"
import NavBar from "./_components/navbar-dash"

const DashBoardLayout = ({children}:{children:React.ReactNode}) =>{
    return(
        <div className="h-full">
            <NavBar />
            {children}
        </div>
    )
}
export default DashBoardLayout