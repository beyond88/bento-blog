<?php
namespace BentoBlog\Blocks\Map;

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
        add_action( 'init', array( $this, 'map_block_init' ) );
        add_action( 'enqueue_block_editor_assets', array( $this, 'map_block_editor_assets' ) );
        add_action( 'enqueue_block_assets', array( $this, 'map_block_assets' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_leaflet_scripts' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_leaflet_scripts' ) );
        add_filter( 'script_loader_tag', array( $this, 'add_defer_to_leaflet' ), 10, 2 );  
    }

    public function enqueue_leaflet_scripts() {
		// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
        wp_enqueue_script( 'leaflet-js', plugins_url( 'assets/leaflet.js', __FILE__ ), array(), null, true );
		// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
        wp_enqueue_style( 'leaflet-css', plugins_url( 'assets/leaflet.css', __FILE__ ), array(), null, null );
    }

    
    public function add_defer_to_leaflet( $tag, $handle ) {
        if ( 'leaflet-js' === $handle ) {
            return str_replace( ' src', ' defer src', $tag );
        }
        return $tag;
    }

    /**
     * Register the Bento Blog map block.
     *
     * @since   1.0.0
     * @access  public
     * @param   none
     * @return  void
     */
    public function map_block_init() {
        $block_json_path = BENTO_BLOG_ROOT_DIR_PATH . 'includes/blocks/map/block.json';
        
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
    public function map_block_editor_assets() {
        wp_enqueue_script(
            'bento-blog-map-editor',
            plugins_url('build/index.js', __FILE__),
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components'),
			filemtime(plugin_dir_path(__FILE__) . 'build/index.js'),
            true
        );
        wp_enqueue_style(
            'bento-blog-map-editor-style',
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
    public function map_block_assets() {
        wp_enqueue_style(
            'bento-blog-map-style',
            plugins_url('build/style-index.css', __FILE__), 
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'build/style-index.css')
        );
    }
}
