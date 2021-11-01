<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Redet_As_0001
 * @subpackage Redet_As_0001/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Redet_As_0001
 * @subpackage Redet_As_0001/admin
 * @author     Your Name <email@example.com>
 */
class Redet_As_0001_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $redet_as_0001    The ID of this plugin.
	 */
	private $redet_as_0001;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $redet_as_0001       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $redet_as_0001, $version ) {

		$this->redet_as_0001 = $redet_as_0001;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Redet_As_0001_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Redet_As_0001_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->redet_as_0001, plugin_dir_url( __FILE__ ) . 'css/redet-as-0001-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Redet_As_0001_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Redet_As_0001_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->redet_as_0001, plugin_dir_url( __FILE__ ) . 'js/redet-as-0001-admin.js', array( 'jquery' ), $this->version, false );

	}

}
