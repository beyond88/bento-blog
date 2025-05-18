import { useBlockProps } from '@wordpress/block-editor';
import 'leaflet/dist/leaflet.css';

export default function Save({ attributes }) {
    const { lat, lon, blockSize = '1x1', blockId } = attributes;
    const blockProps = useBlockProps.save();
    if (!lat || !lon) {
        return <div {...blockProps}>No location set.</div>;
    }

    // Helper function to get size styles based on block size
    const getSizeStyles = (size) => {
        const styles = {};

        switch (size) {
            case '2x0.5':
                styles.width = '400px';
                styles.height = '70px';
                break;
            case '2x1':
                styles.width = '400px';
                styles.height = '180px';
                break;
            case '1x2':
                styles.width = '180px';
                styles.height = '400px';
                break;
            case '2x2':
                styles.width = '400px';
                styles.height = '400px';
                break;
            default:
                styles.width = '180px';
                styles.height = '180px';
        }
        
        return styles;
    };

    const sizeStyles = getSizeStyles(blockSize);

    return (
        <div {...blockProps} 
        style={{ 
            ...sizeStyles
        }} 
            className={`bento-grid__item  ${blockProps.className} bento-grid__item-${attributes.blockId}`
        }
        data-block={blockId}
        >
            <div className="bento-blog-map">
                <div className="bento-blog-map-wrapper">
                    <div className="leaflet-map" id={`bento-grid__item-${attributes.blockId}`} style={{ ...sizeStyles, margin: '0 auto', transition: 'all 0.3s ease', maxWidth: '100%' }}></div>
                </div>
            </div>
            <script>
                {`
                    document.addEventListener('DOMContentLoaded', function() {
                        const lat = ${lat};
                        const lon = ${lon};
                        const map = L.map('bento-grid__item-${attributes.blockId}', { zoomControl: false }).setView([lat, lon], 13);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 10,
                        }).addTo(map);
                        L.marker([lat, lon]).addTo(map)
                            .bindPopup('Location')
                            .openPopup();
                    });
                `}
            </script>
        </div>
    );
}