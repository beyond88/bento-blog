import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './style.scss';

registerBlockType('bento-blog/map', {
    apiVersion: 2,
    title: 'Bento Blog Map',
    description: 'Add map blocks with bento layouts',
    category: 'bento',
    icon: 'location',
    supports: {
        html: true,
        align: ['wide', 'full'],
    },
    attributes: {
        address: {
            type: 'string',
            default: '',
        },
        lat: {
            type: 'number',
            default: null,
        },
        lon: {
            type: 'number',
            default: null,
        },
        blockSize:{
            type: 'string',
            default: '1x1',
        },
        blockId: {
            type: 'string',
        }    
    },
    edit: Edit,
    save: Save,
});
