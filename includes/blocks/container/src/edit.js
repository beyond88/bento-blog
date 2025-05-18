import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const ALLOWED_BLOCKS = ['bento-blog/image', 'bento-blog/video', 'bento-blog/link', 'bento-blog/map', 'bento-blog/post', 'bento-blog/social', 'bento-blog/text', 'bento-blog/gravatar', 'bento-blog/header'];

    const BLOCK_SIZES = {
        SINGLE: 180,
        DOUBLE: 400,
        HALF: 70
    };

    const GAP_SIZE = 40;
    const ROW_GAP_SIZE = 40;

    const handleSizeChange = () => {
        if (!containerRef.current) return;

        const mainContainer = containerRef.current.closest('.wp-block-bento-blog-container');
        const mainContainerWidth = mainContainer ? mainContainer.offsetWidth : 0;
        setContainerWidth(mainContainerWidth);

        const children = containerRef.current.querySelectorAll('.bento-grid__item');
        if (!children?.length) return;

        if (!isInitialized) {
            children.forEach(child => {
                child.style.position = 'absolute';
                child.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                child.style.willChange = 'transform';
            });
            setIsInitialized(true);
        }

        const maxColumns = Math.floor((mainContainerWidth + GAP_SIZE) / (BLOCK_SIZES.SINGLE + GAP_SIZE));
        const COLUMN_COUNT = Math.min(4, maxColumns);

        let gridMatrix = Array(200).fill().map(() => Array(COLUMN_COUNT).fill(false));
        const positions = [];

        const isSpaceAvailable = (row, col, width, heightUnits) => {
            if (col + width > COLUMN_COUNT) return false;
            
            for (let i = row; i < row + heightUnits; i++) {
                for (let j = col; j < col + width; j++) {
                    if (gridMatrix[i][j]) return false;
                }
            }
            return true;
        };

        const occupySpace = (row, col, width, heightUnits) => {
            for (let i = row; i < row + heightUnits; i++) {
                for (let j = col; j < col + width; j++) {
                    gridMatrix[i][j] = true;
                }
            }
        };

        children.forEach((child) => {
            const style = window.getComputedStyle(child);
            const width = parseFloat(style.width);
            const height = parseFloat(style.height);

            const isDoubleWidth = Math.abs(width - BLOCK_SIZES.DOUBLE) < 1;
            const blockWidth = isDoubleWidth ? 2 : 1;
            const heightUnits = Math.max(1, Math.round((height / (BLOCK_SIZES.SINGLE + ROW_GAP_SIZE)) * 2));
            
            let placed = false;
            let row = 0;

            while (!placed && row < gridMatrix.length) {
                for (let col = 0; col <= COLUMN_COUNT - blockWidth; col++) {
                    if (isSpaceAvailable(row, col, blockWidth, heightUnits)) {
                        const x = (col * BLOCK_SIZES.SINGLE) + (col * GAP_SIZE);
                        const y = (row / 2) * (BLOCK_SIZES.SINGLE + ROW_GAP_SIZE);

                        child.style.transform = `translate(${x}px, ${y}px)`;

                        positions.push({
                            clientId: child.getAttribute('data-block'),
                            transform: `translate(${x}px, ${y}px)`,
                            width: blockWidth,
                            height: heightUnits
                        });

                        occupySpace(row, col, blockWidth, heightUnits);
                        placed = true;
                        break;
                    }
                }
                row++;
            }
        });

        const maxRow = gridMatrix.findLastIndex(row => row.some(cell => cell));
        const maxHeight = Math.ceil(maxRow / 2) * (BLOCK_SIZES.SINGLE + ROW_GAP_SIZE);
        const totalHeight = maxHeight + ROW_GAP_SIZE + 100;

        containerRef.current.style.height = `${totalHeight}px`;

        setAttributes({ 
            itemPositions: JSON.stringify(positions), 
            gridContent: JSON.stringify({
                height: totalHeight,
                columnCount: COLUMN_COUNT,
                gapSize: GAP_SIZE,
                rowGapSize: ROW_GAP_SIZE,
                blockSizes: BLOCK_SIZES
            }),
            containerWidth: mainContainerWidth 
        });
    };

    useEffect(() => {
        const debouncedResize = () => {
            requestAnimationFrame(handleSizeChange);
        };

        handleSizeChange();

        const resizeObserver = new ResizeObserver(debouncedResize);
        const mutationObserver = new MutationObserver(debouncedResize);

        const mainContainer = containerRef.current?.closest('.wp-block-bento-blog-container');
        if (mainContainer) {
            resizeObserver.observe(mainContainer);
        }

        if (containerRef.current) {
            mutationObserver.observe(containerRef.current, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style']
            });
        }

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, []);
    
    return (
        <div {...blockProps}>
            <div className="bento-grid" style={{ width: `${containerWidth}px` }}>
                <div 
                    className="bento-grid__content" 
                    ref={containerRef}
                    style={{ position: 'relative' }}
                >
                    <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} />
                </div>
            </div>
        </div>
    );
}