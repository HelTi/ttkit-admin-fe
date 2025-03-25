# 提示词模版管理 API 文档

## 基础信息
- 基础路径: `/prompt-template`
- 所有接口都需要 JWT 认证
- 角色权限: ADMIN(管理员), PUBLIC(公开访问)

## 模版管理接口

### 创建模版
- **接口**: `POST /prompt-template`
- **权限**: ADMIN
- **请求体**:
```json
{
  "name": "string",        // 模版名称
  "description": "string", // 模版描述
  "content": "string",     // 模版内容
  "is_active": boolean     // 是否启用
}
```

### 获取模版列表
- **接口**: `GET /prompt-template`
- **权限**: PUBLIC
- **查询参数**:
  - `name`: string (可选) - 模版名称，支持模糊搜索
  - `is_active`: boolean (可选) - 是否启用
  - `page`: number (可选) - 页码，默认 1
  - `limit`: number (可选) - 每页数量，默认 20
- **返回数据**:
```json
{
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "content": "string",
      "is_active": boolean,
      "create_time": "Date",
      "update_time": "Date",
      "presets": [
        {
          "name": "string",
          "description": "string",
          "content": "string",
          "is_active": boolean,
          "create_time": "Date",
          "update_time": "Date"
        }
      ]
    }
  ],
  "count": number,
  "pageNo": number,
  "pageSize": number,
  "pageTotal": number
}
```

### 获取模版详情
- **接口**: `GET /prompt-template/:id`
- **权限**: ADMIN
- **路径参数**:
  - `id`: string - 模版ID

### 更新模版
- **接口**: `PATCH /prompt-template/:id`
- **权限**: ADMIN
- **路径参数**:
  - `id`: string - 模版ID
- **请求体**:
```json
{
  "name": "string",        // 可选
  "description": "string", // 可选
  "content": "string",     // 可选
  "is_active": boolean     // 可选
}
```

### 删除模版
- **接口**: `DELETE /prompt-template/:id`
- **权限**: ADMIN
- **路径参数**:
  - `id`: string - 模版ID

## 预设管理接口

### 创建预设
- **接口**: `POST /prompt-template/preset`
- **权限**: ADMIN
- **请求体**:
```json
{
  "name": "string",        // 预设名称
  "description": "string", // 预设描述
  "content": "string",     // 预设内容
  "template_id": "string", // 关联的模版ID
  "is_active": boolean     // 是否启用
}
```

### 获取预设列表
- **接口**: `GET /prompt-template/preset`
- **权限**: PUBLIC
- **查询参数**:
  - `name`: string (可选) - 预设名称，支持模糊搜索
  - `template_id`: string (可选) - 模版ID
  - `is_active`: boolean (可选) - 是否启用
  - `page`: number (可选) - 页码，默认 1
  - `limit`: number (可选) - 每页数量，默认 20
- **返回数据**:
```json
{
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "content": "string",
      "is_active": boolean,
      "create_time": "Date",
      "update_time": "Date",
      "template_id": {
        "_id": "string",
        "name": "string",
        "description": "string",
        "content": "string",
        "is_active": boolean,
        "create_time": "Date",
        "update_time": "Date"
      }
    }
  ],
  "count": number,
  "pageNo": number,
  "pageSize": number,
  "pageTotal": number
}
```

### 获取预设详情
- **接口**: `GET /prompt-template/preset/:id`
- **权限**: ADMIN
- **路径参数**:
  - `id`: string - 预设ID

### 更新预设
- **接口**: `PATCH /prompt-template/preset/:id`
- **权限**: ADMIN
- **路径参数**:
  - `id`: string - 预设ID
- **请求体**:
```json
{
  "name": "string",        // 可选
  "description": "string", // 可选
  "content": "string",     // 可选
  "template_id": "string", // 可选
  "is_active": boolean     // 可选
}
```

### 删除预设
- **接口**: `DELETE /prompt-template/preset/:id`
- **权限**: ADMIN
- **路径参数**:
  - `id`: string - 预设ID

## 错误响应
所有接口在发生错误时会返回统一的错误格式：
```json
{
  "statusCode": number,
  "message": "string",
  "error": "string"
}
```

## 注意事项
1. 删除模版时会检查是否有关联的预设，如果有则无法删除
2. 创建预设时会验证关联的模版是否存在
3. 预设名称在同一模版下不能重复
4. 模版名称不能重复
5. 所有时间字段均为 ISO 格式的日期时间字符串
6. 分页接口的页码从 1 开始计数
