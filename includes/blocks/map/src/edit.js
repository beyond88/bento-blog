import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Button, PanelBody, SelectControl, Spinner, TextControl } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { v4 as uuidv4 } from 'uuid';

export default function Edit({ attributes, setAttributes }) {
    const { address, lat, lon, blockSize = '1x1', blockId } = attributes;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchComplete, setSearchComplete] = useState(false);
    const mapRef = useRef(null);
    const blockProps = useBlockProps();
    const [mapId] = `bento-grid__item-${blockId}`;

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
        if(address){
            handleSearchClick();
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
    const handleAddressChange = (newAddress) => setAttributes({ address: newAddress });
    const handleSearchClick = () => {
        if (address) {
            setLoading(true);
            setError('');
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const { lat: newLat, lon: newLon } = data[0];
                        setAttributes({ lat: parseFloat(newLat), lon: parseFloat(newLon) });
                        localStorage.setItem('savedMapLocation', JSON.stringify({ lat: parseFloat(newLat), lon: parseFloat(newLon), address }));
                        setSearchComplete(true);
                    } else {
                        setError(__('Location not found', 'bento-blog'));
                    }
                })
                .catch(() => setError(__('Error fetching location', 'bento-blog')))
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        const savedLocation = JSON.parse(localStorage.getItem('savedMapLocation'));
        if (savedLocation && !lat && !lon) {
            setAttributes({ lat: savedLocation.lat, lon: savedLocation.lon, address: savedLocation.address });
        }

        if (mapRef.current) {
            mapRef.current.off();
            mapRef.current.remove();
            mapRef.current = null;
        }

        if (lat && lon) {
            mapRef.current = L.map(`bento-grid__item-${blockId}`, {
                scrollWheelZoom: false,
                zoomControl: false,
            }).setView([lat, lon], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 10,
            }).addTo(mapRef.current);

            L.marker([lat, lon]).addTo(mapRef.current)
                .bindPopup('Location')
                .openPopup();
        }
    }, [lat, lon, `bento-grid__item-${blockId}`]);

    useEffect(() => {
        if (!attributes.blockId) {
            setAttributes({ blockId: uuidv4() });
        }
    }, [attributes.blockId]);

    useEffect(() => {
        if (searchComplete) {
            if (mapRef.current) {
                mapRef.current.invalidateSize();
                mapRef.current.setView([lat, lon], 13);
            }
            setSearchComplete(false);
        }
    }, [searchComplete, lat, lon]);

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Map Settings', 'bento-blog')}>
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
                        <TextControl
                            label={__('Address', 'bento-blog')}
                            value={address}
                            onChange={handleAddressChange}
                            placeholder={__('Enter an address...', 'bento-blog')}
                        />
                        <Button
                            isPrimary
                            onClick={handleSearchClick}
                            className="mt-2"
                        >
                            {__('Search', 'bento-blog')}
                        </Button>
                        {loading && <Spinner />}
                        {error && <p className="error">{error}</p>}
                    </div>
                </PanelBody>
            </InspectorControls>
            <div 
                {...blockProps} 
                style={{
                    ...sizeStyles
                }}
                className={`bento-grid__item  ${blockProps.className} bento-grid__item-${attributes.blockId}`}
                data-block={blockId}
            >
                <div className="bento-blog-map">
                    <div className="bento-blog-map-wrapper">
                        <div className="leaflet-map hossain" id={`bento-grid__item-${attributes.blockId}`} style={{ ...sizeStyles, borderRadius: '24px' }}></div>
                    </div>
                </div>
            </div>
        </>
    );
}
