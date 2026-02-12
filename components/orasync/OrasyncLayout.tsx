"use client"

import React from 'react'
import Header from './layout/Header'
import Sidebar from './layout/Sidebar'
import QuickActions from './layout/QuickActions'

interface OrasyncLayoutProps {
  children: React.ReactNode
}

export default function OrasyncLayout({ children }: OrasyncLayoutProps) {
  return (
    <div className="orasync-container">
      <Sidebar />
      <div className="orasync-main">
        <Header />
        <div className="orasync-content max-w-7xl mx-auto">
          {children}
        </div>
      </div>
      <div className="fixed right-8 bottom-8 w-64">
        <QuickActions />
      </div>
    </div>
  )
}
