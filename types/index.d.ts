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

export interface UnreadCount {
  count: number
}

export interface Notification {
  id: number
  title: string
  message: string
  data: any
  read: boolean
  translations: NotificationTranslation[]
  createdAt: string
  createdBy: string
}

export interface NotificationTranslation {
  locale: string
  title: string
  message: string
}

export interface Linkage {
  id: number
  domain: string
  username: string
  status: string
  liveId: string
  demoId: string
}

export interface Investment {
  id: number
  botName: string
  countWin: number
  countLose: number
  amountWin: number
  accountId: string
  amountLose: number
  balance: number
  startAt: string
  endAt: string
  userId: string
  linkageId: number
  status: string
  listBotAmount: string
  ruleCapital: string
  maxWin: number
  maxLose: number
  strategySignalId: number
  strategySignal: BotStrategy
  strategyCapital: BotStrategy
  strategyCapitalId: number
  accountType: string
}

export interface BotStrategy {
  id: number
  botType: string
  botNameVn: string
  botNameEn: string
  botMethod: string
  botDescVn: string
  botDescEn: string
  botRuleStrategy: string
  botRuleCapital: string
  Status: string
  sameColor: boolean
}

export interface BetHistory {
  id: number
  externalId: string
  userId: string
  linkageId; number
  email: string
  action: string
  amount: number
  type: string
  accMarketing: boolean
  accountId: string
  status: string
  botId: number
  amountWin: number
  amountLose: number
}