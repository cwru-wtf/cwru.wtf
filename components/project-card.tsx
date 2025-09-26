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
        return { label: 'In Progress', className: 'bg-blue-500/20 text-blue-400 border-blue-400' }
      case 'pending':
        return { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-400' }
      case 'complete':
        return { label: 'Complete', className: 'bg-green-500/20 text-green-400 border-green-400' }
      default:
        return null
    }
  }

  const statusConfig = getStatusConfig(status)

  const cardContent = (
    <Card className="overflow-hidden border border-gray-800 bg-black/50 transition-all hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer">
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
          {icon && <span className="text-green-400">{icon}</span>}
          <h3 className="font-mono text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="mt-2 text-gray-400 whitespace-pre-line">{description}</p>
        {statusConfig && (
          <div className="mt-4 flex justify-end">
            <Badge className={`${statusConfig.className} text-xs font-medium`}>
              {statusConfig.label}
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t border-gray-800 p-6">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="border-gray-700 bg-black/50 text-gray-300">
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
