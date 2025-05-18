<?php
/**
 * Plugin Name: Bento Blog
 * Description: Easily design an attractive and seamless bento layout grid for a stunning visual experience.
 * Plugin URI: https://seahawkmedia.com/
 * Author: Seahawk Media
 * Author URI: https://seahawkmedia.com/
 * Version: 1.0.0
 * License: GPL2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       bento-blog
 * Domain Path:       /languages
 * Requires PHP:      7.2
 * Requires at least: 4.4
 * Tested up to:      6.7.1
 * @package Bento Blog
 *
 * License: GNU General Public License v3.0
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html 
 */

defined('ABSPATH') || exit;

final class Bento_Blog {

    /**
     * Plugin version
     *
     * @var string
     */
    public $version = '1.0.0';

    /**
     * Instance of self
     *
     * @var Bento_Blog
     */
    private static $instance = null;

    /**
     * Minimum PHP version required
     *
     * @var string
     */
    private $min_php = '5.6';

    /**
     * Holds various class instances
     *
     * @since 2.6.10
     *
     * @var array
     */
    private $container = [];

    /**
     * Constructor for the Bento_Blog class
     *
     * Sets up all the appropriate hooks and actions
     * within our plugin.
     */
    private function __construct() {
        $this->define_constants();
		$this->load_dependency();
        register_activation_hook( __FILE__, array( $this, 'activate' ) );
        register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );
        add_action( 'plugins_loaded', array( $this, 'on_plugins_loaded' ) );
		add_action( 'bentoblog_loaded', array( $this, 'init_plugin' ) );
    }

    /**
     * Initializes the Bento_Blog() class
     *
     * Checks for an existing WeDevs_Bento_Blog() instance
     * and if it doesn't find one, create it.
     */
    public static function init() {
        if ( self::$instance === null ) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Check if the PHP version is supported
     *
     * @return bool
     */
    public function is_supported_php() {
        if ( version_compare( PHP_VERSION, $this->min_php, '<=' ) ) {
            return false;
        }

        return true;
    }

    /**
     * Get the plugin path.
     *
     * @return string
     */
    public function plugin_path() {
        return untrailingslashit( plugin_dir_path( __FILE__ ) );
    }

    /**
     * Placeholder for activation function
     *
     * Nothing being called here yet.
     */
    public function activate() {

        if ( ! $this->is_supported_php() ) {
			$class = 'notice notice-error';
			
			$message = sprintf(
				// Translators: %1$s is the plugin name, %2$s is the required PHP version, %3$s is the current PHP version.
				__( 'The Minimum PHP Version Requirement for %1$s is %2$s. You are Running PHP %3$s.', 'bento-blog' ),
				'<b>Bento Blog</b>',
				esc_html( $this->min_php ),
				esc_html( phpversion() )
			);

			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), $message );
			exit;
		}

        add_action( __FILE__, array( $this, 'flush_rewrite_rules' ) );

    }

    /**
     * Flush rewrite rules after dokan is activated or woocommerce is activated
     *
     * @since 3.2.8
     */
    public function flush_rewrite_rules() {
        flush_rewrite_rules();
    }

    /**
     * Placeholder for deactivation function
     *
     * Nothing being called here yet.
     */
    public function deactivate() {}

    /**
     * Initialize plugin for localization
     *
     * @uses load_plugin_textdomain()
     */
    public function localization_setup() {
        load_plugin_textdomain( 'bento-blog', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
    }

    /**
     * Define all constants
     *
     * @return void
     */
    public function define_constants() {
        define( 'BENTO_BLOG_VERSION', $this->version );
        define( 'BENTO_BLOG_PLUGIN_SLUG', 'bento-blog' );
        define( 'BENTO_BLOG_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
		define( 'BENTO_BLOG_ROOT_URL', plugin_dir_url( __FILE__ ) );
		define( 'BENTO_BLOG_ROOT_DIR_PATH', plugin_dir_path( __FILE__ ) );
        define( 'BENTO_BLOG_FILE', __FILE__ );
        define( 'BENTO_BLOG_DIR', __DIR__ );
        define( 'BENTO_BLOG_ASSEST_URL', plugins_url( 'assets', __FILE__ ) );
		define( 'BENTO_BLOG_ASSETS_PATH', BENTO_BLOG_ROOT_DIR_PATH . 'assets/' );
		define( 'BENTO_BLOG_INCLUDES_DIR_PATH', BENTO_BLOG_ROOT_DIR_PATH . 'includes/' );
		define( 'BENTO_BLOG_BLOCKS_DIR_PATH', BENTO_BLOG_ROOT_DIR_PATH . 'includes/blocks/' );
    }

    /**
     * Loads the required dependencies for the plugin.
     *
     * @return void
     */
	public function load_dependency() {
		require_once BENTO_BLOG_INCLUDES_DIR_PATH . 'autoload.php';
	}

    /**
	 * When WP has loaded all plugins, trigger the `bentoblog_loaded` hook.
	 *
	 * This ensures `bentoblog_loaded` is called only after all other plugins
	 * are loaded, to avoid issues caused by plugin directory naming changing
	 *
	 * @since 1.0.0
	 */
	public function on_plugins_loaded() {
		do_action( 'bentoblog_loaded' );
	}

    /**
     * Define constant if not already defined
     *
     * @since 2.9.16
     *
     * @param string      $name
     * @param string|bool $value
     *
     * @return void
     */
    private function define( $name, $value ) {
        if ( ! defined( $name ) ) {
            define( $name, $value );
        }
    }

    /**
     * Load the plugin after WP User Frontend is loaded
     *
     * @return void
     */
    public function init_plugin() {
        $this->includes();
        $this->init_hooks();
    }

    /**
     * Initialize the actions
     *
     * @return void
     */
    public function init_hooks() {
        // Localize our plugin
        add_action( 'init', array( $this, 'localization_setup' ) );
    }

    /**
     * Include all the required files
     *
     * @return void
     */
    public function includes() {
        BentoBlog\Apis::init();
        BentoBlog\EmailHash::init();
        BentoBlog\Blocks::init();
    }

}

/**
 * Load Bento Blog Plugin when all plugins loaded
 *
 * @return Bento_Blog
 */
function bento_blog() { // phpcs:ignore
    return Bento_Blog::init();
}

// Lets Go....
bento_blog();