import { message } from 'antd';
import { queryCreateMenu, fetchWebsiteFaviconInfo } from '@/services/menu';
import ApiUrl from '@/config/api-url';
import type { JsonCategory } from '../types';

const sleep = (ms: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const importJsonData = async (parsed: unknown): Promise<void> => {
  const data = parsed as JsonCategory[];
  if (!Array.isArray(data)) {
    message.error('JSON 格式错误，需要数组格式');
    return;
  }

  for (const category of data) {
    try {
      // 创建类目
      const cgParams = {
        menuName: category.categoryName,
        isMenuCategory: true,
      };
      const { data: dataRes } = await queryCreateMenu(cgParams);
      const { menuCode } = dataRes;

      // 创建类目下的菜单项
      for (const c of category.children) {
        // 等待 500 毫秒，避免请求过快
        await sleep(500);
        try {
          // 获取网站信息
          const res = await fetchWebsiteFaviconInfo(c.url);
          const { data } = res;

          const { faviconUrl, description } = data;
          let iconUrl = '';
          if (faviconUrl) {
            iconUrl = ApiUrl.ManApiUrl + '/' + faviconUrl;
          }

          // 创建菜单项
          const params = {
            isMenuCategory: false,
            parentMenuCode: menuCode,
            menuName: c.name,
            menuUrl: c.url,
            menuIcon: iconUrl || '',
            desc: description || '',
            submitParentMenuCode: [menuCode],
          };

          await queryCreateMenu(params);
        } catch (err) {
          console.error('创建菜单项失败:', err);
        }
      }
    } catch (err) {
      console.error('创建类目失败:', err);
    }
  }

  message.success('导入完成！');
};
