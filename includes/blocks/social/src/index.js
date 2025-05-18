import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './style.scss';

registerBlockType('bento-blog/social', {
    apiVersion: 2,
    title: 'Bento Blog Social',
    description: 'Add social media profile blocks with customizable layouts',
    category: 'bento',
    icon: 'share',
    supports: {
        html: true,
        align: ['wide', 'full'],
    },
    attributes: {
        platform: {
            type: 'string',
            default: 'twitter',
        },
        platformUrl: {
            type: 'string',
            default: '',
        },
        blockSize: {
            type: 'string', 
            default: '1x1'
        },
        blockId: {
            type: 'string',
        }
    },
    edit: Edit,
    save: Save,
});
