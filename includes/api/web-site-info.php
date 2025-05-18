<?php
namespace BentoBlog\API;

defined('ABSPATH') || exit;

use WP_REST_Response;

class WebSiteInfo {

    /**
     * Initializes the plugin by registering REST API endpoints.
     *
     * @since   1.0.0
     * @access  public
     * @return  void
     */
    public function __construct() {
        add_action('rest_api_init', array( $this, 'register_endpoints' ) );
    }

    /**
     * Registers custom REST API endpoints for the Bento Blocks plugin.
     *
     * @since   1.0.0
     * @access  public
     * @return  void
     */
    public function register_endpoints() {
        register_rest_route('bento-blog/v1', '/link-info', array(
            'methods' => 'GET',
            'callback' => array( $this, 'handle_link_info_request' ),
            'permission_callback' => array( $this, 'check_permission' ),
            'args' => array(
                'url' => array(
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'esc_url_raw',
                )
            )
        ));

        register_rest_route('bento-blog/v1', '/gravatar/(?P<username>[a-zA-Z0-9_-]+)', array(
            'methods' => 'GET',
            'callback' => array( $this, 'bento_fetch_gravatar' ),
            'permission_callback' => array( $this, 'check_permission' ),
            'args' => array(
                'username' => array(
                    'required' => true,
                    'type' => 'string'
                )
            )
        ));
    }

    /**
     * Checks if the current user has permission to edit posts.
     *
     * @since   1.0.0
     * @access  public
     * @return  bool True if the user can edit posts, false otherwise.
     */
    public function check_permission() {
        return true;
    }

    /**
     * Handles an incoming API request to retrieve website information based on a provided URL.
     *
     * @since   1.0.0
     * @access  public
     * @param   WP_REST_Request $request The request object containing the URL parameter.
     * @return  array|WP_Error  An array with 'success' status and website information data, or WP_Error on failure.
     */
    public function handle_link_info_request( $request ) {
        $url = $request->get_param('url');

        if (empty( $url )) {
            return new \WP_Error(
                'missing_url',
                'URL is required',
                array('status' => 400)
            );
        }

        try {
            $website_info = $this->get_website_info( $url );
            
            if (is_wp_error($website_info)) {
                return new \WP_Error(
                    'fetch_error',
                    $website_info->get_error_message(),
                    array('status' => 500)
                );
            }

            return array(
                'success' => true,
                'data' => $website_info
            );

        } catch (\Exception $e) {
            return new \WP_Error(
                'fetch_error',
                $e->getMessage(),
                array('status' => 500)
            );
        }
    }

    /**
     * Retrieves website information, including the title, meta description, favicon, and logo,
     * from a given URL by parsing the HTML content of the website.
     *
     * @since   1.0.0
     * @access  private
     * @param   string $url The URL of the website to retrieve information from.
     * @return  array|WP_Error Associative array containing 'title', 'meta_description', 'favicon', and 'logo'
     *                          or WP_Error object if the request or parsing fails.
     */
    private function get_website_info($url) {
        $args = array(
            'timeout'     => 10,
            'user-agent'  => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'sslverify'   => false
        );

        $response = wp_remote_get($url, $args);

        if (is_wp_error($response)) {
            return $response;
        }

        $body = wp_remote_retrieve_body($response);
        
        if (empty($body)) {
            return new \WP_Error('empty_response', 'Empty response from server');
        }

        $doc = new \DOMDocument();
        @$doc->loadHTML($body, LIBXML_NOERROR | LIBXML_NOWARNING);
        $xpath = new \DOMXPath($doc);

        $result = array(
            'title' => '',
            'meta_description' => '',
            'favicon' => '',
            'logo' => '',
            'domain' => '',
        );

        $title_nodes = $xpath->query('//title');
        if ($title_nodes->length > 0) {
            $result['title'] = $this->clean_text($title_nodes->item(0)->nodeValue);
        }

        $meta_desc = $xpath->query('//meta[@name="description"]/@content');
        if ($meta_desc->length > 0) {
            $result['meta_description'] = $this->clean_text($meta_desc->item(0)->nodeValue);
        }

        $favicon_paths = array(
            '//link[@rel="icon"]/@href',
            '//link[@rel="shortcut icon"]/@href',
            '//link[@rel="apple-touch-icon"]/@href'
        );

        foreach ($favicon_paths as $path) {
            $favicon = $xpath->query($path);
            if ($favicon->length > 0) {
                $favicon_url = $favicon->item(0)->nodeValue;
                $result['favicon'] = $this->make_absolute_url($favicon_url, $url);
                break;
            }
        }

        $logo_paths = array(
            '//link[@rel="logo"]/@href',
            '//meta[@property="og:image"]/@content',
            '//meta[@property="og:logo"]/@content',
            '//img[contains(@class, "logo")]/@src',
            '//img[contains(@id, "logo")]/@src',
            '//img[contains(@alt, "logo")]/@src'
        );

        foreach ($logo_paths as $path) {
            $logo = $xpath->query($path);
            if ($logo->length > 0) {
                $logo_url = $logo->item(0)->nodeValue;
                $result['logo'] = $this->make_absolute_url($logo_url, $url);
                break;
            }
        }

		// phpcs:ignore WordPress.WP.AlternativeFunctions.parse_url_parse_url
        $parsed_url = parse_url($url);
        if (isset($parsed_url['host'])) {
            $result['domain'] = $parsed_url['host'];
        }

        return $result;
    }

