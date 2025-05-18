import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './style.scss';

registerBlockType('bento-blog/header', {
    apiVersion: 2,
    title: 'Bento Blog Header',
    description: 'Add header block with bento layouts',
    category: 'bento',
    icon: "heading",
    supports: {
        html: true,
        align: ['wide', 'full'],
    },
    attributes: {
        blockId: { type: 'string' },
        title: { type: 'string', default: ''},
        imageUrl: { type: 'string', default: '' },
        description: { type: 'string' }  
    }, 
    edit: Edit,
    save: Save,
});
