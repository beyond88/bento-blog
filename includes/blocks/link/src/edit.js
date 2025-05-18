import apiFetch from '@wordpress/api-fetch';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, SelectControl, Spinner, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { v4 as uuidv4 } from 'uuid';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { url, title, favicon, logo, host, blockSize = '1x1', blockId } = attributes;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const blockProps = useBlockProps();

    useEffect(() => {
        if (!attributes.blockId) {
            setAttributes({ blockId: uuidv4() });
        }
        
    }, [attributes.blockId]);

    const getWebsiteInfo = async (inputUrl) => {
        if (!inputUrl) return;
        setIsLoading(true);
        setError('');
        try {
            const encodedUrl = encodeURIComponent(inputUrl);
            const fullPath = `/bento-blog/v1/link-info?url=${encodedUrl}`;
            const response = await apiFetch({ path: fullPath, method: 'GET' });
            if (response.success) {
                const data = response.data;
                setAttributes({
                    url: inputUrl,
                    title: data.title || '',
                    favicon: data.favicon || '',
                    logo: data.logo || '',
                    host: data.domain,
                });
            } else {
                setError(response.message || __('Failed to fetch website information', 'bento-blog'));
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(__('Error fetching website information', 'bento-blog'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetrieveInfo = () => {
        getWebsiteInfo(url);
    };

    const renderContent = () => {

        if (isLoading) {
            return (
                <div className="bento-blog-link-loading">
                    <Spinner />
                    <p>{__('Fetching website information...', 'bento-blog')}</p>
                </div>
            );
        }
        if (!url) {
            return (
                <div className="bento-blog-link-placeholder">
                    <p>{__('Enter a URL to preview website info.', 'bento-blog')}</p>
                </div>
            );
        }
        return (
            <>
                <div className="bento-blog-link-content" style={getContentStyles(blockSize)}>
                    <div className="bento-blog-link-logo">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            {favicon ? (
                                <img src={favicon} alt={__('Favicon for', 'bento-blog') + ` ${title}`} className="favicon" />
                            ) : (
                                <div className="default-icon">🌐</div>
                            )}
                        </a>
                    </div>
                    <a href={url} target="_blank" rel="noopener noreferrer" style={blockSize === '2x0.5' ? { paddingLeft: '10px' } : {}}>
                        <div className="bento-blog-link-title">
                            <p style={blockSize === '2x0.5' ? { margin: '0' } : {}}>{title || __('No title available', 'bento-blog')}</p>
                        </div>
                        <div className="bento-blog-link-host" style={blockSize === '2x0.5' ? { display: 'none' } : {}}>
                            <p>{host}</p>
                        </div>
                    </a>
                </div>
                {logo && (
                    <div className="bento-blog-link-featured-image" style={getImageContainerStyles(blockSize)}>
                        <img src={logo} alt={__('Featured image', 'bento-blog')} />
                    </div>
                )}
            </>
        );
    };

    // Size options and styles
    const UNITS = {
        width: { half: 70, single: 180, double: 400 },
        height: { half: 70, single: 180, double: 400 },
    };

    const sizeOptions = [
        { label: '1 × 1', value: '1x1' },
        { label: '2 × ½', value: '2x0.5' },
        { label: '2 × 1', value: '2x1' },
        { label: '1 × 2', value: '1x2' },
        { label: '2 × 2', value: '2x2' },
    ];

    const onChangeBlockSize = (newSize) => {
        setAttributes({ blockSize: newSize });
        if (typeof window !== "undefined" && window.onSizeChange) {
            window.onSizeChange();
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
                styles.height = `${UNITS.height.double}px`;
                break;
            case '2x2':
                styles.width = `${UNITS.width.double}px`;
                styles.height = `${UNITS.height.double}px`;
                break;
            default:
                styles.width = `${UNITS.width.single}px`;
                styles.height = `${UNITS.height.single}px`;
        }
        
        return styles;
    };

    const sizeStyles = getSizeStyles(blockSize);

    // Styles for wrapper and content
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
                return { flex: 1, minWidth: 0 };
            case '2x0.5':
                return { display: "flex", alignItems: "center" };
            default:
                return {};
        }
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Block Settings', 'bento-blog')}>
                    <SelectControl label="Block Size" value={blockSize} options={sizeOptions} onChange={onChangeBlockSize} />
                    <TextControl label={__('Add link', 'bento-blog')} value={url || ''} onChange={(value) => setAttributes({ url: value })} placeholder={__('Enter link', '')} />
                    <Button isPrimary onClick={handleRetrieveInfo} disabled={!url || isLoading}>
                        {__('Add', '')}
                    </Button>
                    {error && (
                        <p className="components-base-control__error">{error}</p>
                    )}
                </PanelBody>
            </InspectorControls>

            <div {...blockProps} style={{ ...sizeStyles }} className={`bento-grid__item ${blockProps.className} bento-grid__item-${attributes.blockId}`} data-block={blockId}>
                <div className="bento-blog-link">
                    <div className="bento-blog-link-wrapper" style={getWrapperStyles(blockSize)}>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
}