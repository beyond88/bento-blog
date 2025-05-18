import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './style.scss';

registerBlockType('bento-blog/container', {
    apiVersion: 2,
    title: 'Bento Blog Container',
    description: 'Add bento container with customizable layouts',
    category: 'bento',
    icon: 'columns',
    supports: {
        html: true,
        align: ['wide', 'full'],
    },
    attributes: {
        imageUrl: { type: 'string', default: '' },
        containerWidth: { type: 'string', default: '1144' },
        blockId: {
            type: 'string'
        },
        itemPositions: {
            type: 'string'
        },
        gridContent: {
            type: 'string'
        },
    },
    edit: Edit,
    save: Save,
});