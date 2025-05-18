import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import Save from './save';
import './style.scss';

registerBlockType('bento-blog/post', {
    apiVersion: 2,
    title: 'Bento Blog Post',
    description: 'Add bento post block with customizable layouts',
    category: 'bento',
    icon: 'post-status',
    supports: {
        html: true,
        align: ['wide', 'full'],
    },
    attributes: {
        selectedPostId: {
            type: 'number',
            default: 0,
        },
        postUrl: {
            type: 'string',
            default: '',
        },
        title: {
            type: 'string',
            default: '',
        },
        excerpt: {
            type: 'string',
            default: '',
        },
        featuredImageUrl: {
            type: 'string',
            default: '',
        },
        blockSize: {
            type: 'string', 
            default: '1x1'
        },
        backgroundColor: {
            type: "string",
            default: "#ffffff"
        },
        titleColor: {
            type: "string",
            default: "#000000"
        },
        excerptColor: {
            type: "string",
            default: "#666666"
        },
        titleFontSize: {
            type: 'string',
            default: '16px',
        },
        excerptFontSize: {
            type: 'string',
            default: '16px',
        },
        textAlign: {
            type: 'string',
            default: 'left',
        },
        postTitleAlign: {
            type: 'string',
            default: 'left',
        },
        blockId: {
            type: 'string',
        },
        lineHeight: {
            type: 'string',
            default: '22px'
        },   
    },
    edit: Edit,
    save: Save,
});
