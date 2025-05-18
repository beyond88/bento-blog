import { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { v4 as uuidv4 } from 'uuid';

export default function Edit({ attributes, setAttributes }) {
    const { videoUrl, blockSize = '1x1', blockId, videoCaption, linkUrl} = attributes;
    const blockProps = useBlockProps();    

    const UNITS = {
        width: {
            single: 180,
            double: 400
        },
        height: {
            single: 180,
            double: 400
        }
    };

    const sizeOptions = [
        { label: '1 × 1', value: '1x1' },
        { label: '2 × 1', value: '2x1' },
        { label: '1 × 2', value: '1x2' },
        { label: '2 × 2', value: '2x2' }
    ];

    const onSelectVideo = (media) => {
        setAttributes({ videoUrl: media.url });
    };

    const onChangeBlockSize = (newSize) => {
        setAttributes({ blockSize: newSize });
        if (typeof window !== "undefined" && window.onSizeChange) {
            window.onSizeChange();
        }
    };

    const onChangeVideoCaption = (newCaption) => {
        setAttributes({ videoCaption: newCaption });
    };

    const onChangeExternalUrl = (newUrl) => {
        setAttributes({ linkUrl: newUrl });
    };

    const getSizeStyles = (size) => {
        let width, height;

        switch (size) {
            case '2x1':
                width = UNITS.width.double;
                height = UNITS.height.single;
                break;
            case '1x2':
                width = UNITS.width.single;
                height = UNITS.height.double;
                break;
            case '2x2':
                width = UNITS.width.double;
                height = UNITS.height.double;
                break;
            default:
                width = UNITS.width.single;
                height = UNITS.height.single;
        }

        return {
            width: `${width}px`,
            height: `${height}px`
        };
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
                <PanelBody title="Block Settings" initialOpen={true}>
                    <div className="size-control mb-4">
                        <SelectControl
                            label="Block Size"
                            value={blockSize}
                            options={sizeOptions}
                            onChange={onChangeBlockSize}
                            className="mb-4"
                        />
                        <div className="components-base-control">
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={onSelectVideo}
                                    allowedTypes={['video']}
                                    value={videoUrl}
                                    render={({ open }) => (
                                        <Button 
                                            onClick={open} 
                                            className="button button-primary"
                                        >
                                            {__('Upload Video', 'bento-blog')}
                                        </Button>
                                    )}
                                />
                            </MediaUploadCheck>
                        </div>
                        <TextControl
                            label={__('Caption', 'bento-blog')}
                            onChange={onChangeVideoCaption}
                            value={videoCaption}
                            placeholder={__('Enter a caption', 'bento-blog')}
                        />
                        <TextControl
                            label={__('External URL', 'bento-blog')}
                            onChange={onChangeExternalUrl}
                            value={linkUrl}
                            placeholder={__('Enter an URL', 'bento-blog')}
                        />
                    </div>
                </PanelBody>
            </InspectorControls>
            <div 
                {...blockProps} 
                style={{
                    ...sizeStyles
                }}
                className={`bento-grid__item ${blockProps.className} bento-grid__item-${attributes.blockId} `}
                data-block={blockId}
            >
                <div className="bento-blog-video">
                    {
                        videoUrl ? (
                            <video  
                                src={videoUrl}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                                controls
                                controlsList="nodownload"
                                preload="metadata"
                                playsInline
                                autoPlay
                                muted
                                loop
                                className="bento-blog-video-player"
                            >
                                <track kind="metadata" label="cuepoints" data-removeondestroy="" />
                                <style>
                                    {`
                                        .bento-blog-video-player::-webkit-media-controls {
                                            opacity: 0;
                                            transition: opacity 0.3s;
                                        }
                                        .bento-blog-video-player:hover::-webkit-media-controls {
                                            opacity: 1;
                                        }
                                    `}
                                </style>
                            </video>
                        ) : null
                    }
                    {
                        linkUrl ? (
                            <>
                                <a href={linkUrl} target="_blank">
                                    <div class="pointer-events-none"></div>
                                    <div class="bento-blog-video-url-container">
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.25403 1.46875C2.83987 1.46875 2.5041 1.80446 2.50403 2.21862C2.50396 2.63289 2.83977 2.96875 3.25403 2.96875H5.94325L1.47358 7.43842C1.18068 7.73131 1.18068 8.20619 1.47358 8.49908C1.76647 8.79197 2.24134 8.79197 2.53424 8.49908L7.00299 4.03033L7.00314 6.71982C7.00316 7.13345 7.34024 7.46875 7.75387 7.46875C8.16752 7.46875 8.50108 7.13342 8.50108 6.71978V2.21875C8.50108 1.80454 8.16529 1.46875 7.75108 1.46875H3.25403Z" fill="white"></path></svg>
                                    </div>
                                </a>
                            </>
                        ) : null 
                    }
                    {videoCaption ? (
                        <div className="bento-blog-video-caption-container">
                            <div className="bento-blog-video-caption-bg-white">
                                <p>{videoCaption}</p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}