import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { videoUrl, blockSize = '1x1', blockId, videoCaption, linkUrl} = attributes;
    const blockProps = useBlockProps.save();
    const sizeMapping = {
        '1x1': { width: 180, height: 180 },
        '2x1': { width: 400, height: 180 },
        '1x2': { width: 180, height: 400 },
        '2x2': { width: 400, height: 400 }
    };

    const sizeStyles = sizeMapping[blockSize] || sizeMapping['1x1'];

    return (
        <div 
            {...blockProps} 
            style={{
                width: `${sizeStyles.width}px`,
                height: `${sizeStyles.height}px`,
                margin: '0 auto',
                maxWidth: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
            className={`bento-grid__item ${blockProps.className} bento-grid__item-${attributes.blockId}`}
            data-block={blockId} 
        >
            <div className="bento-blog-video">
                {videoUrl ? (
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
                    </video>
                ) : (
                    null
                )}

                { linkUrl ? (
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
    );
}