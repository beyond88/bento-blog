<?php
namespace BentoBlog;

defined('ABSPATH') || exit;

class Blocks {

    /**
     * Initialize the Bento Blog Plugin.
     *
     * @return void
     */
    public static function init() {
		$self = new self();
        add_filter( 'block_categories_all', array( $self, 'register_bento_category' ), PHP_INT_MAX, 2 );
		add_action( 'init', array( $self, 'blocks_init' ) );
	}

    /**
     * Registers a custom block category called "Bento" for Bento-specific blocks.
     *
     * @param array $categories Array of current block categories.
     * @param WP_Post $post Current post object.
     * @return array Modified array of block categories with the added "Bento" category.
     */

    function register_bento_category( $categories, $post ) {
        return array_merge(
            $categories,
            [
                [
                    'slug'  => 'bento',
                    'title' => __( 'Bento', 'bento-blog' ),
                    'icon'  => 'layout'
                ],
            ]
        );
    }

    /**
     * Register and initialize Gutenberg blocks.
     *
     * @return void
     */
    public function blocks_init() {

        new \BentoBlog\Blocks\Container\Block();
        new \BentoBlog\Blocks\Header\Block();
        new \BentoBlog\Blocks\Image\Block();
        new \BentoBlog\Blocks\Video\Block();
        new \BentoBlog\Blocks\Link\Block();
        new \BentoBlog\Blocks\Map\Block();
        new \BentoBlog\Blocks\Social\Block();
        new \BentoBlog\Blocks\Post\Block();
        new \BentoBlog\Blocks\Text\Block();
        new \BentoBlog\Blocks\Gravatar\Block();
    }

}