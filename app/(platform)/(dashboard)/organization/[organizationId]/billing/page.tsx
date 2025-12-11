import { checkSubscription } from "@/lib/subscription"
import { Info } from "../_components/info";
import { Separator } from "@/components/ui/separator";
import { SubsriptionButton } from "./_components/subs-button";

 
const BillingPage = async()=>{
    const isPro = await checkSubscription();
    return(
        <div className="w-full">
            <Info isPro={isPro} />
            <Separator className="my-2" />
            <SubsriptionButton isPro={isPro} />
        </div>
    )
}

export default BillingPage;