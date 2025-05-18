import { InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { v4 as uuidv4 } from 'uuid';
import './editor.scss';

const Edit = ({ attributes, setAttributes }) => {
    const { title, imageUrl, description, blockId } = attributes;
    const blockProps = useBlockProps();

    useEffect(() => {
        if (!attributes.blockId) {
            setAttributes({ blockId: uuidv4() });
        }
    }, [attributes.blockId]);

    const onSelectImage = (media) => {
        setAttributes({
            imageUrl: media.url,
            imageAlt: media.alt || ''
        });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Block Settings', 'bento-blog')}>
                    <TextControl
                        label={__('Title', 'bento-blog')}
                        value={title}
                        onChange={(newTitle) => setAttributes({ title: newTitle })}
                    />
                    
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImage}
                            allowedTypes={['image']}
                            value={imageUrl}
                            render={({ open }) => (
                                <div>
                                    <Button 
                                        onClick={open}
                                        className="editor-post-featured-image__toggle"
                                    >
                                        {!imageUrl 
                                            ? __('Select Image', 'bento-blog')
                                            : __('Replace Image', 'bento-blog')
                                        }
                                    </Button>
                                    {imageUrl && (
                                        <img 
                                            src={imageUrl} 
                                            alt="Selected" 
                                            style={{ maxWidth: '100%', marginTop: '10px' }} 
                                        />
                                    )}
                                </div>
                            )}
                        />
                    </MediaUploadCheck>
                    
                    <TextareaControl
                        label={__('Description', 'bento-blog')}
                        value={description}
                        onChange={(newDescription) => setAttributes({ description: newDescription })}
                    />
                </PanelBody>
            </InspectorControls>

            <div 
                {...blockProps} 
                className={`bento-grid__item ${blockProps.className} bento-grid__item-${blockId}`} 
                data-block={blockId}
            >
                <div className="">
                    <div className="">
                        <div className="">
                            <div data-avatar="true" className="" style="">
                                <div className="">
                                    {imageUrl && <img src={imageUrl} alt={title || 'Block Image'} />}
                                </div>
                            </div>
                            <div className="">
                                <div className="">
                                    <div className="">{title && <h2>{title}</h2>}</div>
                                </div>
                                <div className="">
                                    <div className="">
                                        {description && <p>{description}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit;