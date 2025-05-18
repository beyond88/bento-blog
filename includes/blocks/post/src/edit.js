import { ColorPalette, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
    PanelBody,
    Placeholder,
    SelectControl,
    Spinner
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { v4 as uuidv4 } from 'uuid';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();
    const { 
        selectedPostId, 
        blockSize = '1x1', 
        featuredImageUrl, 
        backgroundColor, 
        titleColor, 
        excerptColor, 
        titleFontSize, 
        excerptFontSize, 
        textAlign, 
        postTitleAlign, 
        blockId, 
        lineHeight = '22px'
    } = attributes;
    
    const allPosts = useSelect((select) => {
        return select('core').getEntityRecords('postType', 'post', {
            per_page: -1,
            _fields: ['id', 'title'],
            orderby: 'date',
            order: 'desc'
        });
    }, []);

    const selectedPost = useSelect((select) => {
        if (!selectedPostId) return null;
        
        return select('core').getEntityRecord('postType', 'post', selectedPostId);
    }, [selectedPostId]);

    const featuredImage = useSelect((select) => {
        if (!selectedPost?.featured_media) return null;
        
        return select('core').getMedia(selectedPost.featured_media);
    }, [selectedPost?.featured_media]);

    useEffect(() => {
        if (selectedPost) {
            setAttributes({
                selectedPostId: selectedPost.id,
                postUrl: selectedPost.link || '',
                title: selectedPost.title?.rendered || '',
                excerpt: selectedPost.excerpt?.rendered || '',
                featuredImageUrl: featuredImage?.source_url || ''
            });
        }
    }, [selectedPost, featuredImage, setAttributes]);

    const handlePostSelection = (newPostId) => {
        const numericId = parseInt(newPostId);
        setAttributes({
            selectedPostId: numericId || undefined,
            ...(!numericId && {
                postUrl: '',
                title: '',
                excerpt: '',
                featuredImageUrl: ''
            })
        });
    };

    const postOptions = allPosts ? [
        { label: __('Select a post...', 'bento-blog'), value: '' },
        ...allPosts.map(post => ({
            label: post.title.rendered || __('(No title)', 'bento-blog'),
            value: post.id
        }))
    ] : [];

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

    const sizeOptions = [
        { label: '1 × 1', value: '1x1' },
        { label: '2 × ½', value: '2x0.5' },
        { label: '2 × 1', value: '2x1' },
        { label: '1 × 2', value: '1x2' },
        { label: '2 × 2', value: '2x2' }
    ];

    const textAlignOptions = [
        { label: __('Left', 'bento-blog'), value: 'left' },
        { label: __('Center', 'bento-blog'), value: 'center' },
        { label: __('Right', 'bento-blog'), value: 'right' },
    ];

    const fontSizeOptions = [
        { label: __('6px', 'bento-blog'), value: '6px' },
        { label: __('7px', 'bento-blog'), value: '7px' },
        { label: __('8px', 'bento-blog'), value: '8px' },
        { label: __('9px', 'bento-blog'), value: '9px' },
        { label: __('10px', 'bento-blog'), value: '10px' },
        { label: __('11px', 'bento-blog'), value: '11px' },
        { label: __('12px', 'bento-blog'), value: '12px' },
        { label: __('13px', 'bento-blog'), value: '13px' },
        { label: __('14px', 'bento-blog'), value: '14px' },
        { label: __('15px', 'bento-blog'), value: '15px' },
        { label: __('16px', 'bento-blog'), value: '16px' },
        { label: __('17px', 'bento-blog'), value: '17px' },
        { label: __('18px', 'bento-blog'), value: '18px' },
        { label: __('19px', 'bento-blog'), value: '19px' },
        { label: __('20px', 'bento-blog'), value: '20px' },
        { label: __('21px', 'bento-blog'), value: '21px' },
        { label: __('22px', 'bento-blog'), value: '22px' },
        { label: __('23px', 'bento-blog'), value: '23px' },
        { label: __('24px', 'bento-blog'), value: '24px' },
        { label: __('25px', 'bento-blog'), value: '25px' },
        { label: __('26px', 'bento-blog'), value: '26px' },
        { label: __('27px', 'bento-blog'), value: '27px' },
        { label: __('28px', 'bento-blog'), value: '28px' },
        { label: __('29px', 'bento-blog'), value: '29px' },
        { label: __('30px', 'bento-blog'), value: '30px' },
        { label: __('31px', 'bento-blog'), value: '31px' },
        { label: __('32px', 'bento-blog'), value: '32px' },
        { label: __('33px', 'bento-blog'), value: '33px' },
        { label: __('34px', 'bento-blog'), value: '34px' },
        { label: __('35px', 'bento-blog'), value: '35px' },
        { label: __('36px', 'bento-blog'), value: '36px' },
        { label: __('37px', 'bento-blog'), value: '37px' },
        { label: __('38px', 'bento-blog'), value: '38px' },
        { label: __('39px', 'bento-blog'), value: '39px' },
        { label: __('40px', 'bento-blog'), value: '40px' },
        { label: __('41px', 'bento-blog'), value: '41px' },
        { label: __('42px', 'bento-blog'), value: '42px' },
        { label: __('43px', 'bento-blog'), value: '43px' },
        { label: __('44px', 'bento-blog'), value: '44px' },
        { label: __('45px', 'bento-blog'), value: '45px' },
        { label: __('46px', 'bento-blog'), value: '46px' },
        { label: __('47px', 'bento-blog'), value: '47px' },
        { label: __('48px', 'bento-blog'), value: '48px' },
        { label: __('49px', 'bento-blog'), value: '49px' },
        { label: __('50px', 'bento-blog'), value: '50px' },
        { label: __('51px', 'bento-blog'), value: '51px' },
        { label: __('52px', 'bento-blog'), value: '52px' },
        { label: __('53px', 'bento-blog'), value: '53px' },
        { label: __('54px', 'bento-blog'), value: '54px' },
        { label: __('55px', 'bento-blog'), value: '55px' },
        { label: __('56px', 'bento-blog'), value: '56px' },
        { label: __('57px', 'bento-blog'), value: '57px' },
        { label: __('58px', 'bento-blog'), value: '58px' },
        { label: __('59px', 'bento-blog'), value: '59px' },
        { label: __('60px', 'bento-blog'), value: '60px' },
        { label: __('61px', 'bento-blog'), value: '61px' },
        { label: __('62px', 'bento-blog'), value: '62px' },
        { label: __('63px', 'bento-blog'), value: '63px' },
        { label: __('64px', 'bento-blog'), value: '64px' },
        { label: __('65px', 'bento-blog'), value: '65px' },
        { label: __('66px', 'bento-blog'), value: '66px' },
        { label: __('67px', 'bento-blog'), value: '67px' },
        { label: __('68px', 'bento-blog'), value: '68px' },
        { label: __('69px', 'bento-blog'), value: '69px' },
        { label: __('70px', 'bento-blog'), value: '70px' },
        { label: __('71px', 'bento-blog'), value: '71px' },
        { label: __('72px', 'bento-blog'), value: '72px' },
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

    const shouldShowFeaturedImage = (size) => {
        return ['2x1', '1x2', '2x2'].includes(size);
    };

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

    const onChangeFontSize = (newSize) => {
        setAttributes({ excerptFontSize: newSize });
        let fontSizeWithoutPx = parseInt(newSize.replace('px', ''), 10);
        let updatedFontSize = fontSizeWithoutPx + 6; 
        updatedFontSize = updatedFontSize + 'px';
        setAttributes({ lineHeight: updatedFontSize });
    };

    useEffect(() => {
        if (!attributes.blockId) {
            setAttributes({ blockId: uuidv4() });
        }
    }, [attributes.blockId]);

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Post Settings', 'bento-blog')}>
                    <SelectControl
                        label="Block Size"
                        value={blockSize}
                        options={sizeOptions}
                        onChange={onChangeBlockSize}
                    />
                    <SelectControl
                        label={__('Select Post', 'bento-blog')}
                        value={selectedPostId || ''}
                        options={postOptions}
                        onChange={handlePostSelection}
                    />
                </PanelBody>
                <PanelBody title={__('Colors', 'bento-blog')}>
                    <p>{__('Background Color', 'bento-blog')}</p>
                    <ColorPalette
                        value={backgroundColor}
                        onChange={(color) => setAttributes({ backgroundColor: color })}
                    />
                    <p>{__('Title Color', 'bento-blog')}</p>
                    <ColorPalette
                        value={titleColor}
                        onChange={(color) => setAttributes({ titleColor: color })}
                    />
                    <p>{__('Excerpt Color', 'bento-blog')}</p>
                    <ColorPalette
                        value={excerptColor}
                        onChange={(color) => setAttributes({ excerptColor: color })}
                    />
                </PanelBody>
                <PanelBody title={__('Text Settings', 'bento-blog')}>
                    <SelectControl
                        label={__('Title Alignment', 'bento-blog')}
                        value={postTitleAlign}
                        options={textAlignOptions}
                        onChange={(align) => setAttributes({ postTitleAlign: align })}
                    />
                    <SelectControl
                        label={__('Text Alignment', 'bento-blog')}
                        value={textAlign}
                        options={textAlignOptions}
                        onChange={(align) => setAttributes({ textAlign: align })}
                    />
                    <SelectControl
                        label={__('Title Font Size', 'bento-blog')}
                        value={titleFontSize}
                        options={fontSizeOptions}
                        onChange={(size) => setAttributes({ titleFontSize: size })}
                    />
                    <SelectControl
                        label={__('Excerpt Font Size', 'bento-blog')}
                        value={excerptFontSize}
                        options={fontSizeOptions}
                        onChange={onChangeFontSize}
                    />
                </PanelBody>
            </InspectorControls>
            
            <div 
                {...blockProps} 
                style={{ 
                    ...sizeStyles
                }}
                className={`bento-grid__item  ${blockProps.className} bento-grid__item-${attributes.blockId} `} 
                data-block={blockId}
            >
                <div className="bento-blog-post" style={{backgroundColor}}>
                    <div className="bento-blog-post-wrapper" style={getWrapperStyles(blockSize)}>
                        {!selectedPostId ? (
                            <Placeholder>{__('Please select a post from the block settings sidebar.', 'bento-blog')}</Placeholder>
                        ) : !selectedPost ? (
                            <Placeholder><Spinner />{__('Loading post content...', 'bento-blog')}</Placeholder>
                        ) : (
                            <>
                                <div className="bento-blog-post-content" style={getContentStyles(blockSize)}>
                                    <h2 style={{ color: titleColor, fontSize: titleFontSize, textAlign: postTitleAlign, lineHeight: titleFontSize }}>{selectedPost.title.rendered}</h2>
                                    <div 
                                        className="bento-blog-post-excerpt" 
                                        style={{
                                            color: excerptColor,
                                            fontSize: excerptFontSize,
                                            textAlign: textAlign,
                                            lineHeight: lineHeight,
                                            ...(blockSize === '2x0.5' ? { margin: '0', marginLeft: '5px' } : {})
                                        }}
                                    >
                                        <div style={{ color: excerptColor, fontSize: excerptFontSize, textAlign: textAlign }} dangerouslySetInnerHTML={{ __html: selectedPost.excerpt.rendered }} />
                                    </div>
                                    <a href={selectedPost.link} style={{ 
                                    color: excerptColor, fontSize: excerptFontSize, textAlign: textAlign,
                                    lineHeight: lineHeight,
                                    ...(blockSize === '2x0.5' ? { display: 'none' } : {})
                                    }} className="read-more">{__('Read more', 'bento-blog')}</a>
                                </div>
                                {shouldShowFeaturedImage(blockSize) && featuredImageUrl && (
                                    <div className="bento-blog-post-featured-image" style={getImageContainerStyles(blockSize)}>
                                        <img src={featuredImageUrl} alt={__('Featured image', 'bento-blog')} />
                                    </div>
                                )}
                            </>    
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}