import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { title, imageUrl, description, blockId } = attributes;
    const blockProps = useBlockProps.save();

    return (
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
    );
}