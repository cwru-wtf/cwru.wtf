"use client";

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  image: string
  icon?: ReactNode
  link?: string
  status?: 'in-progress' | 'pending' | 'complete'
}

export default function ProjectCard({ title, description, tags, image, icon, link, status }: ProjectCardProps) {
  const handleClick = () => {
    if (!link || link.trim() === "") {
      toast.info("Coming soon!")
    }
  }

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'in-progress':
        return { label: 'In Progress', className: 'bg-blue-50 text-blue-600 border-blue-200' }
      case 'pending':
        return { label: 'Pending', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
      case 'complete':
        return { label: 'Complete', className: 'bg-green-50 text-green-700 border-green-200' }
      default:
        return null
    }
  }

  const statusConfig = getStatusConfig(status)

  const cardContent = (
    <Card className="overflow-hidden border border-border bg-card transition-all hover:border-foreground/30 hover:shadow-md cursor-pointer">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <h3 className="font-mono text-xl font-bold">{title}</h3>
        </div>
        <p className="mt-2 text-muted-foreground whitespace-pre-line">{description}</p>
        {statusConfig && (
          <div className="mt-4 flex justify-end">
            <Badge className={`${statusConfig.className} text-xs font-medium`}>
              {statusConfig.label}
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t border-border p-6">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="border-border text-muted-foreground">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  )

  if (link && link.trim() !== "") {
    return (
      <Link href={link} target="_blank" rel="noopener noreferrer">
        {cardContent}
      </Link>
    )
  }

  return (
    <div onClick={handleClick}>
      {cardContent}
    </div>
  )
}
