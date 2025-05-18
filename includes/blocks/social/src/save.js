import { useBlockProps } from '@wordpress/block-editor';
import { PLATFORM_DOMAINS, PLATFORMS, PLATFORMS_LOGO } from './platforms';

export default function Save({ attributes }) {
    const { platform, platformUrl, profileName, blockSize = '1x1', blockId } = attributes; // Include blockSize in attributes
    const blockProps = useBlockProps.save();

    const platformColor = PLATFORMS[platform] || PLATFORMS.twitter;
    const platformLogo = PLATFORMS_LOGO[platform] || PLATFORMS_LOGO.twitter;
    const platformDomain = PLATFORM_DOMAINS[platform] || PLATFORM_DOMAINS.twitter;

    // Define dimensions based on block size
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

    // Helper function to get size styles based on block size
    const getSizeStyles = (size) => {
        const styles = {
            display: 'flex', // Default display for alignment
            alignItems: 'flex-start', // Default top alignment
            justifyContent: 'flex-start' // Default left alignment
        };

        switch (size) {
            case '2x0.5':
                styles.width = `${UNITS.width.double}`;  // 400px
                styles.height = `${UNITS.height.half}`;  // 70px
                styles.flexDirection = 'row'; // Horizontal alignment
                break;
            case '2x1':
                styles.width = `${UNITS.width.double}`;  // 400px
                styles.height = `${UNITS.height.single}`; // 180px
                break;
            case '1x2':
                styles.width = `${UNITS.width.single}`;  // 180px
                styles.height = `${UNITS.height.double}`; // 400px
                styles.flexDirection = 'column'; // Vertical alignment
                break;
            case '2x2':
                styles.width = `${UNITS.width.double}`;  // 400px
                styles.height = `${UNITS.height.double}`; // 400px
                break;
            default: // 1x1
                styles.width = `${UNITS.width.single}`;  // 180px
                styles.height = `${UNITS.height.single}`; // 180px
        }
        
        return styles;
    };

    const sizeStyles = getSizeStyles(blockSize);

    return (
        <div 
            {...blockProps} 
            style={{
                ...sizeStyles,
                backgroundColor: platformColor,
                margin: '0 auto',
                transition: 'all 0.3s ease',
                maxWidth: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
            className={`bento-grid__item  ${blockProps.className} bento-grid__item-${attributes.blockId} `}
            data-block={blockId}
        >
            <div className={`bento-blog-${platform} ${blockSize === '2x0.5' ? 'two-by-half' : ''}`}>
                {/* <div className="bento-blog-social-wrapper"> */}
                    <a href={platformUrl} target='_blank' rel='noopener' className="bento-blog-social-wrapper">
                        <div className="bento-blog-social-logo" dangerouslySetInnerHTML={{ __html: platformLogo }} />
                        <div className="bento-blog-social-title">
                            <p>{profileName || platform.charAt(0).toUpperCase() + platform.slice(1)}</p>
                        </div>
                        <div className="bento-blog-social-host">
                            <p>{platformDomain}</p>
                        </div>
                    </a>
                {/* </div> */}
            </div>
        </div>
    );
}