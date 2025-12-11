"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { AuditLog } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { Activity } from "./activty";

export const CardModal = () =>{
    const id = useCardModal((state) => state.id);
    const isOpen = useCardModal((state)=> state.isOpen)
    const onClose = useCardModal((state) => state.onClose)

    const { data: cardData } = useQuery<CardWithList>({
  queryKey: ["card", id],
  queryFn: () => fetcher(`/api/cards/${id}`),
  enabled: !!id, // only fetch when id is truthy
});

const { data: auditLogsData } = useQuery<AuditLog[]>({
  queryKey: ["card-logs", id],
  queryFn: () => fetcher(`/api/cards/${id}/logs`),
  enabled: !!id, // only fetch when id is truthy
});

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                {!cardData?(<Header.Skeleton />):(<Header data={cardData} />)}
                <div className="grid grid-cols-1 md:grid-cols-4 md:gp-4">
                    <div className="col-span-3">
                        <div className="w-full space-y-6">
                            {!cardData?<Description.Skeleton />:<Description data={cardData} />}
                            {!auditLogsData?<Activity.Skeleton />:<Activity items={auditLogsData} />}
                        </div>
                    </div>
                    {!cardData?<Actions.Skeleton />:<Actions data={cardData} />}
                </div>
            </DialogContent>
        </Dialog>
    )
} 