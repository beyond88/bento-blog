import {
    InspectorControls,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    TextControl,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';
import './editor.scss';
import { PLATFORM_DOMAINS, PLATFORMS, PLATFORMS_LOGO } from './platforms';

export default function Edit({ attributes, setAttributes }) {
    const { platform, platformUrl, profileName, blockSize = '1x1', blockId } = attributes;
    const blockProps = useBlockProps();

    const platformColor = PLATFORMS[platform] || PLATFORMS.twitter;
    const platformLogo = PLATFORMS_LOGO[platform] || PLATFORMS_LOGO.twitter;
    const platformDomain = PLATFORM_DOMAINS[platform] || PLATFORM_DOMAINS.twitter;

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

    // Block size options
    const sizeOptions = [
        { label: '1 × 1', value: '1x1' },
        { label: '2 × ½', value: '2x0.5' },
        { label: '2 × 1', value: '2x1' },
        { label: '1 × 2', value: '1x2' },
        { label: '2 × 2', value: '2x2' }
    ];

    const onChangeBlockSize = (newSize) => {
        setAttributes({ blockSize: newSize });
        if (typeof window !== "undefined" && window.onSizeChange) {
            window.onSizeChange();
        }
    };

    // Helper function to get size styles based on block size
    const getSizeStyles = (size) => {
        const styles = {
            display: 'flex',
            alignItems: 'flex-start', // Default to top alignment
            justifyContent: 'flex-start' // Default to left alignment
        };

        switch (size) {
            case '2x0.5':
                styles.width = `${UNITS.width.double}px`;
                styles.height = `${UNITS.height.half}px`;
                styles.flexDirection = 'row'; // Horizontal alignment
                break;
            case '2x1':
                styles.width = `${UNITS.width.double}px`;
                styles.height = `${UNITS.height.single}px`;
                break;
            case '1x2':
                styles.width = `${UNITS.width.single}px`;
                styles.height = `${UNITS.height.double}px`;
                styles.flexDirection = 'column'; // Vertical alignment
                break;
            case '2x2':
                styles.width = `${UNITS.width.double}px`;
                styles.height = `${UNITS.height.double}px`;
                break;
            default: // 1x1
                styles.width = `${UNITS.width.single}px`;
                styles.height = `${UNITS.height.single}px`;
        }

        return styles;
    };

    const sizeStyles = getSizeStyles(blockSize);

    useEffect(() => {
        if (!attributes.blockId) {
            setAttributes({ blockId: uuidv4() });
        }
    }, [attributes.blockId]);

    return (
        <>
            <InspectorControls>
                <PanelBody title="Block Settings">
                    <div className="size-control mb-4">
                        <SelectControl
                            label="Block Size"
                            value={blockSize}
                            options={sizeOptions}
                            onChange={onChangeBlockSize}
                            className="mb-4"
                        />
                    </div>
                    <div className="size-control mb-4">
                        <SelectControl
                            label="Social Platform"
                            value={platform}
                            options={Object.keys(PLATFORMS).map((key) => ({
                                label: key.charAt(0).toUpperCase() + key.slice(1),
                                value: key,
                            }))}
                            onChange={(value) => setAttributes({ platform: value })}
                        />
                    </div>
                    <div className="size-control mb-4">
                        <TextControl
                            label={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                            value={platformUrl}
                            onChange={(value) => setAttributes({ platformUrl: value })}
                            placeholder={`Enter your ${platform} profile URL`}
                        />
                    </div>
                </PanelBody>
            </InspectorControls>

            <div 
                {...blockProps}
                style={{
                    ...sizeStyles,
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
                        <a href="#" target='_blank' rel='noopener' className="bento-blog-social-wrapper" onClick={(e) => e.preventDefault()}>
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
        </>
    );
}