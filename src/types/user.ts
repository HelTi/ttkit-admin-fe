/**
 * 用户角色枚举
 * ADMIN(0) = 超级管理员
 * USER(1) = 普通用户
 * PUBLIC(100) = 公开访问
 */
export enum UserRole {
  ADMIN = 0,
  USER = 1,
  PUBLIC = 100,
}

/**
 * 用户性别类型
 */
export type UserGender = 'male' | 'female' | 'other';

/**
 * 用户信息接口
 * 对应后端 User 模型
 */
export interface UserInfo {
  /** 用户真实姓名，必填 */
  name: string;
  /** 用户邮箱地址，必填，用于登录和接收通知 */
  email: string;
  /** 用户昵称，可选 */
  nick_name?: string;
  /** 用户角色类型，枚举值：ADMIN(0) = 超级管理员, USER(1) = 普通用户, PUBLIC(100) = 公开访问，默认值为 USER(1) */
  user_type: UserRole;
  /** 用户头像 URL，可选 */
  avatar_url?: string;
  /** 用户个性签名，可选 */
  signature?: string;
  /** 用户性别，枚举值：'male'(男), 'female'(女), 'other'(其他)，默认值为 'other' */
  gender?: UserGender;
  /** GitHub 用户 ID，可选，用于 GitHub OAuth 登录 */
  github_id?: string;
  /** 用户创建时间 */
  create_time?: Date | string;
  /** 用户信息更新时间 */
  update_time?: Date | string;
}

/**
 * 更新密码参数接口
 */
export interface UpdatePasswordParams {
  /** 旧密码 */
  oldPassword: string;
  /** 新密码 */
  newPassword: string;
}

/**
 * 更新用户信息参数接口
 */
export interface UpdateUserInfoParams {
  /** 用户真实姓名 */
  name?: string;
  /** 用户昵称 */
  nick_name?: string;
  /** 用户头像 URL */
  avatar_url?: string;
  /** 用户个性签名 */
  signature?: string;
  /** 用户性别 */
  gender?: UserGender;
}

/**
 * 用户列表查询参数接口
 */
export interface UserListParams {
  /** 当前页码 */
  current?: number;
  /** 每页条数 */
  pageSize?: number;
  /** 搜索关键词（姓名或邮箱） */
  keyword?: string;
  /** 用户角色筛选 */
  user_type?: UserRole;
}

/**
 * 用户列表响应数据接口
 */
export interface UserListResponse {
  /** 用户列表 */
  list: UserInfo[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  pageSize: number;
}
