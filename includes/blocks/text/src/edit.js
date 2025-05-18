import { ColorPalette, InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { v4 as uuidv4 } from 'uuid';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
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

    const blockProps = useBlockProps();
    const textRef = useRef();
    const [isOverflow, setIsOverflow] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);

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
        { label: '2 × ½', value: '2x0.5' },
        { label: '1 × 1', value: '1x1' },
        { label: '2 × 1', value: '2x1' },
        { label: '1 × 2', value: '1x2' },
        { label: '2 × 2', value: '2x2' }
    ];

    const alignmentOptions = [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Justify', value: 'justify' }
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

    const interactionStyles = {
        backgroundColor: '#f0f0f0',
        borderRadius: '12px',
    };
    
    // Event handlers for text interaction
    const handleInteractionStart = () => setIsInteracting(true);
    const handleInteractionEnd = () => setIsInteracting(false);

    const onChangeParagraphContent = (newContent) => {
        setAttributes({ paragraphContent: newContent });
    };

    const onChangeTextColor = (newColor) => {
        setAttributes({ textColor: newColor });
    };

    const onChangeBackgroundColor = (newColor) => {
        setAttributes({ backgroundColor: newColor });
    };

    const onChangeFontSize = (newSize) => {
        setAttributes({ fontSize: newSize });
        let fontSizeWithoutPx = parseInt(newSize.replace('px', ''), 10);
        let updatedFontSize = fontSizeWithoutPx + 6; 
        updatedFontSize = updatedFontSize + 'px';
        setAttributes({ lineHeight: updatedFontSize });
    };

    const onChangeBlockSize = (newSize) => {
        setAttributes({ blockSize: newSize });
        if (typeof window !== "undefined" && window.onSizeChange) {
            window.onSizeChange();
        }
    };

    const onChangeTextAlign = (newAlign) => {
        setAttributes({ textAlign: newAlign });
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
            default: // For '2x0.5'
                styles.width = `${UNITS.width.double}px`; 
                styles.height = `${UNITS.height.half}px`;
        }

        return styles;
    };

    useEffect(() => {
        if (textRef.current) {
            // Check for overflow specifically for the 2x0.5 block size
            const blockHeight = blockSize === '2x0.5' ? UNITS.height.half : textRef.current.parentElement.clientHeight;
            setIsOverflow(textRef.current.scrollHeight > blockHeight); // Compare scrollHeight of the text
        }
    }, [paragraphContent, blockSize]);

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
                    <SelectControl
                        label="Block Size"
                        value={blockSize}
                        options={sizeOptions}
                        onChange={onChangeBlockSize}
                    />
                    <SelectControl
                        label="Text Alignment"
                        value={textAlign}
                        options={alignmentOptions}
                        onChange={onChangeTextAlign}
                    />
                    <SelectControl
                        label="Font Size"
                        value={fontSize}
                        options={fontSizeOptions}
                        onChange={onChangeFontSize}
                    />
                    <p>Text Color</p>
                    <ColorPalette
                        value={textColor}
                        onChange={onChangeTextColor}
                    />
                    <p>Background Color</p>
                    <ColorPalette
                        value={backgroundColor}
                        onChange={onChangeBackgroundColor}
                    />
                </PanelBody>
            </InspectorControls>
            <div 
                {...blockProps} 
                style={{
                    ...sizeStyles,
                    backgroundColor: backgroundColor || 'transparent'
                }}
                className={`bento-grid__item  ${blockProps.className} bento-grid__item-${attributes.blockId} `}
                data-block={blockId}
            >
                <div className="bento-blog-text"
                    style={isInteracting ? interactionStyles : {}}
                    onMouseEnter={handleInteractionStart}
                    onMouseLeave={handleInteractionEnd}
                    onFocus={handleInteractionStart}
                    onBlur={handleInteractionEnd}
                >
                    <div className="bento-blog-text-wrapper">
                        <div className="bento-blog-text-excerpt" ref={textRef}>
                            <RichText
                                tagName="p"
                                value={paragraphContent}
                                onChange={onChangeParagraphContent}
                                placeholder={__('Add note...', 'bento-blog')}
                                style={{
                                    textAlign: textAlign,
                                    color: textColor,
                                    fontSize: fontSize,
                                    lineHeight: blockSize === '2x0.5' ? fontSize : lineHeight
                                }}
                            />
                            {/* {isOverflow && <span className="overflow-indicator">...</span>} */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}