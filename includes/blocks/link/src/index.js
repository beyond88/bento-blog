import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './style.scss';

registerBlockType('bento-blog/link', {
    apiVersion: 2,
    title: 'Bento Blog Link',
    description: 'Add link blocks with bento layouts',
    category: 'bento',
    icon: 'external',
    supports: {
        html: true,
        align: ['wide', 'full'],
    },
    attributes: {
        url: {
            "type": "string",
            "source": "attribute",
            "selector": "a",
            "attribute": "href"
        },
        title: {
            "type": "string",
            "source": "text",
            "selector": ".bento-blog-link-title p"
        },
        favicon: {
            "type": "string",
            "source": "attribute",
            "selector": ".bento-blog-link-logo img.favicon",
            "attribute": "src"
        },
        logo: {
            "type": "string",
            "source": "attribute",
            "selector": ".bento-blog-link-featured-image img",
            "attribute": "src"
        },
        host:{},
        blockSize: { type: 'string', default: '1x1' },
        blockId: {
            type: 'string',
        }    
    },
    edit: Edit,
    save: Save,
});
