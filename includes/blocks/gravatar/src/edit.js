import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Spinner, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { v4 as uuidv4 } from 'uuid';

export default function Edit({ attributes, setAttributes }) {
    const { username, blockId } = attributes;
    const blockProps = useBlockProps();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        if (!attributes.blockId) {
            setAttributes({ blockId: uuidv4() });
        }
    }, [attributes.blockId]);

    useEffect(() => {
        const fetchGravatarProfile = async () => {
            if (!username) return;

            setLoading(true);
            setError('');

            try {
                let cleanUsername = username.toLowerCase().trim();
                const response = await fetch(`https://api.gravatar.com/v3/profiles/${cleanUsername}`);
                if (!response.ok) {
                    throw new Error('Profile not found');
                }
                const data = await response.json();
                setProfile(data);
                setAttributes({ profile: data });
            } catch (err) {
                setError(err.message);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        fetchGravatarProfile();
    }, [username, setAttributes]);

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        const drawer = document.querySelector('.gravatar-hovercard__drawer[data-drawer-name="contact"]');
        if (drawer) {
            drawer.classList.add('gravatar-hovercard__drawer--closing');
            setIsDrawerOpen(false);
            drawer.classList.remove("gravatar-hovercard__drawer--open");
            setTimeout(() => {
                drawer.classList.remove('gravatar-hovercard__drawer--closing');
            }, 300);
        }
    };

    return (
        <>
            <div
                {...blockProps}
                style={{
                    width: '400px',
                    height: '400px'
                }}
                className={`bento-grid__item ${blockProps.className} bento-grid__item-${attributes.blockId} `}
                data-block={blockId}
            >
                <InspectorControls>
                    <PanelBody title={__('Gravatar Settings', 'bento-blog')}>
                        <TextControl
                            label={__('Gravatar Username/Email', 'bento-blog')}
                            value={username || ''}
                            onChange={(value) => setAttributes({ username: value })}
                            help={__('Enter your Gravatar username or email', 'bento-blog')}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="profile-card">
                    {loading && <Spinner />}
                    {error && <p className="error-message">{error}</p>}
                    {profile && (
                        <div className="gravatar-hovercard">
                            <div className="gravatar-hovercard__inner">
                                <div className="gravatar-hovercard__header-image"
                                    style={{
                                        background: profile.header_image
                                            ? profile.header_image
                                            : profile.background_color
                                    }}
                                />
                                <div className="gravatar-hovercard__header">
                                    <a className="gravatar-hovercard__avatar-link"
                                       href={profile.profile_url} target="_blank"
                                       rel="noopener noreferrer">
                                        <img
                                            className="gravatar-hovercard__avatar"
                                            src={profile.avatar_url}
                                            width="104"
                                            height="104"
                                            alt={profile.avatar_alt_text || profile.display_name}
                                        />
                                    </a>
                                    <a className="gravatar-hovercard__personal-info-link"
                                       href={profile.profile_url} target="_blank"
                                       rel="noopener noreferrer">
                                        <h4 className="gravatar-hovercard__name">{profile.display_name}</h4>
                                        {profile.location && (
                                            <p className="gravatar-hovercard__location">{profile.location}</p>
                                        )}
                                        {profile.job_title && (
                                            <p className="gravatar-hovercard__job">{profile.job_title}</p>
                                        )}
                                    </a>
                                </div>
                                {profile.description && (
                                    <div className="gravatar-hovercard__body">
                                        <p className="gravatar-hovercard__description">{profile.description}</p>
                                    </div>
                                )}
                                {profile.verified_accounts && profile.verified_accounts.length > 0 && (
                                    <div className="gravatar-hovercard__social-links">
                                        {profile.verified_accounts.map((account) => (
                                            <a
                                                key={account.url}
                                                className="gravatar-hovercard__social-link"
                                                href={account.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                data-service-name={account.service_type}
                                            >
                                                <img
                                                    className="gravatar-hovercard__social-icon"
                                                    src={account.service_icon}
                                                    width="32"
                                                    height="32"
                                                    alt={account.service_label}
                                                />
                                            </a>
                                        ))}
                                    </div>
                                )}
                                <div className="gravatar-hovercard__buttons">
                                    <button 
                                        className="gravatar-hovercard__button"
                                        data-target-drawer="contact"
                                        onClick={handleDrawerOpen}
                                    >
                                        { __('Contact', 'bento-layout') }
                                    </button>
                                </div>
                                {profile.contact_info && (
                                    <div className={`gravatar-hovercard__drawer ${isDrawerOpen ? 'gravatar-hovercard__drawer--open' : ''}`} data-drawer-name="contact">
                                        <div className="gravatar-hovercard__drawer-backdrop"
                                             data-target-drawer="contact"></div>
                                        <div className="gravatar-hovercard__drawer-card">
                                            <div className="gravatar-hovercard__drawer-header">
                                                <h2 className="gravatar-hovercard__drawer-title">Contact</h2>
                                                <button 
                                                    className="gravatar-hovercard__drawer-close"
                                                    data-target-drawer="contact"
                                                    onClick={handleDrawerClose}
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2"
                                                            strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2"
                                                            strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                            <ul className="gravatar-hovercard__drawer-items">
                                                {profile.contact_info.email && (
                                                    <li className="gravatar-hovercard__drawer-item">
                                                        <img className="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://secure.gravatar.com/icons/mail.svg" alt="" />
                                                        <div className="gravatar-hovercard__drawer-item-info">
                                                            <span className="gravatar-hovercard__drawer-item-label">email</span>
                                                            <span className="gravatar-hovercard__drawer-item-text">
                                                                <a className="gravatar-hovercard__drawer-item-link" href={`mailto:${profile.contact_info.email}`} target="_blank" rel="noopener noreferrer">{profile.contact_info.email}</a>
                                                            </span>
                                                        </div>
                                                    </li>
                                                )}
                                        
                                                {profile.contact_info.home_phone && (
                                                    <li className="gravatar-hovercard__drawer-item">
                                                        <img className="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://secure.gravatar.com/icons/home-phone.svg" alt="" />
                                                        <div className="gravatar-hovercard__drawer-item-info">
                                                            <span className="gravatar-hovercard__drawer-item-label">home phone</span>
                                                            <span className="gravatar-hovercard__drawer-item-text">
                                                                <a className="gravatar-hovercard__drawer-item-link" href={`tel:${profile.contact_info.home_phone}`} target="_blank" rel="noopener noreferrer">{profile.contact_info.home_phone}</a>
                                                            </span>
                                                        </div>
                                                    </li>
                                                )}
                                                {profile.contact_info.cell_phone && (
                                                    <li className="gravatar-hovercard__drawer-item">
                                                        <img className="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://secure.gravatar.com/icons/mobile-phone.svg" alt="" />
                                                        <div className="gravatar-hovercard__drawer-item-info">
                                                            <span className="gravatar-hovercard__drawer-item-label">cell phone</span>
                                                            <span className="gravatar-hovercard__drawer-item-text">
                                                                <a className="gravatar-hovercard__drawer-item-link" href={`tel:${profile.contact_info.cell_phone}`} target="_blank" rel="noopener noreferrer">{profile.contact_info.cell_phone}</a>
                                                            </span>
                                                        </div>
                                                    </li>
                                                )}
                                                {profile.contact_info.work_phone && (
                                                    <li className="gravatar-hovercard__drawer-item">
                                                        <img className="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://secure.gravatar.com/icons/work-phone.svg" alt="" />
                                                        <div className="gravatar-hovercard__drawer-item-info">
                                                            <span className="gravatar-hovercard__drawer-item-label">work phone</span>
                                                            <span className="gravatar-hovercard__drawer-item-text">
                                                                <a className="gravatar-hovercard__drawer-item-link" href={`tel:${profile.contact_info.work_phone}`} target="_blank" rel="noopener noreferrer">{profile.contact_info.work_phone}</a>
                                                            </span>
                                                        </div>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
