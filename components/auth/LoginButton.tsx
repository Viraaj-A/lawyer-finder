"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "./LoginModal"

interface LoginButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export function LoginButton({ 
  variant = "default", 
  size = "default", 
  className,
  children = "Login"
}: LoginButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        {children}
      </Button>
      <LoginModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  )
}