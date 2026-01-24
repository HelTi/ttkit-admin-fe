// 菜单项类型定义
export interface MenuItem {
  _id?: string;
  menuCode?: string;
  menuName?: string;
  desc?: string;
  parentMenuCode?: string;
  menuIcon?: string;
  menuUrl?: string;
  sort_num?: number;
  [key: string]: any;
}

// 表单值类型
export interface FormValues {
  isMenuCategory?: boolean;
  submitParentMenuCode?: string[];
  menuName?: string;
  desc?: string;
  sort_num?: number;
  menuCode?: string;
  menuIcon?: string;
  menuUrl?: string;
  parentMenuCode?: string;
}

// JSON 导入数据类型
export interface JsonCategory {
  categoryName: string;
  children: Array<{
    name: string;
    url: string;
  }>;
}
