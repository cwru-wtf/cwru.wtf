import type { ReactNode } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  image: string
  icon?: ReactNode
}

export default function ProjectCard({ title, description, tags, image, icon }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden border border-gray-800 bg-black/50 transition-all hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10">
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
        <p className="mt-2 text-gray-400">{description}</p>
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
}
