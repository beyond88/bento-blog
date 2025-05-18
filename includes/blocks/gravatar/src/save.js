import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Save({ attributes }) {
    const { username, blockId } = attributes;
    const blockProps = useBlockProps.save();

    const openDrawerFn = `this.closest('.bento-grid__item').querySelector('.gravatar-hovercard__drawer').classList.add('gravatar-hovercard__drawer--open')`;
    const closeDrawerFn = `
        const drawer = this.closest('.gravatar-hovercard__drawer');
        drawer.classList.add('gravatar-hovercard__drawer--closing');
        drawer.classList.remove('gravatar-hovercard__drawer--open');
        setTimeout(() => drawer.classList.remove('gravatar-hovercard__drawer--closing'), 300);
    `;
    
    return (
        <div 
            {...blockProps}
            style={{
                width: '400px',
                height: '400px'
            }}
            className={`bento-grid__item ${blockProps.className} bento-grid__item-${blockId}`}
            data-block={blockId}
        >
            <div className="profile-card">
                <div className="gravatar-hovercard">
                    <div className="gravatar-hovercard__inner">
                        <div className="gravatar-hovercard__header-image"
                            style={{
                                background: attributes.profile?.header_image
                                    ? attributes.profile.header_image
                                    : attributes.profile?.background_color
                            }}
                        />
                        <div className="gravatar-hovercard__header">
                            <a className="gravatar-hovercard__avatar-link"
                               href={attributes.profile?.profile_url} target="_blank"
                               rel="noopener noreferrer">
                                <img
                                    className="gravatar-hovercard__avatar"
                                    src={attributes.profile?.avatar_url}
                                    width="104"
                                    height="104"
                                    alt={attributes.profile?.avatar_alt_text || attributes.profile?.display_name}
                                />
                            </a>
                            <a className="gravatar-hovercard__personal-info-link"
                               href={attributes.profile?.profile_url} target="_blank"
                               rel="noopener noreferrer">
                                <h4 className="gravatar-hovercard__name">{attributes.profile?.display_name}</h4>
                                {attributes.profile?.location && (
                                    <p className="gravatar-hovercard__location">{attributes.profile.location}</p>
                                )}
                                {attributes.profile?.job_title && (
                                    <p className="gravatar-hovercard__job">{attributes.profile.job_title}</p>
                                )}
                            </a>
                        </div>
                        {attributes.profile?.description && (
                            <div className="gravatar-hovercard__body">
                                <p className="gravatar-hovercard__description">{attributes.profile.description}</p>
                            </div>
                        )}
                        {attributes.profile?.verified_accounts && attributes.profile.verified_accounts.length > 0 && (
                            <div className="gravatar-hovercard__social-links">
                                {attributes.profile.verified_accounts.map((account) => (
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
                            onClick={openDrawerFn}
                            onclick={openDrawerFn}
                            >
                                { __('Contact', 'bento-layout') }
                            </button>
                        </div>
                        {/* <div className="gravatar-hovercard__footer">
                            <a
                                className="gravatar-hovercard__profile-url"
                                title={attributes.profile?.profile_url}
                                href={attributes.profile?.profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {attributes.profile?.profile_url?.replace('https://gravatar.com/', 'gravatar.com/')}
                            </a>
                            <a
                                className="gravatar-hovercard__profile-link"
                                href={attributes.profile?.profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                { __('View profile →', 'bento-layout') }
                            </a>
                        </div> */}
                        {attributes.profile?.contact_info && (
                            <div className="gravatar-hovercard__drawer" data-drawer-name="contact">
                                <div className="gravatar-hovercard__drawer-backdrop"
                                     data-target-drawer="contact"
                                     onclick={closeDrawerFn}
                                     ></div>
                                <div className="gravatar-hovercard__drawer-card">
                                    <div className="gravatar-hovercard__drawer-header">
                                        <h2 className="gravatar-hovercard__drawer-title">{ __('Contact', 'bento-layout') }</h2>
                                        <button 
                                                className="gravatar-hovercard__drawer-close"
                                                data-target-drawer="contact"
                                                onclick={closeDrawerFn}
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
                                        {attributes.profile.contact_info.email && (
                                            <li className="gravatar-hovercard__drawer-item">
                                                <img className="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://secure.gravatar.com/icons/mail.svg" alt="" />
                                                <div className="gravatar-hovercard__drawer-item-info">
                                                    <span className="gravatar-hovercard__drawer-item-label">email</span>
                                                    <span className="gravatar-hovercard__drawer-item-text">
                                                        <a className="gravatar-hovercard__drawer-item-link" href={`mailto:${attributes.profile.contact_info.email}`} target="_blank" rel="noopener noreferrer">{attributes.profile.contact_info.email}</a>
                                                    </span>
                                                </div>
                                            </li>
                                        )}
                                
                                        {attributes.profile.contact_info.home_phone && (
                                            <li className="gravatar-hovercard__drawer-item">
                                                <img className="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://secure.gravatar.com/icons/home-phone.svg" alt="" />
                                                <div className="gravatar-hovercard__drawer-item-info">
                                                    <span className="gravatar-hovercard__drawer-item-label">home phone</span>
                                                    <span className="gravatar-hovercard__drawer-item-text">
                                                        <a className="gravatar-hovercard__drawer-item-link" href={`tel:${attributes.profile.contact_info.home_phone}`} target="_blank" rel="noopener noreferrer">{attributes.profile.contact_info.home_phone}</a>
                                                    </span>
                                                </div>
                                            </li>
                                        )}
                                        {attributes.profile.contact_info.cell_phone && (
                                            <li className="gravatar-hovercard__drawer-item">
                                                <img className="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://secure.gravatar.com/icons/mobile-phone.svg" alt="" />
                                                <div className="gravatar-hovercard__drawer-item-info">
                                                    <span className="gravatar-hovercard__drawer-item-label">cell phone</span>
                                                    <span className="gravatar-hovercard__drawer-item-text">
                                                        <a className="gravatar-hovercard__drawer-item-link" href={`tel:${attributes.profile.contact_info.cell_phone}`} target="_blank" rel="noopener noreferrer">{attributes.profile.contact_info.cell_phone}</a>
                                                    </span>
                                                </div>
                                            </li>
                                        )}
                                        {attributes.profile.contact_info.work_phone && (
                                            <li className="gravatar-hovercard__drawer-item">
                                                <img className="gravatar-hovercard__drawer-item-icon" width="24" height="24" src="https://secure.gravatar.com/icons/work-phone.svg" alt="" />
                                                <div className="gravatar-hovercard__drawer-item-info">
                                                    <span className="gravatar-hovercard__drawer-item-label">work phone</span>
                                                    <span className="gravatar-hovercard__drawer-item-text">
                                                        <a className="gravatar-hovercard__drawer-item-link" href={`tel:${attributes.profile.contact_info.work_phone}`} target="_blank" rel="noopener noreferrer">{attributes.profile.contact_info.work_phone}</a>
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
            </div>
        </div>
    );
}