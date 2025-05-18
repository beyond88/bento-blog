<?php
namespace BentoBlog;

defined('ABSPATH') || exit;

class EmailHash {

    /**
     * Initialize the Bento Blog Plugin.
     *
     * @return void
     */
    public static function init() {
		$self = new self();
        add_action( 'wp_ajax_bento_blog_hash_email', array( $self, 'hash_email' ) );
        add_action( 'wp_ajax_nopriv_bento_blog_hash_email', array( $self, 'hash_email' ) );
	}

    /**
     * Hash email using SHA-256
     *
     * @return void
     */
    public function hash_email() {
        if ( ! isset( $_POST['email'] ) ) {
            wp_send_json_error( 'Email is required' );
        }

        $email = sanitize_email( $_POST['email'] );
        $hash = hash( 'sha256', strtolower( trim( $email ) ) );

        wp_send_json_success( array( 'hash' => $hash ) );
    }
}