'use client'
import SideBar from "../_components/side-bar";

const OrganizationLayout = ({children}:{children:React.ReactNode}) =>{
    return (
    <main className="pt-20 md:pt-24  max-w-6xl 2xl:max-w-screen-xl mx-auto">
        <div className="flex gap-x-7">
            <div className="w-64 hidden md:block shrink-0">
                <SideBar storageKey="t-sidebar-state" />
            </div>
            {children}
        </div>
    </main>
    );
}
export default OrganizationLayout;