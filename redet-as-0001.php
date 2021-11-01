<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://example.com
 * @since             1.0.0
 * @package           Redet_As_0001
 *
 * @wordpress-plugin
 * Plugin Name:       redet-as-0001
 * Plugin URI:        https://redetronic.com
 * Description:       Personalización del tema Real House
 * Version:           1.0.0
 * Author:            Redetronic / Ángel Omar Sanz
 * Author URI:        https://redetronic
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       redet-as-0001
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'REDET_AS_0001_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-redet-as-0001-activator.php
 */
function activate_redet_as_0001() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-redet-as-0001-activator.php';
	Redet_As_0001_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-redet-as-0001-deactivator.php
 */
function deactivate_redet_as_0001() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-redet-as-0001-deactivator.php';
	Redet_As_0001_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_redet_as_0001' );
register_deactivation_hook( __FILE__, 'deactivate_redet_as_0001' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-redet-as-0001.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_redet_as_0001() {

	$plugin = new Redet_As_0001();
	$plugin->run();

}
run_redet_as_0001();
