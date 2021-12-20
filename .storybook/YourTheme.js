import { create } from '@storybook/theming';
import { version } from '../package.json';


export default create({
  base: 'dark',
  brandTitle: `OpenReviewTool v${version}`,
  brandUrl: 'https://github.com/openreviewtool/complib',
});