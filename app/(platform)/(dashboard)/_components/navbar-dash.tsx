import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { FormPopover } from "@/components/forms/form-popover"
import { PlusIcon } from "lucide-react"
import MobileSideBar from "./mobile-sidebar"

const NavBar = () =>{
    return(
        <nav className="h-14 w-full bg-white fixed z-50 top-0 border-b shadow-sm flex items-center justify-between px-4">
            {/**SideBar */}

            <div className="flex items-center gap-x-4">
                <div>
                <MobileSideBar />
            </div>
                <div className="hidden md:flex">
                    <Logo />
                </div>
                <FormPopover align="start" side="bottom" sideOffset={18}>
                    <Button variant={"primary"} size="sm" className="rounded-sm hidden md:block h-auto py-1.5 px-2">
                      Create
                    </Button>
                </FormPopover>
                <FormPopover>
                    <Button variant={"primary"} size="sm" className="rounded-sm block md:hidden">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                </FormPopover>
            </div>
            <div className="px-4 space-x-2 flex items-center">
                <OrganizationSwitcher 
                afterCreateOrganizationUrl={'/organization/:id'}
                afterLeaveOrganizationUrl="/select-org"
                afterSelectOrganizationUrl={'/organization/:id'}
                />
                <UserButton
                 afterSignOutUrl="/"
                />
            </div>
        </nav>
    )
}

export default NavBar