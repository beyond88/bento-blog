import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import Save from './save';
import './style.scss';

registerBlockType('bento-blog/image', {
    apiVersion: 2,
    title: 'Bento Blog Image',
    description: 'Add bento image block with customizable layouts',
    category: 'bento',
    icon: 'format-image',
    supports: {
        html: true,
        align: ['wide', 'full'],
    },
    attributes: {
        imageUrl: { type: 'string', default: '' },
        blockSize: { type: 'string', default: '1x1' },
        blockId: {
            type: 'string',
        },
        imageCaption: {
            type: 'string'
        },
        linkUrl: { type: 'string', default: '' }
    },
    edit: Edit,
    save: Save,
});
