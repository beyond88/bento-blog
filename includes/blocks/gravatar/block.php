<?php
namespace BentoBlog\Blocks\Gravatar;

defined( 'ABSPATH' ) || exit;

class Block {

    /**
     * Initialize the class
     *
     * @since   1.0.0
     * @access  public
     * @param   none
     * @return  void
     */
    public function __construct() {
        add_action( 'init', array( $this, 'gravatar_block_init' ) );
        add_action( 'enqueue_block_editor_assets', array( $this, 'gravatar_block_editor_assets' ) );
        add_action( 'enqueue_block_assets', array( $this, 'gravatar_block_assets' ) );
    }

    /**
     * Register the Bento Blog gravatar block.
     *
     * @since   1.0.0
     * @access  public
     * @param   none
     * @return  void
     */
    public function gravatar_block_init() {
        $block_json_path = BENTO_BLOG_ROOT_DIR_PATH . 'includes/blocks/gravatar/block.json';
        
        if ( file_exists( $block_json_path ) ) {
			// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
            $block_data = json_decode( file_get_contents( $block_json_path ), true );
            if ( isset( $block_data['name'] ) ) {
                register_block_type($block_data['name'], $block_data);
            }
        }
        register_block_type(__DIR__ . '/build');
    }

    /**
     * Enqueue editor-specific JavaScript and CSS assets for the block.
     *
     * @since   1.0.0
     * @access  public
     * @param   none
     * @return  void
     */
    public function gravatar_block_editor_assets() {
        wp_enqueue_script(
            'bento-blog-gravatar-editor',
            plugins_url('build/index.js', __FILE__),
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components'),
            filemtime(plugin_dir_path(__FILE__) . 'build/index.js'),
            true
        );
        wp_enqueue_style(
            'bento-blog-gravatar-editor-style',
            plugins_url('build/style-index.css', __FILE__),
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'build/style-index.css')
        );
    }

    /**
     * Enqueue front-end and editor CSS assets for the block.
     *
     * @since   1.0.0
     * @access  public
     * @param   none
     * @return  void
     */
    public function gravatar_block_assets() {
        wp_enqueue_style(
            'bento-blog-gravatar-style',
            plugins_url('build/style-index.css', __FILE__), 
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'build/style-index.css')
        );
    }
}
