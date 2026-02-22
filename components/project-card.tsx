"use client";

import { useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
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

const STATUS = {
  'in-progress': { label: 'In Progress', dot: 'bg-blue-400' },
  'pending':     { label: 'Coming Soon', dot: 'bg-amber-400' },
  'complete':    { label: 'Live',         dot: 'bg-green-400' },
}

export default function ProjectCard({ title, description, tags, image, link, status }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)
  const hasLink = !!(link && link.trim() !== "")
  const statusConf = status ? STATUS[status] : null

  const handleClick = () => {
    if (!hasLink) toast.info("Coming soon!")
  }

  const card = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden border border-border cursor-pointer h-full flex flex-col transition-all duration-300"
      style={{
        boxShadow: hovered
          ? '0 20px 40px -8px rgba(0,0,0,0.12), 0 8px 16px -4px rgba(0,0,0,0.08)'
          : '0 1px 4px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className={`object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
        />

        {/* Status badge */}
        {statusConf && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${statusConf.dot}`} />
            <span className="text-xs font-mono font-medium text-foreground">{statusConf.label}</span>
          </div>
        )}

        {/* Link arrow */}
        {hasLink && (
          <div
            className="absolute top-3 right-3 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all duration-200"
            style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(0.8)' }}
          >
            <ArrowUpRight className="h-4 w-4 text-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3 className="font-serif text-lg font-bold text-foreground leading-snug">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-3 mt-1 border-t border-border">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-mono text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  if (hasLink) {
    return (
      <Link href={link!} target="_blank" rel="noopener noreferrer" className="block h-full">
        {card}
      </Link>
    )
  }

  return <div onClick={handleClick} className="h-full">{card}</div>
}
