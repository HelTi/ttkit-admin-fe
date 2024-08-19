import request from "@/utils/request";

// 查询菜单类目
export async function queryMenuCategory() {
  return request(`/menus`)
}

export async function queryCategoryMenus(parentMenuCodes=[]) {
  return request(`/menus/categorymenus`, {
    method: "POST",
    data: {
      parentMenuCodes
    },
  });
}

// 新增菜单
export async function queryCreateMenu(params = {}) {
  return request(`/menus`, {
    method: "POST",
    data:{
      ...params
    }
  });
}

// 更新菜单
export async function queryUpdateMenu(menuCode, otherInfo={}) {
  return request({
    method: 'PUT',
    url: `/menus/${menuCode}`,
    data: otherInfo,
  })
}

// 删除菜单
export async function queryDeleteMenu(menuCodes=[]) {
  return request({
    method: 'POST',
    url: `/menus/delete`,
    data:{
      menuCodes
    }
  })
}

/**
 * 根据网址获取网站icon 和描述
 * @param {*} webUrl 
 * @returns 
 */
export async function fetchWebsiteFaviconInfo (webUrl) {
  return request('/menus/favicon', {
    method: 'GET',
    params: { webUrl },
  })
}


