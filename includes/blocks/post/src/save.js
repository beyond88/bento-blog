import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Save({ attributes }) {
    const { 
        selectedPostId, 
        title, 
        excerpt, 
        blockSize = '1x1',
        featuredImageUrl,
        backgroundColor,
        titleColor,
        excerptColor,
        titleFontSize,
        excerptFontSize,
        textAlign,
        postTitleAlign,
        postUrl,
        blockId,
        lineHeight = '22px'
    } = attributes;

    const blockProps = useBlockProps.save();

    const UNITS = {
        width: {
            half: '70px',
            single: '180px',
            double: '400px'
        },
        height: {
            half: '70px',
            single: '180px',
            double: '400px'
        }
    };

    const getSizeStyles = (size) => {
        const styles = {};
        switch (size) {
            case '2x0.5':
                styles.width = UNITS.width.double;
                styles.height = UNITS.height.half;
                break;
            case '2x1':
                styles.width = UNITS.width.double;
                styles.height = UNITS.height.single;
                break;
            case '1x2':
                styles.width = UNITS.width.single;
                styles.height = UNITS.height.double;
                break;
            case '2x2':
                styles.width = UNITS.width.double;
                styles.height = UNITS.height.double;
                break;
            default:
                styles.width = UNITS.width.single;
                styles.height = UNITS.height.single;
        }
        return styles;
    };

    const sizeStyles = getSizeStyles(blockSize);

    const getWrapperStyles = (size) => {
        switch (size) {
            case '2x1':
            case '2x2':
                return { display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'flex-start' };
            case '1x2':
                return { display: 'flex', flexDirection: 'column', gap: '1rem' };
            default:
                return {};
        }
    };

    const getImageContainerStyles = (size) => {
        switch (size) {
            case '2x1':
                return { flex: '0 0 50%', maxWidth: '50%' };
            case '1x2':
                return { flex: '0 0 0%', maxWidth: '100%' };
            case '2x2':
                return { flex: '0 0 50%', maxWidth: '50%' };
            default:
                return {};
        }
    };

    const getContentStyles = (size) => {
        switch (size) {
            case '2x1':
            case '2x2':
                return {
                    flex: '1',
                    minWidth: 0
                };
            case '2x0.5':
                return { display: 'flex', alignItems: 'self-start' };
            default:
                return {};
        }
    };

    const shouldShowFeaturedImage = (size) => {
        return ['2x1', '1x2', '2x2'].includes(size);
    };

    return (
        <div 
            {...blockProps} 
            style={{ 
                ...sizeStyles
            }} 
            className={`bento-grid__item  ${blockProps.className} bento-grid__item-${blockId}`}
        >
            {selectedPostId && (
                <div className="bento-blog-post" style={{backgroundColor}}>
                    <div className="bento-blog-post-wrapper" style={getWrapperStyles(blockSize)}>
                        <div className="bento-blog-post-content" style={getContentStyles(blockSize)}>
                            <h2 style={{ color: titleColor, fontSize: titleFontSize, textAlign: postTitleAlign, lineHeight: titleFontSize }}>{title}</h2>
                            <div 
                                className="bento-blog-post-excerpt" 
                                style={{
                                    color: excerptColor,
                                    fontSize: excerptFontSize,
                                    lineHeight: lineHeight,
                                    textAlign: textAlign,
                                    ...(blockSize === '2x0.5' ? { margin: '0', marginLeft: '5px' } : {})
                                }}
                            >
                                <div style={{ color: excerptColor, fontSize: excerptFontSize, lineHeight: lineHeight, textAlign: textAlign }} dangerouslySetInnerHTML={{ __html: excerpt }} />
                            </div>
                            
                            <a href={postUrl} className="bento-blog-read-more" 
                            style={{ 
                                color: excerptColor, fontSize: excerptFontSize, textAlign: textAlign,
                                lineHeight: excerptFontSize,
                                ...(blockSize === '2x0.5' ? { display: 'none' } : {})
                                }}>{__('Read more', 'bento-blog')}</a>
                        </div>
                        {shouldShowFeaturedImage(blockSize) && featuredImageUrl && (
                            <div className="bento-blog-post-featured-image" style={getImageContainerStyles(blockSize)}>
                                <img src={featuredImageUrl} alt={__('Featured image', 'bento-blog')} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}