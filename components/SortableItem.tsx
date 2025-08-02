"use client"

import { Doc, Id } from "@/convex/_generated/dataModel";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { BarChart3, Check, GripVertical, Pencil, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Input } from "./ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const SortableItem = ({id, link} : {
  id:  Id<"links">;
  link: Doc<"links">;
}) => {

  const { attributes, listeners, setNodeRef, transform, transition} = useSortable({ id });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link?.title);
  const [editUrl, setEditUrl] = useState(link?.url);
  const [isUpdating, startTransition] = useTransition();

  const deleteLink = useMutation(api.lib.links.deleteLink);
  const updateLink = useMutation(api.lib.links.updateLink);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleCancel = () => {
    setEditTitle(link.title);
    setEditUrl(link.url);
    setIsEditing(false);
  }

  const handleSave = async () => {
    if (!editTitle?.trim() || !editUrl.trim()) return;

    startTransition(async () => {
      try {
        // add https:// if nno protovol is specified
        let processedUrl = editUrl;
        if(
          !processedUrl.startsWith("https://") &&
          !processedUrl.startsWith("http://")
        ) {
          processedUrl = `https://${processedUrl}`;
        }

        await updateLink({
          linkId: id,
          title: editTitle.trim(),
          url: processedUrl,
        })
        setIsEditing(false);
        toast.success("Link updated successfully");
      } catch (error) {
        console.log("Failed to update link:", error);
      }
    });
  };

  if (!link) return null;

  return (
    <div ref={setNodeRef} style={style} 
      className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
    >

      {isEditing ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <Input 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Link Title"
              className="font-semibold"
            />
            <Input 
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="https://example.com"
              className="text-sm"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant='outline'
              size='sm'
              onClick={handleCancel}
              disabled={isUpdating}
            >
              <X className="size-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdating || !editTitle.trim() || !editUrl.trim()}
            >
              { isUpdating ? (
                <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Check className="size-4" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            aria-describedby={`link-${id}`}
            className="cursor-move p-1 hover:bg-gray-100 rounded flex-shrink-0"
          >
            <GripVertical className="size-4 text-gray-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-semibold text-lg truncate">{link.title}</h3>
            <p className="text-gray-600 text-sm truncate">{link.url}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Analytic Button */}
            <Button variant="outline" size='icon' className="size-8" asChild>
              <Link href={`/dashboard/link/${id}`}>
                <BarChart3 className="size-3.5 text-green-500" />
              </Link>
            </Button>

            {/* Edit Button */}
            <Button 
              variant="outline" size="icon" className="size-8"           
              onClick={() => {setIsEditing(true)}}
            >
              <Pencil className="size-3.5" />
            </Button>

            {/* Delete Button */}
            <Button
              variant='destructive' size='icon' className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                const isConfirmed = confirm(
                  `Are you sure you want to delete '${link.title}'? \n\nThis action cannot be undone.`,
                );

                if(isConfirmed){
                  deleteLink({ linkId: id });
                }
              }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}

export default SortableItem