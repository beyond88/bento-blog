import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './style.scss';

registerBlockType('bento-blog/text', {
    apiVersion: 2,
    title: 'Bento Blog Text',
    description: 'Add text blocks with bento layouts',
    category: 'bento',
    icon: 'text',
    supports: {
        html: true,
        align: ['wide', 'full'],
    },
    attributes: {
        paragraphContent: { type: 'string', source: 'html', selector: 'p' },
        blockSize: {
            type: 'string',
            default: ''
        },
        textPosition: {
            type: 'string',
            default: '2x0.5'
        },
        lineHeight: {
            type: 'string',
            default: '26px'
        },
        backgroundColor: {
            "type": "string"
        },
        blockId: {
            type: 'string',
        }
    },
    edit: Edit,
    save: Save,
});
