import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const blockProps = useBlockProps.save();
    const itemPositions = JSON.parse(attributes.itemPositions || '[]');
    const gridContent = JSON.parse(attributes.gridContent || '{}');
    const containerWidth = attributes.containerWidth || 0;
    return (
        <div {...blockProps}>
            <style>
                {`.bento-grid__item {
                    position: absolute;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    will-change: transform;
                }
                ${itemPositions.map(({ clientId, transform }) => 
                `.bento-grid__item-${clientId} {
                    transform: ${transform};
                }`).join('\n')}`}
            </style>
            <div className="bento-grid" style={{ width: `${containerWidth}px` }}>
                <div 
                    className="bento-grid__content" 
                    style={{ 
                        position: 'relative',
                        height: typeof gridContent.height === 'number' ? `${gridContent.height}px` : gridContent.height || 'auto'
                    }}
                >
                    <InnerBlocks.Content />
                </div>
            </div>
        </div>
    );
}