    /**
     * Converts a relative URL to an absolute URL based on a specified base URL.
     *
     * @since   1.0.0
     * @access  private
     * @param   string $relative_url The relative URL to convert.
     * @param   string $base_url The base URL to use for conversion.
     * @return  string The absolute URL, or an empty string if $relative_url is empty.
     */
    private function make_absolute_url($relative_url, $base_url) {
        if (empty($relative_url)) {
            return '';
        }

        if (filter_var($relative_url, FILTER_VALIDATE_URL)) {
            return $relative_url;
        }

		// phpcs:ignore WordPress.WP.AlternativeFunctions.parse_url_parse_url
        $parsed_url = parse_url($base_url);
        $scheme = isset($parsed_url['scheme']) ? $parsed_url['scheme'] : 'http';
        $host = isset($parsed_url['host']) ? $parsed_url['host'] : '';
        
        if (strpos($relative_url, '//') === 0) {
            return $scheme . ':' . $relative_url;
        } elseif (strpos($relative_url, '/') === 0) {
            return $scheme . '://' . $host . $relative_url;
        } else {
            $path = isset($parsed_url['path']) ? dirname($parsed_url['path']) : '/';
            return $scheme . '://' . $host . $path . '/' . $relative_url;
        }
    }

    /**
     * Cleans up a given text by removing HTML tags, decoding HTML entities, 
     * normalizing whitespace, and trimming leading and trailing spaces.
     *
     * @since   1.0.0
     * @access  private
     * @param   string $text The text to be cleaned.
     * @return  string The cleaned text, free of HTML tags, extra spaces, and entities.
     */
    private function clean_text($text) {
		// phpcs:ignore WordPress.WP.AlternativeFunctions.strip_tags_strip_tags
        $text = strip_tags($text);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace('/\s+/', ' ', $text);
        return trim($text);
    }

    public function bento_fetch_gravatar( $request ) {
        $username = sanitize_text_field( $request['username'] );
        $url = "https://gravatar.com/{$username}.card";
    
        // Fetch Gravatar profile page
        $response = wp_remote_get($url);
    
        if (is_wp_error($response)) {
            return new WP_Error('fetch_error', __('Failed to load Gravatar profile.', 'bento-blog'), array('status' => 500));
        }
    
        $html = wp_remote_retrieve_body($response);
    
        // Inject custom CSS into the head
        $custom_css = '<style>
            #profile-card { display: contents !important; }
            .gravatar-hovercard .gravatar-hovercard__inner { width: 400px !important; }
        </style>';
    
        $html = str_replace("</head>", $custom_css . "</head>", $html);
    
        return new WP_REST_Response($response, 200, array('Content-Type' => 'text/html'));
    }
    
}