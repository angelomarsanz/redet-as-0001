<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Redet_As_0001
 * @subpackage Redet_As_0001/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Redet_As_0001
 * @subpackage Redet_As_0001/public
 * @author     Your Name <email@example.com>
 */
class Redet_As_0001_Public {

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
	 * @param      string    $redet_as_0001       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $redet_as_0001, $version ) {

		$this->redet_as_0001 = $redet_as_0001;
		$this->version = $version;
		
		add_action( 'wp_ajax_houzez_crm_add_lead_redet_as', array( $this, 'add_lead_redet_as' ));
		add_action( 'wp_ajax_houzez_delete_lead_redet_as', array( $this, 'delete_lead_redet_as') );
		add_action( 'wp_ajax_crm_add_new_garantia', array( $this, 'add_garantia' ) );
		add_action( 'wp_ajax_get_single_garantia', array( $this, 'get_single_garantia' ) );
		add_action( 'wp_ajax_houzez_delete_garantia', array( $this, 'delete_garantia') );
		
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_style( $this->redet_as_0001, plugin_dir_url( __FILE__ ) . 'css/redet-as-0001-public.css', array(), time(), 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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

		wp_enqueue_script( $this->redet_as_0001, plugin_dir_url( __FILE__ ) . 'js/redet-as-0001-public.js', array( 'jquery' ), time(), false );

		$locals_redet_as = array(
			'ajax_url' => admin_url('admin-ajax.php'),
			'processing_text' => esc_html__('Processing, Please wait...', 'houzez-crm'),
			'delete_confirmation' => esc_html__('Are you sure you want to delete?', 'houzez-crm'),
			'cancel_btn_text' => esc_html__('Cancel', 'houzez-crm'),
			'confirm_btn_text' => esc_html__('Confirm', 'houzez-crm'),
			'verify_nonce' => wp_create_nonce('verify_gallery_nonce'),
			'verify_file_type' => esc_html__('Valid file formats', 'houzez'),
			'attachment_max_file_size' => houzez_option('attachment_max_file_size', '12000kb'),
			'max_prop_attachments' => houzez_option('max_prop_attachments', '5')
		);
		wp_localize_script( $this->redet_as_0001, 'Houzez_crm_vars_redet_as', $locals_redet_as ); 

	}

	public function add_lead_redet_as() 
	{
		$lead_id = $this->lead_exist_redet_as();
		$email = sanitize_email( $_POST['email'] );
		$prefix = sanitize_text_field( $_POST['prefix'] );
		$first_name = sanitize_text_field( $_POST['first_name'] );
		$name = sanitize_text_field( $_POST['name'] );

		if(empty($prefix)) {
			echo json_encode( array( 'success' => false, 'msg' => esc_html__('Please select title!', 'houzez-crm') ) );
			wp_die();
		}

		if(empty($name)) {
			echo json_encode( array( 'success' => false, 'msg' => esc_html__('Please enter your full name!', 'houzez-crm') ) );
			wp_die();
		}

		if( !is_email( $email ) ) {
			echo json_encode( array( 'success' => false, 'msg' => esc_html__('Invalid email address.', 'houzez-crm') ) );
			wp_die();
		}

		if(isset($_POST['lead_id']) && !empty($_POST['lead_id'])) {
			$lead_id = intval($_POST['lead_id']);
			$lead_id = $this->update_lead_redet_as($lead_id);

			echo json_encode( array(
				'success' => true,
				'msg' => esc_html__("Lead Successfully updated!", 'houzez-crm')
			));
		} 
		else 
		{
			$lead_id = $this->save_lead_redet_as();
			echo json_encode( array(
				'success' => true,
				'msg' => esc_html__("Lead Successfully added!", 'houzez-crm')
			));
		}
		wp_die();
	}

	public function lead_exist_redet_as($id_prospecto_redet_as = null) 
	{
		global $wpdb;
		$table_name = $wpdb->prefix . 'houzez_crm_leads';

		if (!empty($id_prospecto_redet_as)) 
		{
			$sql = "SELECT * FROM {$table_name} WHERE lead_id = '{$id_prospecto_redet_as}'";
		}
		else
		{
			$email = '';
			if ( isset( $_POST['email'] ) ) {
				$email = sanitize_email( $_POST['email'] );
			}

			if(empty($email)) {
				return false;
			}

			$sql = "SELECT * FROM {$table_name} WHERE email = '{$email}'";
		}

		$result = $wpdb->get_row( $sql, OBJECT );

		if( is_object( $result ) && ! empty( $result ) ) {
			return $result;
		}
		return '';
	}

	public function save_lead_redet_as() {
	
		global $wpdb;
		$user_id = $message = '';

		$lead_title = '';
		if ( isset( $_POST['name'] ) ) {
			$lead_title = sanitize_text_field( $_POST['name'] );
		}
	
		$first_name = '';
		if ( isset( $_POST['first_name'] ) ) {
			$first_name = sanitize_text_field( $_POST['first_name'] );
		}
	
		$prefix = '';
		if ( isset( $_POST['prefix'] ) ) {
			$prefix = sanitize_text_field( $_POST['prefix'] );
		}
	
		$last_name = '';
		if ( isset( $_POST['last_name'] ) ) {
			$last_name = sanitize_text_field( $_POST['last_name'] );
		}
	
		if(empty($lead_title)) {
			$lead_title = $first_name.' '.$last_name;
		}
	
		$mobile = '';
		if ( isset( $_POST['mobile'] ) ) {
			$mobile = sanitize_text_field( $_POST['mobile'] );
		}
	
		if( isset($_POST['is_schedule_form']) && $_POST['is_schedule_form'] == 'yes') {
			$mobile = sanitize_text_field( $_POST['phone'] );
		}
	
		$home_phone = '';
		if ( isset( $_POST['home_phone'] ) ) {
			$home_phone = sanitize_text_field( $_POST['home_phone'] );
		}
	
		$work_phone = '';
		if ( isset( $_POST['work_phone'] ) ) {
			$work_phone = sanitize_text_field( $_POST['work_phone'] );
		}
	
		$user_type = '';
		if ( isset( $_POST['user_type'] ) ) {
			$user_type = sanitize_text_field( $_POST['user_type'] );
			$user_type = houzez_crm_get_form_user_type($user_type);
		}
	
		$email = '';
		if ( isset( $_POST['email'] ) ) {
			$email = sanitize_email( $_POST['email'] );
		}
	
		$address = '';
		if ( isset( $_POST['address'] ) ) {
			$address = sanitize_text_field( $_POST['address'] );
		}
	
		$country = '';
		if ( isset( $_POST['country'] ) ) {
			$country = sanitize_text_field( $_POST['country'] );
		}
	
		$city = '';
		if ( isset( $_POST['city'] ) ) {
			$city = sanitize_text_field( $_POST['city'] );
		}
	
		$state = '';
		if ( isset( $_POST['state'] ) ) {
			$state = sanitize_text_field( $_POST['state'] );
		}
	
		$zip = '';
		if ( isset( $_POST['zip'] ) ) {
			$zip = sanitize_text_field( $_POST['zip'] );
		}
	
		$source = '';
		if ( isset( $_POST['source'] ) ) {
			$source = sanitize_text_field( $_POST['source'] );
		}
	
		$source_link = '';
		if ( isset( $_POST['source_link'] ) ) {
			$source_link = esc_url( $_POST['source_link'] );
		}
	
		if( isset($_POST['property_permalink']) ) {
			$source_link = esc_url($_POST['property_permalink']);
		}
	
		$agent_id = '';
		if ( isset( $_POST['agent_id'] ) ) {
			$agent_id = sanitize_text_field( $_POST['agent_id'] );
		}

		if (isset( $_POST['agente_prospecto']) && $_POST['agente_prospecto'] > 0) 
		{
			$agent_id = sanitize_text_field( $_POST['agente_prospecto'] );
		}
	
		$agent_type = '';
		if ( isset( $_POST['agent_type'] ) ) {
			$agent_type = sanitize_text_field( $_POST['agent_type'] );
		}
	
		$facebook = '';
		if ( isset( $_POST['facebook'] ) ) {
			$facebook = sanitize_text_field( $_POST['facebook'] );
		}
	
		$twitter = '';
		if ( isset( $_POST['twitter'] ) ) {
			$twitter = sanitize_text_field( $_POST['twitter'] );
		}
	
		$linkedin = '';
		if ( isset( $_POST['linkedin'] ) ) {
			$linkedin = sanitize_text_field( $_POST['linkedin'] );
		}
	
		$private_note = '';
		if ( isset( $_POST['private_note'] ) ) {
			$private_note = sanitize_textarea_field( $_POST['private_note'] );
		}
	
		$listing_id = '';
		if ( isset( $_POST['listing_id'] ) ) {
			$listing_id = intval( $_POST['listing_id'] );
		}
	
		if(!empty($listing_id)) {
			$user_id = get_post_field( 'post_author', $listing_id );
		}
	
		if(isset($_POST['realtor_page']) && $_POST['realtor_page'] == 'yes') {
			if($agent_type == 'author_info') {
				$user_id = $agent_id;
			} else {
				$user_id = get_post_meta( $agent_id, 'houzez_user_meta_id', true );
			}
		} 
	
		$message = isset( $_POST['message'] ) ? sanitize_textarea_field($_POST['message']) : '';
	
		if( (isset($_POST['houzez_contact_form']) && $_POST['houzez_contact_form'] == 'yes') || (isset($_POST['is_estimation']) && $_POST['is_estimation'] == 'yes') || empty($user_id) ) {
	
			$adminData = get_user_by( 'email', get_option( 'admin_email' ) );
			$user_id = $adminData->ID;
		}
	
		if( isset($_POST['dashboard_lead']) && $_POST['dashboard_lead'] == 'yes' ) {
			$user_id = get_current_user_id();
		}

		if (isset( $_POST['agente_prospecto']) && $_POST['agente_prospecto'] > 0) 
		{
			$user_id = $_POST['agente_prospecto'];
		}
	
		$leads_table        = $wpdb->prefix . 'houzez_crm_leads';
		$data = array(
			'user_id'       => $user_id,
			'prefix'        => $prefix,
			'display_name'  => $lead_title,
			'first_name'    => $first_name,
			'last_name'     => $last_name,
			'email'         => $email,
			'mobile'        => $mobile,
			'home_phone'    => $home_phone,
			'work_phone'    => $work_phone,
			'address'       => $address,
			'city'          => $city,
			'state'         => $state,
			'country'       => $country,
			'zipcode'       => $zip,
			'type'          => $user_type,
			'status'        => '',
			'source'        => $source,
			'source_link'        => $source_link,
			'enquiry_to'        => $agent_id,
			'enquiry_user_type' => $agent_type,
			'twitter_url'   => $twitter,
			'linkedin_url'  => $linkedin,
			'facebook_url'  => $facebook,
			'private_note'  => $private_note,
			'message'  => $message,
		);
	
		$format = array(
			'%d',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%d',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
		);
	
		$wpdb->insert($leads_table, $data, $format);
		$inserted_id = $wpdb->insert_id;

		return $inserted_id;
	}

	public function update_lead_redet_as($lead_id) {

		global $wpdb;

		$lead_title = '';
		if ( isset( $_POST['name'] ) ) {
			$lead_title = sanitize_text_field( $_POST['name'] );
		}

		$first_name = '';
		if ( isset( $_POST['first_name'] ) ) {
			$first_name = sanitize_text_field( $_POST['first_name'] );
		}

		$prefix = '';
		if ( isset( $_POST['prefix'] ) ) {
			$prefix = sanitize_text_field( $_POST['prefix'] );
		}

		$last_name = '';
		if ( isset( $_POST['last_name'] ) ) {
			$last_name = sanitize_text_field( $_POST['last_name'] );
		}

		if(empty($lead_title)) {
			$lead_title = $first_name.' '.$last_name;
		}

		$mobile = '';
		if ( isset( $_POST['mobile'] ) ) {
			$mobile = sanitize_text_field( $_POST['mobile'] );
		}

		$home_phone = '';
		if ( isset( $_POST['home_phone'] ) ) {
			$home_phone = sanitize_text_field( $_POST['home_phone'] );
		}

		$work_phone = '';
		if ( isset( $_POST['work_phone'] ) ) {
			$work_phone = sanitize_text_field( $_POST['work_phone'] );
		}

		$user_type = '';
		if ( isset( $_POST['user_type'] ) ) {
			$user_type = sanitize_text_field( $_POST['user_type'] );
		}

		$email = '';
		if ( isset( $_POST['email'] ) ) {
			$email = sanitize_email( $_POST['email'] );
		}

		$address = '';
		if ( isset( $_POST['address'] ) ) {
			$address = sanitize_text_field( $_POST['address'] );
		}

		$country = '';
		if ( isset( $_POST['country'] ) ) {
			$country = sanitize_text_field( $_POST['country'] );
		}

		$city = '';
		if ( isset( $_POST['city'] ) ) {
			$city = sanitize_text_field( $_POST['city'] );
		}

		$state = '';
		if ( isset( $_POST['state'] ) ) {
			$state = sanitize_text_field( $_POST['state'] );
		}

		$zip = '';
		if ( isset( $_POST['zip'] ) ) {
			$zip = sanitize_text_field( $_POST['zip'] );
		}

		$source = '';
		if ( isset( $_POST['source'] ) ) {
			$source = sanitize_text_field( $_POST['source'] );
		}

		$agent_id = '';
		if ( isset( $_POST['agent_id'] ) ) {
			$agent_id = sanitize_text_field( $_POST['agent_id'] );
		}

		if (isset( $_POST['agente_prospecto']) && $_POST['agente_prospecto'] > 0)
		{ 
			$agent_id = sanitize_text_field( $_POST['agente_prospecto'] );
		}

		$agent_type = '';
		if ( isset( $_POST['agent_type'] ) ) {
			$agent_type = sanitize_text_field( $_POST['agent_type'] );
		}

		$facebook = '';
		if ( isset( $_POST['facebook'] ) ) {
			$facebook = sanitize_text_field( $_POST['facebook'] );
		}

		$twitter = '';
		if ( isset( $_POST['twitter'] ) ) {
			$twitter = sanitize_text_field( $_POST['twitter'] );
		}

		$linkedin = '';
		if ( isset( $_POST['linkedin'] ) ) {
			$linkedin = sanitize_text_field( $_POST['linkedin'] );
		}

		$private_note = '';
		if ( isset( $_POST['private_note'] ) ) {
			$private_note = sanitize_textarea_field( $_POST['private_note'] );
		}

		if (isset( $_POST['agente_prospecto']) && $_POST['agente_prospecto'] > 0)
		{ 
			$user_id = $_POST['agente_prospecto'];
		}

		$cambioUsuario = 0;

		$leads_table = $wpdb->prefix . 'houzez_crm_leads';

        $sql = "SELECT * FROM $leads_table WHERE lead_id = ".$lead_id;
			
		$prospecto = $wpdb->get_row( $sql, OBJECT );

		if (is_object($prospecto) && !empty($prospecto)) 
		{
			if ($prospecto->user_id != $user_id)
			{
				$cambioUsuario = 1;
			}

			$data = array(
				'user_id'		=> $user_id,
				'prefix'        => $prefix,
				'display_name'  => $lead_title,
				'first_name'    => $first_name,
				'last_name'     => $last_name,
				'email'         => $email,
				'mobile'        => $mobile,
				'home_phone'    => $home_phone,
				'work_phone'    => $work_phone,
				'address'       => $address,
				'city'          => $city,
				'state'         => $state,
				'country'       => $country,
				'zipcode'       => $zip,
				'type'          => $user_type,
				'status'        => '',
				'source'        => $source,
				'enquiry_to'        => $agent_id,
				'enquiry_user_type' => $agent_type,
				'twitter_url'   => $twitter,
				'linkedin_url'  => $linkedin,
				'facebook_url'  => $facebook,
				'private_note'  => $private_note,
			);

			$format = array(
				'%d',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%d',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
			);

			$where = array(
				'lead_id' => $lead_id
			);

			$where_format = array(
				'%d'
			);

			$updated = $wpdb->update( $leads_table, $data, $where, $format, $where_format );

			if ( false === $updated ) 
			{
				return false;
			} 
			else 
			{
				if ($cambioUsuario == 0)
				{
					return true;
				}
				else
				{
					$indicadorCambio = $this->cambiar_usuario_solicitudes($lead_id, $user_id);
					if ($indicadorCambio == 0)
					{
						return true;
					}
					else
					{
						return false;
					}
				}
			}
		}
		else
		{
			return false;
		}
	}

	public function delete_lead_redet_as() 
	{
		global $wpdb;
		$table_name = $wpdb->prefix . 'houzez_crm_leads';

		$nonce = $_REQUEST['security'];
		if ( ! wp_verify_nonce( $nonce, 'delete_lead_nonce' ) ) {
			$ajax_response = array( 'success' => false , 'reason' => esc_html__( 'Security check failed!', 'houzez-crm' ) );
			echo json_encode( $ajax_response );
			die;
		}

		if ( !isset( $_REQUEST['lead_id'] ) ) {
			$ajax_response = array( 'success' => false , 'reason' => esc_html__( 'No lead id found', 'houzez-crm' ) );
			echo json_encode( $ajax_response );
			die;
		}
		$lead_id = $_REQUEST['lead_id'];

		$where = array(
			'lead_id' => $lead_id
		);

		$where_format = array(
			'%d'
		);

		$wpdb->query( 
			$wpdb->prepare( 
				"DELETE FROM {$table_name}
				 WHERE lead_id = %d
				",
					$lead_id
				)
		); 

		$actividades_encontradas_redet_as = $this->buscar_actividades_redet_as();

		if (!(empty($actividades_encontradas_redet_as)))
		{
			$vector_prospecto_encontrado_ra = $this->prospecto_actividad_ra($lead_id, 'houzez_redet_as_cedula_rif_blanco', $actividades_encontradas_redet_as, '');

			if ($vector_prospecto_encontrado_ra['encontrado'] == 1) 
			{
				$tipo_actividad_requerida_redet_as = 'houzez_redet_as_cedula_rif_blanco';
				$this->cerrar_actividades_redet_as($lead_id, $tipo_actividad_requerida_redet_as, $actividades_encontradas_redet_as);
			}
			else
			{
				$vector_prospecto_encontrado_ra = $this->prospecto_actividad_ra($lead_id, 'houzez_redet_as_cedula_rif_duplicado', $actividades_encontradas_redet_as, '');

				if ($vector_prospecto_encontrado_ra['encontrado'] == 1) 
				{
					$tipo_actividad_requerida_redet_as = 'houzez_redet_as_cedula_rif_duplicado';
					$this->cerrar_actividades_redet_as($lead_id, $tipo_actividad_requerida_redet_as, $actividades_encontradas_redet_as);
				}	
			} 
		}

		echo json_encode( array(
			'success' => true,
			'msg' => esc_html__("Lead Successfully deleted! ", 'houzez-crm')
		));
		wp_die();
	}

	public function grabar_actividad_redet_as($meta_redet_as = null, $id_usuario_redet_as = null) 
	{
		global $wpdb;
		$nombre_tabla_redet_as = $wpdb->prefix . 'houzez_crm_activities';

		$meta_serialize_redet_as = maybe_serialize($meta_redet_as);
		
		$datos_redet_as = 
			[
				'user_id' 						=> $id_usuario_redet_as,
				'meta'    						=> $meta_serialize_redet_as,
				'time'    						=> current_time( 'mysql' ),
				'estatus_actividad_redet_as' 	=> 'Abierta'  
			];

		$formato_redet_as = 
			[
				'%d',
				'%s',
				'%s',           
				'%s'           
			];

		$wpdb->insert($nombre_tabla_redet_as, $datos_redet_as, $formato_redet_as);
		
		$id_actividad = $wpdb->insert_id;

		return $id_actividad;	
	}

	public function actualizar_actividad_redet_as($id_actividad_redet_as = null, $meta_redet_as = null, $tiempo_redet_as = null, $estatus_actividad_redet_as = null) 
	{	
		global $wpdb;
		$nombre_tabla_redet_as = $wpdb->prefix . 'houzez_crm_activities';

		$meta_serialize_redet_as = maybe_serialize($meta_redet_as);
		
		$datos_redet_as = 
			[
				'meta'    						=> $meta_serialize_redet_as,
				'time'    						=> $tiempo_redet_as,
				'estatus_actividad_redet_as' 	=> $estatus_actividad_redet_as 
			];

		$formato_redet_as = 
			[
				'%s',
				'%s',           
				'%s'           
			];

		$where_redet_as = array(
			'activity_id' => $id_actividad_redet_as
		);

		$where_formato_redet_as = array(
			'%d'
		);

		$updated = $wpdb->update( $nombre_tabla_redet_as, $datos_redet_as, $where_redet_as, $formato_redet_as, $where_formato_redet_as );

		if ( false === $updated ) {
			return false;
		} else {
			return true;
		}
	}	

	public function get_leads_redet_as($id_prospectos_redet_as = null) 
	{
		global $wpdb;
		$table_name = $wpdb->prefix . 'houzez_crm_leads';

		if (isset($id_prospectos_redet_as))
		{
			$where_redet_as = ' WHERE lead_id= '; 
			$contador_redet_as = 0;
			foreach ($id_prospectos_redet_as as $id_prospecto_redet_as)
			{
				if ($contador_redet_as == 0)
				{
					$where_redet_as .= $id_prospecto_redet_as;
				}
				else
				{
					$where_redet_as .= ' OR lead_id= ' . $id_prospecto_redet_as;
				}
				$contador_redet_as++;
			}
		}	

		$items_per_page = isset($_GET['records']) ? $_GET['records'] : 10;
		$page = isset( $_GET['cpage'] ) ? abs( (int) $_GET['cpage'] ) : 1;
		$offset = ( $page * $items_per_page ) - $items_per_page;
		$query = 'SELECT * FROM '. $table_name . $where_redet_as;
		$total_query = "SELECT COUNT(1) FROM (${query}) AS combined_table";
		$total = $wpdb->get_var( $total_query );
		$results = $wpdb->get_results( $query.' ORDER BY lead_id DESC LIMIT '. $offset.', '. $items_per_page, OBJECT );

		$return_array['data'] = array(
			'results' => $results,
			'total_records' => $total,
			'items_per_page' => $items_per_page,
			'page' => $page,
		);

		return $return_array;
	}

	public function get_activities_redet_as() 
	{
		global $wpdb;
		$table_name = $wpdb->prefix . 'houzez_crm_activities';

		$this->actualizar_fecha_actividades_redet_as();

		$items_per_page = isset($_GET['records']) ? $_GET['records'] : 15;
		$page = isset( $_GET['cpage'] ) ? abs( (int) $_GET['cpage'] ) : 1;
		$offset = ( $page * $items_per_page ) - $items_per_page;
		$query = 'SELECT * FROM ' . $table_name . ' WHERE user_id= '.get_current_user_id() . ' AND (estatus_actividad_redet_as = "Abierta" OR estatus_actividad_redet_as IS NULL)';
		$total_query = "SELECT COUNT(1) FROM (${query}) AS combined_table";
		$total = $wpdb->get_var( $total_query );
		$results = $wpdb->get_results( $query.' ORDER BY time DESC LIMIT '. $offset.', '. $items_per_page, OBJECT );

		$return_array['data'] = array(
			'results' => $results,
			'total_records' => $total,
			'items_per_page' => $items_per_page,
			'page' => $page,
		);

		return $return_array;
	}

	public function cerrar_actividades_redet_as($id_prospecto_requerido_redet_as = null, $tipo_actividad_requerida_redet_as = null, $actividades_redet_as = null) 
	{
		foreach ($actividades_redet_as as $actividad)
		{
			$meta_redet_as = maybe_unserialize($actividad->meta);
			$tipo_actividad_redet_as = isset($meta_redet_as['type']) ? $meta_redet_as['type'] : '';
			$tiempo_actual_redet_as = current_time('mysql');

			if ($tipo_actividad_redet_as == $tipo_actividad_requerida_redet_as) 
			{				
				if (isset($meta_redet_as['id_prospectos']))
				{                                 
					$id_prospectos_redet_as = $meta_redet_as['id_prospectos'];
				}
				else
				{
					$id_prospectos_redet_as = '';
				}

				if(!empty($id_prospectos_redet_as)) 
				{    
					$contador_prospectos_ra = 0;
					$prospecto_encontrado_ra = 0;
					$nuevo_vector_prospectos_ra = [];
					foreach ($id_prospectos_redet_as as $id_prospecto_redet_as)
					{
						$contador_prospectos_ra++;
						if ($id_prospecto_redet_as == $id_prospecto_requerido_redet_as)
						{
							$prospecto_encontrado_ra = 1;
						}
						else
						{
							$nuevo_vector_prospectos_ra[] = intval($id_prospecto_redet_as);
						}
					}
					if ($prospecto_encontrado_ra == 1)
					{
						if ($contador_prospectos_ra > 2)
						{
							$estatus_actividad_redet_as = 'Abierta';
							$meta_redet_as['id_prospectos'] = $nuevo_vector_prospectos_ra; 
							$this->actualizar_actividad_redet_as($actividad->activity_id, $meta_redet_as, $tiempo_actual_redet_as, $estatus_actividad_redet_as);	

						}
						else
						{
							$estatus_actividad_redet_as = 'Cerrada';
							$this->actualizar_actividad_redet_as($actividad->activity_id, $meta_redet_as, $tiempo_actual_redet_as, $estatus_actividad_redet_as);	
						}
					}
				}
			}		
		}
		return;
	}

	public function actualizar_fecha_actividades_redet_as() 
	{
		global $wpdb;
		$table_name_redet_as = $wpdb->prefix . 'houzez_crm_activities';
		$id_usuario_actual_redet_as = get_current_user_id();
		$actividades_a_actualizar =
			[
				'houzez_redet_as_cedula_rif_blanco',
				'houzez_redet_as_cedula_rif_duplicado'
			];
		
		$query_redet_as = 'SELECT * FROM ' . $table_name_redet_as . ' WHERE user_id= ' . $id_usuario_actual_redet_as . ' AND estatus_actividad_redet_as = "Abierta"';
		$total_query_redet_as = "SELECT COUNT(1) FROM (${query_redet_as}) AS combined_table";
		$total_redet_as = $wpdb->get_var( $total_query_redet_as );
		$results_redet_as = $wpdb->get_results( $query_redet_as, OBJECT );

		if ($total_redet_as > 0)
		{
			$tiempo_actual_redet_as = current_time('mysql');
			$estatus_actividad_redet_as = 'Abierta';

			foreach ($results_redet_as as $actividad)
			{
				$meta_redet_as = maybe_unserialize($actividad->meta);
				$tipo_actividad_redet_as = isset($meta_redet_as['type']) ? $meta_redet_as['type'] : '';

				if (in_array($tipo_actividad_redet_as, $actividades_a_actualizar, true)) 
				{		
					$tiempo_ahora_redet_as = new DateTime("now");
					$tiempo_actividad_redet_as = new DateTime($actividad->time);
					$diff_redet_as = $tiempo_actividad_redet_as->diff($tiempo_ahora_redet_as);

					if ($diff_redet_as->days > 6)
					{
						$this->actualizar_actividad_redet_as($actividad->activity_id, $meta_redet_as, $tiempo_actual_redet_as, $estatus_actividad_redet_as);
					}
				}		
			}
		}
		return;
	}
	public function buscar_actividades_redet_as() 
	{
		global $wpdb;
		$table_name_redet_as = $wpdb->prefix . 'houzez_crm_activities';
		
		$query_redet_as = 'SELECT * FROM ' . $table_name_redet_as . ' WHERE estatus_actividad_redet_as = "Abierta"';
		$total_query_redet_as = "SELECT COUNT(1) FROM (${query_redet_as}) AS combined_table";
		$total_redet_as = $wpdb->get_var( $total_query_redet_as );
		$results_redet_as = $wpdb->get_results( $query_redet_as, OBJECT );

		if ($total_redet_as == 0)
		{
			return '';
		}
		else
		{
			return $results_redet_as;
		}
	}

	public function prospecto_actividad_ra($id_prospecto_requerido_redet_as = null, $tipo_actividad_requerida_redet_as = null, $actividades_abiertas_ra = null, $id_prospecto_insertar_ra = null) 
	{
		$vector_prospecto_encontrado_ra = [];
		$vector_prospecto_encontrado_ra['encontrado'] = 0;
		$vector_prospecto_encontrado_ra['id_actividades'] = [];
		
		foreach ($actividades_abiertas_ra as $actividad)
		{
			$meta_redet_as = maybe_unserialize($actividad->meta);
			$tipo_actividad_redet_as = isset($meta_redet_as['type']) ? $meta_redet_as['type'] : '';
			$estatus_actividad_redet_as = $actividad->estatus_actividad_redet_as;
			$tiempo_actual_redet_as = current_time('mysql');

			if ($tipo_actividad_redet_as == $tipo_actividad_requerida_redet_as) 
			{
				if (isset($meta_redet_as['id_prospectos']))
				{                                 
					$id_prospectos_redet_as = $meta_redet_as['id_prospectos'];
				}
				else
				{
					$id_prospectos_redet_as = '';
				}

				if (!empty($id_prospectos_redet_as)) 
				{    
					foreach ($id_prospectos_redet_as as $id_prospecto_redet_as)
					{
						if ($id_prospecto_redet_as == $id_prospecto_requerido_redet_as)
						{
							$vector_prospecto_encontrado_ra['encontrado'] = 1;
							$vector_prospecto_encontrado_ra['id_actividades'][] = $actividad->activity_id;
							if (!empty($id_prospecto_insertar_ra))
							{
								$id_prospectos_redet_as[] = $id_prospecto_insertar_ra;
								$meta_redet_as['id_prospectos'] = $id_prospectos_redet_as;
								$this->actualizar_actividad_redet_as($actividad->activity_id, $meta_redet_as, $tiempo_actual_redet_as, $estatus_actividad_redet_as);
							}
						}
					}
				}
			}	
		}		
		return $vector_prospecto_encontrado_ra;
	}

	public function crear_actividad_redet_as($argumentos_actividad_general_redet_as = null)
	{
		$nueva_alerta_redet_as = 
		[
			'post_author'  => 1,
			'post_title'   => $argumentos_actividad_general_redet_as['post_title'],
			'post_content' => $argumentos_actividad_general_redet_as['post_content'],
			'post_status'  => 'publish',
			'post_name'    =>  $argumentos_actividad_general_redet_as['post_name'],    
			'post_type'	   => 'houzez_redet_as',
		];
		
		$alerta_id_post_redet_as = wp_insert_post($nueva_alerta_redet_as);

		if ($alerta_id_post_redet_as > 0)
		{
			$id_prospectos_redet_as = $argumentos_actividad_general_redet_as['id_prospectos'];
			$fechayhora = date('m-d-Y_h:i:s');
			$id_usuario_actual_redet_as = get_current_user_id();
			$id_referencia_actividad = $id_usuario_actual_redet_as . '_' . $fechayhora;

			$meta_redet_as = 
				[
					'type' 						=> $argumentos_actividad_general_redet_as['type'],
					'listing_id' 				=> $alerta_id_post_redet_as,
					'notificacion' 				=> $argumentos_actividad_general_redet_as['post_content'],
					'id_prospectos'  			=> $argumentos_actividad_general_redet_as['id_prospectos'],
					'enlace_prospectos' 		=> site_url( '/mi-panel/?hpage=leads', 'https' ),
					'id_referencia_actividad'	=> $id_referencia_actividad
				];

			$id_actividad_redet_as = $this->grabar_actividad_redet_as($meta_redet_as, $id_usuario_actual_redet_as);

			$datos_usuario_actual_redet_as = get_userdata($id_usuario_actual_redet_as);

			$roles_usuario_actual_redet_as = $datos_usuario_actual_redet_as->roles;

			if (!(in_array('houzez_manager', $roles_usuario_actual_redet_as, true))) 
			{
				$usuarios_redet_as = get_users();
				foreach ($usuarios_redet_as as $usuario_redet_as) 
				{
					if (isset($usuario_redet_as->caps['houzez_manager']))
					{
						if ($usuario_redet_as->caps['houzez_manager'] == true)
						{
							$id_usuario_manager_redet_as = $usuario_redet_as->ID;
							$id_actividad_redet_as = $this->grabar_actividad_redet_as($meta_redet_as, $id_usuario_manager_redet_as);
						}
					}
				}
			}
		}
	}
	public function cedula_rif_duplicado_ra($vector_cedula_rif_duplicado_ra = null) 
	{
		global $wpdb;
		$table_name_ra = $wpdb->prefix . 'houzez_crm_leads';

		$lead_id_ra = $vector_cedula_rif_duplicado_ra['lead_id'];
		$tipo_documento_ra = $vector_cedula_rif_duplicado_ra['tipo_documento'];
		$cedula_rif_ra = $vector_cedula_rif_duplicado_ra['cedula_rif'];  
		$first_name_ra = $vector_cedula_rif_duplicado_ra['first_name'];
		$last_name_ra = $vector_cedula_rif_duplicado_ra['last_name']; 

		$tiempo_actual_ra = current_time('mysql');

		$tipo_actividad_requerida_ra = 'houzez_redet_as_cedula_rif_duplicado';
		$actividades_encontradas_ra = $this->buscar_actividades_redet_as();

		if (empty($actividades_encontradas_ra))
		{
			$vector_prospecto_encontrado_ra = [];
			$vector_prospecto_encontrado_ra['encontrado'] = 0;
			$vector_prospecto_encontrado_ra['id_actividades'] = [];
		}
		else
		{
			$vector_prospecto_encontrado_ra = $this->prospecto_actividad_ra($lead_id_ra, $tipo_actividad_requerida_ra, $actividades_encontradas_ra, '');
		}

		$prospecto_encontrado_ra = $vector_prospecto_encontrado_ra['encontrado'];

		$sql_ra = "SELECT * FROM $table_name_ra WHERE tipo_documento_redet_as = '" . $tipo_documento_ra . "' AND cedula_rif_redet_as= " . $cedula_rif_ra;

		$total_query_ra = "SELECT COUNT(1) FROM (${sql_ra}) AS combined_table";
		$total_ra = $wpdb->get_var( $total_query_ra );

		$results_ra = $wpdb->get_results( $sql_ra , OBJECT );

		if ($total_ra > 1)
		{
			if ($prospecto_encontrado_ra == 0) 
			{
				$prospectos_ra = [];
				$vector_prospecto_encontrado_ra = [];
				$vector_prospecto_encontrado_ra['encontrado'] = 0;
				$vector_prospecto_encontrado_ra['id_actividades'] = [];

				foreach ($results_ra as $prospecto)
				{
					if ($prospecto->lead_id != $lead_id_ra && $vector_prospecto_encontrado_ra['encontrado'] == 0)
					{
						$vector_prospecto_encontrado_ra = $this->prospecto_actividad_ra($prospecto->lead_id, $tipo_actividad_requerida_ra, $actividades_encontradas_ra, $lead_id_ra);
					}
					$prospectos_ra[] = intval($prospecto->lead_id);
				}
				
				if ($vector_prospecto_encontrado_ra['encontrado'] == 0)
				{
					$argumentos_actividad_general_ra =
						[
							'post_title' 	=> 'Prospectos con cédula o rif duplicados',
							'post_content' 	=> 'Prospectos con cédula o rif duplicados: ' . $tipo_documento_ra . '-' . $cedula_rif_ra,
							'post_name' 	=> 'Prospectos con cédula o rif duplicados: ' . $tipo_documento_ra . '-' . $cedula_rif_ra,
							'id_prospectos' => $prospectos_ra,
							'type' 			=> 'houzez_redet_as_cedula_rif_duplicado'
						];

					$this->crear_actividad_redet_as($argumentos_actividad_general_ra);
				}
			}
		}
		else
		{
			if ($prospecto_encontrado_ra == 1) 
			{
				$tipo_actividad_requerida_ra = 'houzez_redet_as_cedula_rif_duplicado';
				$this->cerrar_actividades_redet_as($lead_id_ra, $tipo_actividad_requerida_ra, $actividades_encontradas_ra);
			}
		}
		return;
	}
	public function meta_cedula_catastral($idPropiedad = null)
	{
		global $wpdb;

		$cedulaCatastral = sanitize_text_field($_POST['prop_cedula_catastral_ra']);

		$metaCatastral = $wpdb->get_results( "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = 'fave_property_cedula_catastral_ra' AND meta_value = '$cedulaCatastral'", ARRAY_A );

		if ($metaCatastral):
			foreach ($metaCatastral as $meta):
				$idPost = $meta['post_id'];
				update_post_meta(1, 'idPost_catastral_duplicado_' . $idPost, $idPost);
				$postCatastral = $wpdb->get_results("SELECT post_author FROM $wpdb->posts WHERE ID = ' $idPost'", ARRAY_A);
				foreach ($postCatastral as $postCat):
					$idAuthor = $postCat['post_author'];
					update_post_meta(1, 'idAuthor_catastral_duplicado_' . $idPost . '-' . $idAuthor , $idAuthor);
				endforeach;
			endforeach;
		endif;

		if( isset( $_POST['prop_cedula_catastral_ra'] ) ) 
		{
			update_post_meta( $idPropiedad, 'fave_property_cedula_catastral_ra', $cedulaCatastral);
		}
	}
	public function get_leads_ra() 
	{
		global $wpdb;
		$table_name = $wpdb->prefix . 'houzez_crm_leads';
		
		$items_per_page = isset($_GET['records']) ? $_GET['records'] : 10;
		$page = isset( $_GET['cpage'] ) ? abs( (int) $_GET['cpage'] ) : 1;
		$offset = ( $page * $items_per_page ) - $items_per_page;

		
		$esAdministrador = $this->es_administrador();

		if ($esAdministrador == 0):
			$query = 'SELECT * FROM '.$table_name.' WHERE user_id= '.get_current_user_id();
		else:
			$query = 'SELECT * FROM '.$table_name;
		endif;

		$total_query = "SELECT COUNT(1) FROM (${query}) AS combined_table";
		$total = $wpdb->get_var( $total_query );
		$results = $wpdb->get_results( $query.' ORDER BY lead_id DESC LIMIT '. $offset.', '. $items_per_page, OBJECT );

		$return_array['data'] = array(
			'results' => $results,
			'total_records' => $total,
			'items_per_page' => $items_per_page,
			'page' => $page,
		);

		return $return_array;
	}
	public function buscar_solicitudes_otros_agentes() 
	{
		global $wpdb;
		$table_name = $wpdb->prefix . 'houzez_crm_enquiries';

		$items_per_page = isset($_GET['records']) ? intval($_GET['records']) : 10;
		$page = isset( $_GET['cpage'] ) ? abs( (int) $_GET['cpage'] ) : 1;
		$offset = ( $page * $items_per_page ) - $items_per_page;
		$query = 'SELECT * FROM '.$table_name.' WHERE user_id != '.get_current_user_id();
		$total_query = "SELECT COUNT(1) FROM (${query}) AS combined_table";
		$total = $wpdb->get_var( $total_query );

		$results = $wpdb->get_results( $query.' ORDER BY enquiry_id DESC LIMIT '. $offset.', '. $items_per_page, OBJECT );

		$return_array['data'] = array(
			'results' => $results,
			'total_records' => $total,
			'items_per_page' => $items_per_page,
			'page' => $page,
		);

		return $return_array;
	}
	public function buscar_solicitud_otro_agente($enquiry_id = null) 
	{
		global $wpdb;
		$table_name = $wpdb->prefix . 'houzez_crm_enquiries';

		$sql = "SELECT * FROM $table_name WHERE enquiry_id = ".$enquiry_id.' AND user_id != '.get_current_user_id();
		
		$result = $wpdb->get_row( $sql, OBJECT );

		if( is_object( $result ) && ! empty( $result ) ) {
			return $result;
		}

		return '';
	}
	public function buscar_solicitudes_ra() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'houzez_crm_enquiries';
	
		$andwhere = '';

		$esAdministrador = $this->es_administrador();

		$items_per_page = isset($_GET['records']) ? intval($_GET['records']) : 10;
		$page = isset( $_GET['cpage'] ) ? abs( (int) $_GET['cpage'] ) : 1;
		$offset = ( $page * $items_per_page ) - $items_per_page;

		if ($esAdministrador == 0):
			if(isset($_GET['lead-id']) && !empty($_GET['lead-id'])) 
			{
				$andwhere = 'AND lead_id="'.$_GET['lead-id'].'"';
			}
			$query = 'SELECT * FROM '.$table_name.' WHERE user_id= '.get_current_user_id().' '.$andwhere;
		else:
			if(isset($_GET['lead-id']) && !empty($_GET['lead-id'])) 
			{
				$andwhere = 'WHERE lead_id="'.$_GET['lead-id'].'"';
			}
			$query = 'SELECT * FROM '.$table_name.$andwhere;
		endif;
		
		$total_query = "SELECT COUNT(1) FROM (${query}) AS combined_table";
		$total = $wpdb->get_var( $total_query );

		$results = $wpdb->get_results( $query.' ORDER BY enquiry_id DESC LIMIT '. $offset.', '. $items_per_page, OBJECT );

		$return_array['data'] = array(
			'results' => $results,
			'total_records' => $total,
			'items_per_page' => $items_per_page,
			'page' => $page,
		);

		return $return_array;
	}
	public function buscar_prospecto_ra($lead_id) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'houzez_crm_leads';

		$esAdministrador = $this->es_administrador();

		if ($esAdministrador == 0):
			$sql = "SELECT * FROM $table_name WHERE lead_id = ".$lead_id.' AND user_id = '.get_current_user_id();
		else:
			$sql = "SELECT * FROM $table_name WHERE lead_id = ".$lead_id;
		endif;

		$result = $wpdb->get_row( $sql, OBJECT );

		if( is_object( $result ) && ! empty( $result ) ) {
			return $result;
		}

		return '';
	}
	public function buscar_solicitud_ra($enquiry_id) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'houzez_crm_enquiries';

		$esAdministrador = $this->es_administrador();

		if ($esAdministrador == 0):
			$sql = "SELECT * FROM $table_name WHERE enquiry_id = ".$enquiry_id.' AND user_id = '.get_current_user_id();
		else:
			$sql = "SELECT * FROM $table_name WHERE enquiry_id = ".$enquiry_id;
		endif;

		$result = $wpdb->get_row( $sql, OBJECT );

		if( is_object( $result ) && ! empty( $result ) ) {
			return $result;
		}

		return '';
	}
	public function es_administrador()
	{
		$esAdministrador = 0;

		$user = wp_get_current_user();
		$rolesUsuario = ( array ) $user->roles;
		foreach ($rolesUsuario as $rol):
			update_user_meta(get_current_user_id(), 'rol_'. $rol, $rol);
			if ($rol == 'administrator'):
				$esAdministrador = 1;
			endif;
		endforeach;
		return $esAdministrador;
	}
    public function buscar_propiedad_similar($meta) {
         
        if(empty($meta)) {
            return '';
        }       
        $meta = maybe_unserialize($meta);
        $tax_query = array();
        $meta_query = array();

        $paged  = (get_query_var('paged')) ? get_query_var('paged') : 1;

		$args = array(
			'post_type' => 'property',
			'posts_per_page' => 15,
			'paged' => $paged,
			'post_status' => 'publish'
		);
			
        // Taxonomies
        $tax_query = apply_filters( 'houzez_tax_crm_filter', $tax_query, $meta );
        $tax_count = count($tax_query);
        if( $tax_count > 1 ) {
            $tax_query['relation'] = 'AND';
        }

        if($tax_count > 0 ) {
            $args['tax_query'] = $tax_query;
        }

        // Meta
        $meta_query = apply_filters( 'houzez_meta_crm_filter', $meta_query, $meta );
        $meta_count = count($meta_query);
        if( $meta_count > 1 ) {
            $meta_query['relation'] = 'AND';
        }

        if($meta_count > 0 ) {
            $args['meta_query'] = $meta_query;
        }

        $query = new WP_Query( $args );
        return $query;
    }
	public function cambiar_usuario_solicitudes($idProspecto = null, $nuevoUsuario = null)
	{
		global $wpdb;
		$codigoRetorno = 0;
		$table_name = $wpdb->prefix . 'houzez_crm_enquiries';

		$query = 'SELECT * FROM '.$table_name.' WHERE lead_id = '.$idProspecto;

		$solicitudes = $wpdb->get_results($query, OBJECT);

		foreach ($solicitudes as $solicitud)
		{	
			$data = array(
				'user_id'			=> $nuevoUsuario,
				'lead_id'           => $solicitud->lead_id,
				'listing_id'  		=> $solicitud->listing_id,
				'negotiator'    	=> $solicitud->negotiator,
				'source'     		=> $solicitud->source,
				'status'         	=> $solicitud->status,
				'enquiry_to'        => $nuevoUsuario,
				'enquiry_user_type' => $solicitud->enquiry_user_type,
				'message'    		=> $solicitud->message,
				'enquiry_type'    	=> $solicitud->enquiry_type,
				'enquiry_meta'    	=> $solicitud->enquiry_meta,
				'private_note'    	=> $solicitud->private_note
			);

			$format = array(
				'%d',
				'%d',
				'%d',
				'%s',
				'%s',
				'%s',
				'%d',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s'
			);

			$where = array(
				'enquiry_id' => $solicitud->enquiry_id
			);

			$where_format = array(
				'%d'
			);

			$updated = $wpdb->update( $table_name, $data, $where, $format, $where_format );

			if (false === $updated) 
			{
				$codigoRetorno = 1;
				break;
			} 	
		}
		return $codigoRetorno;
	}
	public function buscar_todas_las_garantias() 
	{
		global $wpdb;
		$table_name = $wpdb->prefix . 'garantias_ra';

		$items_per_page = isset($_GET['records']) ? intval($_GET['records']) : 10;
		$page = isset( $_GET['cpage'] ) ? abs( (int) $_GET['cpage'] ) : 1;
		$offset = ( $page * $items_per_page ) - $items_per_page;
		$query = 'SELECT * FROM '.$table_name;
		$total_query = "SELECT COUNT(1) FROM (${query}) AS combined_table";
		$total = $wpdb->get_var( $total_query );

		$results = $wpdb->get_results( $query.' ORDER BY id DESC LIMIT '. $offset.', '. $items_per_page, OBJECT );

		$return_array['data'] = array(
			'results' => $results,
			'total_records' => $total,
			'items_per_page' => $items_per_page,
			'page' => $page,
		);

		return $return_array;
	}
	public function buscar_garantia($id_garantia) 
	{
		global $wpdb;
		$table_name = $wpdb->prefix . 'garantias_ra';

		$sql = "SELECT * FROM $table_name WHERE id = ".$id_garantia;
		
		$result = $wpdb->get_row( $sql, OBJECT );

		if( is_object( $result ) && ! empty( $result ) ) {
			return $result;
		}

		return '';
	}
	public function add_garantia() {
		$fecha_garantia = sanitize_text_field( $_POST['fecha_garantia'] );

		if(empty($fecha_garantia)) 
		{
			echo json_encode( array( 'success' => false, 'msg' => 'Por favor ingrese una fecha válida' ) );
			wp_die();
		}

		if(isset($_POST['garantia_id']) && !empty($_POST['garantia_id'])) 
		{
			$garantia_id = intval($_POST['garantia_id']);
			$garantia_id = $this->update_garantia($garantia_id);

			echo json_encode( array(
				'success' => true,
				'msg' => esc_html__("Successfully updated!", 'houzez-crm')
			));
			wp_die();

		} 
		else 
		{		
			$save_garantia = $this->save_garantia();
			if ($save_garantia) 
			{
				echo json_encode( array( 'success' => true, 'msg' => esc_html__('Successfully added!', 'houzez-crm') ) );
					wp_die();
			}
		}
	}

	public function update_garantia($garantia_id) {

		global $wpdb;

		$fecha_garantia = '';
		if ( isset( $_POST['fecha_garantia'] ) ) 
		{
			$fecha_garantia = sanitize_text_field( $_POST['fecha_garantia'] );
		}

		$ubicacion_inmueble = '';
		if ( isset( $_POST['ubicacion_inmueble'] ) ) 
		{
			$ubicacion_inmueble = sanitize_text_field( $_POST['ubicacion_inmueble'] );
		}

		$nombre_cliente = '';
		if ( isset( $_POST['nombre_cliente'] ) ) 
		{
			$nombre_cliente = sanitize_text_field( $_POST['nombre_cliente'] );
		}

		$tipo_propiedad = 'tipo_propiedad';
		if ( isset( $_POST['tipo_propiedad'] ) ) 
		{
			$tipo_propiedad = sanitize_text_field( $_POST['tipo_propiedad'] );
		}

		$seguro = '';
		if ( isset( $_POST['seguro'] ) ) 
		{
			$seguro = sanitize_text_field( $_POST['seguro'] );
		}

		$estado_laboral = 'estado_laboral';
		if ( isset( $_POST['estado_laboral'] ) ) 
		{
			$estado_laboral = sanitize_text_field( $_POST['estado_laboral'] );
		}

		$email = 'email';
		if ( isset( $_POST['email'] ) ) 
		{
			$email = sanitize_text_field( $_POST['email'] );
		}

		$data_table        = $wpdb->prefix . 'garantias_ra';
		$data = array(
			'fecha_garantia'    	=> $fecha_garantia,
			'ubicacion_inmueble'	=> $ubicacion_inmueble,
			'nombre_cliente' 		=> $nombre_cliente,
			'tipo_propiedad' 		=> $tipo_propiedad,
			'seguro' 				=> $seguro,
			'estado_laboral' 		=> $estado_laboral,
			'email' 				=> $email
		);

		$format = array(
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s'
		);

		$where = array(
			'id' => $garantia_id
		);

		$where_format = array(
			'%d'
		);

		$updated = $wpdb->update( $data_table, $data, $where, $format, $where_format );

		if ( false === $updated ) 
		{
			return false;
		} 
		else 
		{
			return true;
		}
	}
	public function save_garantia() 
	{
		global $wpdb;

		$fecha_garantia = '';
		if ( isset( $_POST['fecha_garantia'] ) ) 
		{
			$fecha_garantia = sanitize_text_field( $_POST['fecha_garantia'] );
		}

		$ubicacion_inmueble = '';
		if ( isset( $_POST['ubicacion_inmueble'] ) ) 
		{
			$ubicacion_inmueble = sanitize_text_field( $_POST['ubicacion_inmueble'] );
		}

		$nombre_cliente = '';
		if ( isset( $_POST['nombre_cliente'] ) ) 
		{
			$nombre_cliente = sanitize_text_field( $_POST['nombre_cliente'] );
		}

		$tipo_propiedad = '';
		if ( isset( $_POST['tipo_propiedad'] ) ) 
		{
			$tipo_propiedad = sanitize_text_field( $_POST['tipo_propiedad'] );
		}

		$seguro = '';
		if ( isset( $_POST['seguro'] ) ) 
		{
			$seguro = sanitize_text_field( $_POST['seguro'] );
		}

		$estado_laboral = '';
		if ( isset( $_POST['estado_laboral'] ) ) 
		{
			$estado_laboral = sanitize_text_field( $_POST['estado_laboral'] );
		}

		$email = '';
		if ( isset( $_POST['email'] ) ) 
		{
			$email = sanitize_text_field( $_POST['email'] );
		}

		$ultimos_recibos_sueldos = '';
		$foto_cedula_identidad = '';
		$ultimo_recibo_cobro_oficial_caja = '';
		$certificado_ingresos = '';
		$declaracion_jurada_dgi = '';
		$certificado_bps = '';
		$certificado_dgi = '';
		$certificado_cippu_caja_notaria = '';
		$tarjeta_rut = '';
		$contrato_social = '';
		$constancia_domicilio = '';
		$recibo_sueldo = '';

		if( isset($_POST['action']) && $_POST['action'] == 'crm_add_new_garantia' ) 
		{
			$user_id = get_current_user_id();
		}
	
		$data_table        = $wpdb->prefix . 'garantias_ra';
		$data = array(
			'user_id'       					=> $user_id,
			'fecha_garantia'    				=> $fecha_garantia,
			'ubicacion_inmueble'				=> $ubicacion_inmueble,
			'nombre_cliente' 					=> $nombre_cliente,
			'tipo_propiedad' 					=> $tipo_propiedad,
			'seguro' 							=> $seguro,
			'estado_laboral' 					=> $estado_laboral,
			'email' 							=> $email,
			'ultimos_recibos_sueldos' 			=> $ultimos_recibos_sueldos,
			'foto_cedula_identidad' 			=> $foto_cedula_identidad,
			'ultimo_recibo_cobro_oficial_caja' 	=> $ultimo_recibo_cobro_oficial_caja,
			'certificado_ingresos' 				=> $certificado_ingresos,
			'declaracion_jurada_dgi' 			=> $declaracion_jurada_dgi,
			'certificado_bps' 					=> $certificado_bps,
			'certificado_dgi' 					=> $certificado_dgi,
			'certificado_cippu_caja_notaria' 	=> $certificado_cippu_caja_notaria,
			'tarjeta_rut' 						=> $tarjeta_rut,
			'contrato_social' 					=> $contrato_social,
			'constancia_domicilio' 				=> $constancia_domicilio,
			'recibo_sueldo' 					=> $recibo_sueldo
		);

		$format = array(
			'%d',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s',
			'%s'
		);

		$wpdb->insert($data_table, $data, $format);
		$inserted_id = $wpdb->insert_id;

		$this->agregar_adjuntos($inserted_id);

		return $inserted_id;
	}
	public function get_single_garantia() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'garantias_ra';
		
		$garantia_id = '';
		if ( isset( $_POST['garantia_id'] ) ) {
			$garantia_id = intval( $_POST['garantia_id'] );
		}

		if(empty($garantia_id)) {
			echo json_encode( 
				array( 
					'success' => false, 
					'msg' => esc_html__('Something went wrong!', 'houzez-crm') 
				) 
			);
			wp_die();
		}
		
		$sql = "SELECT * FROM {$table_name} WHERE id = {$garantia_id}";

		$result = $wpdb->get_row( $sql, OBJECT );

		if( is_object( $result ) && ! empty( $result ) ) 
		{
			$tabla_adjuntos = $wpdb->prefix . 'garantias_meta_ra';

			$query_adjuntos = 'SELECT * FROM {$tabla_adjuntos}';
			$total_query_adjuntos = "SELECT COUNT(1) FROM (${query_adjuntos}) AS combined_table";
			$total_adjuntos = $wpdb->get_var( $total_query_adjuntos );

			// if ($total_adjuntos > 0):
				$adjuntosGarantias = $wpdb->get_results( $query_adjuntos, ARRAY_A );
				$jsonAdjuntos = json_encode($adjuntosGarantias, JSON_FORCE_OBJECT);
			/* else:
				$jsonAdjuntos = null;
			endif;
			*/
			echo json_encode( 
				array( 
					'success' 			=> true, 
					'data' 				=> $result,
					'adjuntos' 			=> $jsonAdjuntos,
					'garantia_id' 		=> $garantia_id,
					'total_adjuntos' 	=> $total_adjuntos,
					'tabla_adjuntos' 	=> $tabla_adjuntos
				) 
			);
			wp_die();
		}
		return '';
		
	}
	public function delete_garantia() 
	{
		global $wpdb;

		$table_name = $wpdb->prefix . 'garantias_ra';

		if ( !isset( $_REQUEST['ids'] ) ) {
			$ajax_response = array( 'success' => false , 'reason' => 'No se seleccionaron garantías' );
			echo json_encode( $ajax_response );
			die;
		}
		$ids = $_REQUEST['ids'];
		
		$wpdb->query("DELETE FROM {$table_name} WHERE id IN ($ids)");
		$ajax_response = array( 'success' => true , 'reason' => '' );
		echo json_encode( $ajax_response );
		die;
	}
	public function agregar_adjuntos($id_garantia = null) 
	{
		if( isset( $_POST['propperty_attachment_ids'] ) ) 
		{
			$property_attach_ids = array();
			foreach ($_POST['propperty_attachment_ids'] as $prop_atch_id ) {
				$property_attach_ids[] = intval( $prop_atch_id );
				$this->guardar_adjunto($id_garantia, 'fave_attachments', $prop_atch_id);
			}
		}
		return;
	}

	public function guardar_adjunto($id_garantia, $descripcion, $idPostAdjunto)
	{
		global $wpdb;
		$data_table = $wpdb->prefix . 'garantias_meta_ra';
		$data = 
			array(
			'garantia_id'	=> $id_garantia,
			'descripcion'   => $descripcion,
			'valor'    		=> $idPostAdjunto
			);

		$format = array(
			'%d',
			'%s',
			'%s',
		);

		$wpdb->insert($data_table, $data, $format);

		return;
	}
}