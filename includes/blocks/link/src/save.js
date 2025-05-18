import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Save({ attributes }) {
    const { url, title, host, favicon, logo, blockSize, blockId } = attributes;
    const blockProps = useBlockProps.save();

    const getWrapperStyles = (size) => {
        switch (size) {
            case '2x2':
                return { display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' };
            case '2x1':
                return { display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' };
            case '1x2':
                return { display: 'flex', flexDirection: 'column', gap: '1rem' };
            case '2x0.5':
                return { flexDirection: 'row', margin: '0' };
            default:
                return {};
        }
    };

    const getImageContainerStyles = (size) => {
        switch (size) {
            case '2x1':
                return { 
                    flex: '0 0 50%', 
                    maxWidth: '50%',
                    display: 'block'
                };
            case '1x2':
                return { 
                    flex: 'auto', 
                    maxWidth: '100%',
                    display: 'block'
                };
            case '2x2':
                return { 
                    flex: '0 0 50%', 
                    maxWidth: '100%',
                    display: 'block'
                };
            case '1x1':
            case '2x0.5':
                return {
                    display: 'none',
                };
            default:
                return {
                    display: 'none'
                };
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
                return {
                    display: 'flex',
                    alignItems: 'center'
                };
            default:
                return {};
        }
    };

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
            case '2x0.5':
                styles.width = `${UNITS.width.double}px`;
                styles.height = `${UNITS.height.half}px`;
                break;
            case '2x1':
                styles.width = `${UNITS.width.double}px`;
                styles.height = `${UNITS.height.single}px`;
                break;
            case '1x2':
                styles.width = `${UNITS.width.single}px`;
                styles.height = `${UNITS.height.double}px`
                break;
            case '2x2':
                styles.width = `${UNITS.width.double}px`;
                styles.height = `${UNITS.height.double}px`
                break;
            default: // 1x1
                styles.width = `${UNITS.width.single}px`;
                styles.height = `${UNITS.height.single}px`;
        }
        
        return styles;
    };

    const sizeStyles = getSizeStyles(blockSize);

    return (
        <div 
            {...blockProps}
            style={{
                ...sizeStyles,
            }}
            className={`bento-grid__item ${blockProps.className} bento-grid__item-${blockId}`}
            data-block={blockId}
        >
            <div className="bento-blog-link">
                <div className="bento-blog-link-wrapper" style={getWrapperStyles(blockSize)}>
                    <div className="bento-blog-link-content" style={getContentStyles(blockSize)}>
                        <div className="bento-blog-link-logo">
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                {favicon ? (
                                    <img src={favicon} alt={`${__('Favicon for', '')} ${title}`} className="favicon" />
                                ) : (
                                    <div className="default-icon">🌐</div>
                                )}
                            </a>
                        </div>
                        <a href={url} target="_blank" rel="noopener noreferrer" style={blockSize === '2x0.5' ? { paddingLeft: '10px' } : {}}>
                            <div className="bento-blog-link-title">
                                <p style={blockSize === '2x0.5' ? { margin: '0' } : {}}>{title || __('No title available', '')}</p>
                            </div>
                            <div className="bento-blog-link-host" style={blockSize === '2x0.5' ? { display: 'none' } : {}}>
                                <p>{host}</p>
                            </div>
                        </a>
                    </div>
        
                    <div className="bento-blog-link-featured-image" style={getImageContainerStyles(blockSize)}>
                        {logo && (
                            <img src={logo} alt={`${__('Featured image for ', '')}${title}`} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
  
}