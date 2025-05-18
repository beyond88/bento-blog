import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './style.scss';

registerBlockType('bento-blog/gravatar', {
    apiVersion: 2,
    title: 'Bento Blog Gravatar',
    description: 'Add Gravatar block with customizable layouts',
    category: 'bento',
    icon: 'admin-users',
    supports: {
        html: true,
        align: ['wide', 'full'],
    },
    attributes: {
        username: {
            type: 'string',
            default: ''
        },
        blockId: {
            type: 'string',
            default: ''
        },
        profile: {
            type: 'object',
        }
    },
    edit: Edit,
    save: Save,
});