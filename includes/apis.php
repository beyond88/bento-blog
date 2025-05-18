<?php
namespace BentoBlog;

defined('ABSPATH') || exit;

class Apis {

    /**
     * Initialize the Bento Blog Plugin.
     *
     * @return void
     */
    public static function init() {
		$self = new self();
		add_action( 'init', array( $self, 'apis_init' ) );
	}

    /**
     * Register and initialize Gutenberg blocks.
     *
     * @return void
     */
    public function apis_init() {
        new \BentoBlog\API\WebSiteInfo();
    }

}