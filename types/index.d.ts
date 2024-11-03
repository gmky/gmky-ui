import type { Avatar } from '#ui/types'

export type UserStatus = 'ACTIVE' | 'PENDING' | 'LOCKED'

export interface User {
  id: number
  username: string
  fullName: string
  email: string
  avatar?: Avatar
  status: UserStatus
  location?: string
  userId: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: Avatar
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  idToken: string
}


export type RoleType = 'TEMPLATE' | 'CUSTOM'
export interface Role {
  id: Number
  name: string
  description: string
  type: RoleType
  isEnable: boolean
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export type PSType = 'TEMPLATE' | 'CUSTOM'
export interface PermissionSet {
  id: number
  name: string
  type: PSType
  description: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export interface Permission {
  id: number
  permissionCode: string
  resourceCode: string
  description: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export interface Meta {
  page: number
  total: number
  size: number
}

export interface SummaryItem {
  resource: string
  permissions: string[]
}