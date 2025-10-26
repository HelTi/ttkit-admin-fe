import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  npmClient: 'npm',
  plugins: ['@umijs/plugins/dist/antd', '@umijs/plugins/dist/access'],
  antd: {},
  access: {},
  alias: {
    '@': 'src',
  },
  routes,
});
