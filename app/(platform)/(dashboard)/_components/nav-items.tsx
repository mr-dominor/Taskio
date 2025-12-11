import { cn } from "@/lib/utils"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Activity, CreditCard, Layout, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"


export type Organization = {
    id:string,
    name:string,
    imageUrl:string,
    slug:string | null
}

interface NavItemsProps{
    isActive:boolean,
    organization:Organization,
    onExpanded: (id:string) => void,
    isExpanded:boolean,
}



export const NavItems = ({isActive, organization, onExpanded, isExpanded}:NavItemsProps) =>{
    const router = useRouter();
    const pathname = usePathname();
    const routes = [
        {
            label:"Boards",
            icon:<Layout className="h-4 w-4 mr-2" />,
            href:`/organization/${organization.id}/`
        },
        {
            label:"Activity",
            icon:<Activity className="h-4 w-4 mr-2" />,
            href:`/organization/${organization.id}/activity`
        },
        {
            label:"Settings",
            icon:<Settings className="h-4 w-4 mr-2" />,
            href:`/organization/${organization.id}/settings`
        },
        {
            label:"Billing",
            icon:<CreditCard className="h-4 w-4 mr-2" />,
            href:`/organization/${organization.id}/billing`
        }
    ]
    const onClickRedirect = (href:string) => {
        router.push(href)
    }
    return(<>
    <AccordionItem value={organization?.id} className="border-none">
        <AccordionTrigger onClick={()=>{onExpanded(organization?.id)}} className={cn("flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline", isActive && !isExpanded && "bg-sky-500/10 text-sky-700")}>
            <div className="flex items-center gap-x-2">
                    <div className="w-7 h-7 relative">
                        <Image 
                        src={organization?.imageUrl}
                        alt="Organization"
                        fill
                        className="rounded-sm object-cover"
                        />
                    </div>
                    <span className="font-medium text-sm">{organization?.name}</span>
                </div>
        </AccordionTrigger>
        <AccordionContent className="pt-1 text-neutral-700">
            {
                routes.map((route)=>(
                        <Button 
                        key={`${route.href}-${route.label}`}
                        size={"sm"} 
                        variant={"ghost"} 
                        className={cn("w-full font-normal justify-start pl-10 mb-1",pathname === route.href && "bg-sky-500/10 text-sky-700")}
                        onClick={()=>{onClickRedirect(route.href)}}>
                            {route.icon}
                            {route.label}
                        </Button>
                ))
            }
        </AccordionContent>
    </AccordionItem>
    </>)
}

NavItems.Skeleton = function SkeletoNavItem() {
    return (
        <div className="flex items-center gap-x-2">
            <div className="w-10 h-10 relative shrink-0">
                <Skeleton className="h-full w-full absolute"/>
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
    )
}