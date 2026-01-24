// 树节点类型定义
export interface TreeNode {
  menuCode?: string;
  key?: string;
  children?: TreeNode[];
  submitParentMenuCode?: string[];
  [key: string]: any;
}

/**
 * 递归查找树节点及其所有子节点的 menuCode
 * @param nodes 树节点数组
 * @returns menuCode 数组
 */
export function findArrayChildrenData(nodes: TreeNode[]): string[] {
  const codes: string[] = [];
  
  const traverse = (nodeList: TreeNode[]) => {
    nodeList.forEach((node) => {
      if (node.menuCode) {
        codes.push(node.menuCode);
      }
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  
  traverse(nodes);
  return codes;
}
