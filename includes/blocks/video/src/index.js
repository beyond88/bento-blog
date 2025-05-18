import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import Save from './save';
import './style.scss';

registerBlockType('bento-blog/video', {
    apiVersion: 2,
    title: 'Bento Blog Video',
    description: 'Add bento video block with customizable layouts',
    category: 'bento',
    icon: 'format-video',
    supports: {
        html: true,
        align: ['wide', 'full'],
    },
    attributes: {
        videoUrl: { type: 'string', default: '' },
        blockSize: { type: 'string', default: '1x1' },
        blockId: {
            type: 'string',
        },
        videoCaption: {
            type: 'string'
        },
        linkUrl: { type: 'string', default: '' }
    },
    edit: Edit,
    save: Save,
});
