<?php
namespace BentoBlog\Blocks\Container;

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
        add_action( 'init', array( $this, 'container_block_init' ) );
        add_action( 'enqueue_block_editor_assets', array( $this, 'container_block_editor_assets' ) );
        add_action( 'enqueue_block_assets', array( $this, 'container_block_assets' ) );
        add_action( 'wp_footer', array( $this, 'handle_resizing_blocks_on_small_devices' ) );
    }

    public function handle_resizing_blocks_on_small_devices() {
        ?>
        <script>
            const reSizeBlocks = () => {

                if (window.innerWidth <= 901) {
                    const BLOCK_SIZES = {
                        SINGLE: 180,
                        DOUBLE: 400,
                        HALF: 70,
                    };

                    const GAP_SIZE = 40;
                    const ROW_GAP_SIZE = 40;

                    const parentElements = document.querySelectorAll('.bento-grid__content');
                    if (!parentElements.length) return;

                    parentElements.forEach(parent => {
                        const children = parent.querySelectorAll('.bento-grid__item');
                        if (!children.length) return;

                        let xPos = 0;
                        let yPos = 0;
                        let rowWidth = 0;
                        let maxHeightInRow = 0;
                        let maxColumns = Math.floor((window.innerWidth + GAP_SIZE) / (BLOCK_SIZES.SINGLE + GAP_SIZE));
                        maxColumns = Math.min(4, maxColumns);

                        children.forEach(child => {
                            const style = window.getComputedStyle(child);
                            const width = parseFloat(style.width);
                            const height = parseFloat(style.height);

                            const isDoubleWidth = Math.abs(width - BLOCK_SIZES.DOUBLE) < 1;
                            const blockWidth = isDoubleWidth ? 2 : 1;

                            if (rowWidth + width > window.innerWidth - GAP_SIZE || (blockWidth === 2 && xPos > 0)) {
                                xPos = 0;
                                yPos += maxHeightInRow + ROW_GAP_SIZE;
                                rowWidth = 0;
                                maxHeightInRow = 0;
                            }

                            child.style.opacity = '0';
                            child.style.transform = `translate(${xPos}px, ${yPos}px)`;
                            requestAnimationFrame(() => {
                                child.style.opacity = '1';
                            });

                            rowWidth += width + GAP_SIZE;
                            maxHeightInRow = Math.max(maxHeightInRow, height);
                            xPos += width + GAP_SIZE;
                        });

                        parent.style.minHeight = `${yPos + maxHeightInRow}px`;
                    }); 
                }
            };

            let resizeTimeout;
            window.onresize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(reSizeBlocks, 150);
            };
            reSizeBlocks();
        </script>
        <?php
    }

    /**
     * Register the Bento Blog container block.
     *
     * @since   1.0.0
     * @access  public
     * @param   none
     * @return  void
     */
    public function container_block_init() {
        $block_json_path = BENTO_BLOG_ROOT_DIR_PATH . 'includes/blocks/container/block.json';
        
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
    public function container_block_editor_assets() {
        wp_enqueue_script(
            'bento-blog-container-editor',
            plugins_url('build/index.js', __FILE__),
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components'),
            filemtime(plugin_dir_path(__FILE__) . 'build/index.js'),
            true
        );
        wp_enqueue_style(
            'bento-blog-container-editor-style',
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
    public function container_block_assets() {
        wp_enqueue_style(
            'bento-blog-container-style',
            plugins_url('build/style-index.css', __FILE__), 
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'build/style-index.css')
        );
    }
}
