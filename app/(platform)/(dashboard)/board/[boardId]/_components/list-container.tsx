"use client"
import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-items";
import {DragDropContext, Droppable} from "@hello-pangea/dnd"
import { useAction } from "@/hooks/use-actions";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { toast } from "sonner";
interface ListContainerProps {
    data:ListWithCards[];
    boardId:string
}

function reorder<T>(list: T[], startIndex:number, endIndex:number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex,1)
    result.splice(endIndex, 0, removed);
    return result;
}

export const ListContainer = ({data,boardId}:ListContainerProps) =>{
    const [orderedData, setOrderedData] = useState(data);
    const {execute:executeListOrder} = useAction(updateListOrder,{
        onSuccess:()=>{
            toast.success("List Ordered")
        },
        onError:(error)=>{
            toast.error(error)
        }
    })
    useEffect(()=>{
        setOrderedData(data);
    },[data]);

    const {execute:executeCardOrder} = useAction(updateCardOrder,{
        onSuccess:()=>{
            toast.success("Card reordered")
        }
    })

    const onDragEnd = (result:any) =>{
    const {destination, source, type} = result;
    if(!destination) return;

    // If position did not change
    if(
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) return;

    // User moved a LIST
    if(type === "list") {
        const items = reorder(
            orderedData,
            source.index,
            destination.index
        ).map((item, index) => ({ ...item, order:index }));

        setOrderedData(items);
        executeListOrder({items,boardId})
    }

    // User moved a CARD
    if(type === "card"){
        const newOrderedData = [...orderedData];

        const sourceList = newOrderedData.find(list => list.id === source.droppableId);
        const destList = newOrderedData.find(list => list.id === destination.droppableId);

        if(!sourceList || !destList) return;

        // Ensure arrays exist
        if(!sourceList.cards) sourceList.cards = [];
        if(!destList.cards) destList.cards = [];

        // Moving within SAME LIST
        if(source.droppableId === destination.droppableId) {
            const reorderedCards = reorder(
                sourceList.cards,
                source.index,
                destination.index
            );

            reorderedCards.forEach((card, idx) => (card.order = idx));
            sourceList.cards = reorderedCards;
        }

        // Moving to DIFFERENT LIST (this is what was missing)
        if(source.droppableId !== destination.droppableId) {
            const [movedCard] = sourceList.cards.splice(source.index, 1);
            destList.cards.splice(destination.index, 0, movedCard);

            // Reset order values on both lists
            sourceList.cards.forEach((card, idx) => (card.order = idx));
            destList.cards.forEach((card, idx) => (card.order = idx));
        }

        const cards = newOrderedData.flatMap(list =>
          list.cards.map(card => ({
            ...card,
            listId: list.id, // update listId if moved
          }))
        );
        
        executeCardOrder({
          boardId,
          items: cards,
        });
        
            }
        };

    return(
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) =>(
                    <ol 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex gap-x-3 h-full overflow-x-auto ">
                {
                    orderedData.map((list,index)=>{
                        return(
                            <ListItem key={list.id} index={index} data={list} />
                        )
                    })
                }
                <ListForm boardId={boardId} />
                <div className="flex-shrink-0 w-1" />
                </ol>
                )}
            </Droppable>
        </DragDropContext>
        
    )
}