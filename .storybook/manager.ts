import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

themes.dark.brandImage = 'daanse_final.svg'

addons.setConfig({
    theme: themes.dark,
});
