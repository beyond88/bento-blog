import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { 
        paragraphContent, 
        textColor, 
        backgroundColor,
        fontSize = '20px', 
        lineHeight = '26px',
        blockSize = '2x0.5',
        textAlign = 'left',
        blockId
    } = attributes;
    
    const blockProps = useBlockProps.save({
        'data-size': blockSize,
    });

    const UNITS = {
        width: {
            half: 70,
            single: 180,
            double: 400
        },
        height: {
            half: 70,
            single: 180,
            double: 400
        }
    };

    const getSizeStyles = (size) => {
        const styles = {};

        switch (size) {
            case '1x1':
                styles.width = `${UNITS.width.single}px`;
                styles.height = `${UNITS.height.single}px`;
                break;
            case '2x1':
                styles.width = `${UNITS.width.double}px`;
                styles.height = `${UNITS.height.single}px`;
                break;
            case '1x2':
                styles.width = `${UNITS.width.single}px`;
                styles.height = `${UNITS.height.double}px`;
                break;
            case '2x2':
                styles.width = `${UNITS.width.double}px`;
                styles.height = `${UNITS.height.double}px`;
                break;
            default:
                styles.width = `${UNITS.width.double}px`;
                styles.height = `${UNITS.height.half}px`;
        }

        return styles;
    };

    const sizeStyles = getSizeStyles(blockSize);

    return (
        <div 
            {...blockProps} 
            style={{
                ...sizeStyles,
                backgroundColor: backgroundColor || 'transparent'
            }}
            className={`bento-grid__item  ${blockProps.className} bento-grid__item-${attributes.blockId} `}
            data-block={blockId}
        >
            <div className="bento-blog-text">
                <div className="bento-blog-text-excerpt">
                    <RichText.Content
                        tagName="p"
                        value={paragraphContent}
                        style={{
                            textAlign: textAlign,
                            color: textColor,
                            fontSize: fontSize,
                            lineHeight: blockSize === '2x0.5' ? fontSize : lineHeight
                        }}
                    />
                </div>
            </div>
        </div>
    );
}