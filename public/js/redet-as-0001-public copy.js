(function( $ ) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

	var ajaxurl = Houzez_crm_vars_redet_as.ajax_url;
    var delete_confirmation = Houzez_crm_vars_redet_as.delete_confirmation;
	var processing_text = Houzez_crm_vars_redet_as.processing_text;
	var confirm_btn_text = Houzez_crm_vars_redet_as.confirm_btn_text;
    var cancel_btn_text = Houzez_crm_vars_redet_as.cancel_btn_text;
	var verify_nonce = Houzez_crm_vars_redet_as.verify_nonce;
	var verify_file_type = Houzez_crm_vars_redet_as.verify_file_type;
	var attachment_max_file_size = Houzez_crm_vars_redet_as.attachment_max_file_size;
	var max_prop_attachments = Houzez_crm_vars_redet_as.max_prop_attachments;

	var crm_processing_modal = function ( msg ) {
        var process_modal ='<div class="modal fade" id="fave_modal" tabindex="-1" role="dialog" aria-labelledby="faveModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-body houzez_messages_modal">'+msg+'</div></div></div></div></div>';
        jQuery('body').append(process_modal);
        jQuery('#fave_modal').modal();
    }

    var crm_processing_modal_close = function ( ) {
        jQuery('#fave_modal').modal('hide');
    }
	var execute_muticheck = false;

	var registrar_adjunto = function(id_adjunto, nombre_adjunto, id_post_adjunto, clase_adjunto)
	{
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: ajaxurl,
			data: 
			{
				'action' : 'registrar_adjuntos',
				'id_adjunto' : id_adjunto,
				'nombre_adjunto' : nombre_adjunto,
				'id_post_adjunto' : id_post_adjunto,
				'clase_adjunto' : clase_adjunto
			},
			success: function(data) {
				if ( data.success == true ) {
					console.log('Se registró el adjunto '+data.id_adjunto);
				} else {
					console.log('No se pudo registrar el adjunto')
				}
			},
			error: function(errorThrown) {
				console.log('Error');
			}
		});
	}

    $(document).ready(function () {

    /*--------------------------------------------------------------------------
     *  Delete property
     * -------------------------------------------------------------------------*/
    $( 'a.delete-lead-redet-as' ).on( 'click', function (){
		var $this = $( this );
		var ID = $this.data('id');
		var Nonce = $this.data('nonce');

		bootbox.confirm({
		message: "<strong>"+delete_confirmation+"</strong>",
		buttons: {
			confirm: {
				label: confirm_btn_text,
				className: 'btn btn-primary'
			},
			cancel: {
				label: cancel_btn_text,
				className: 'btn btn-grey-outlined'
			}
		},
		callback: function (result) {
			if(result==true) {
				crm_processing_modal( processing_text );

				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: ajaxurl,
					data: {
						'action': 'houzez_delete_lead_redet_as',
						'lead_id': ID,
						'security': Nonce
					},
					success: function(data) {
						if ( data.success == true ) {
							window.location.reload();
						} else {
							jQuery('#fave_modal').modal('hide');
							alert( data.msg );
						}
					},
					error: function(errorThrown) {
						alert('Error');
					}
				}); // $.ajax
			} // result
		} // Callback
	});

	return false;
	
	});

	/*-------------------------------------------------------------------
	* Add Lead Redet As
	*------------------------------------------------------------------*/
	$('#add_new_lead_redet_as').on('click', function(e) {
		e.preventDefault();

		var $form = $('#lead-form');
		var $this = $(this);
		var $messages = $('#lead-msgs');

		$.ajax({
			type: 'post',
			url: ajaxurl,
			dataType: 'json',
			data: $form.serialize(),
			beforeSend: function( ) {
				$this.find('.houzez-loader-js').addClass('loader-show');
			},
			complete: function(){
				$this.find('.houzez-loader-js').removeClass('loader-show');
			},
			success: function( response ) {
				if( response.success ) {
					$messages.empty().append('<div class="alert alert-success" role="alert">'+ response.msg +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>');
					window.location.reload();
				} else {
					$messages.empty().append('<div class="alert alert-danger" role="alert">'+ response.msg +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>');
				}
			},
			error: function(xhr, status, error) {
				$messages.empty().append('<div class="alert alert-danger" role="alert">Error en wp-ajax<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>');
				console.log('Error en wp-ajax');
			}
		})
	});

	/*-------------------------------------------------------------------
	* Edit Lead Redet As
	*------------------------------------------------------------------*/

	$('.edit-lead-redet-as').on('click', function(e) {
		e.preventDefault();

		var $form = $('#lead-form');
		var lead_id = $(this).data('id');

		$.ajax({
			type: 'post',
			url: ajaxurl,
			dataType: 'json',
			data: {
				'action': 'get_single_lead',
				'lead_id': lead_id
			},
			beforeSend: function( ) {
				$('#lead_id').remove();
				$('.houzez-overlay-loading').show();
			},
			complete: function(){
				$('.houzez-overlay-loading').hide();
			},
			success: function( response ) {
				if( response.success ) {
					var res = response.data;

					$('#name').val(res.display_name);
					$('#first_name').val(res.first_name);
					$('#last_name').val(res.last_name);
					$('#prefix').val(res.prefix).attr("selected", "selected");
					$('#user_type').val(res.type);
					$('#email').val(res.email);
					$('#mobile').val(res.mobile);
					$('#home_phone').val(res.home_phone);
					$('#work_phone').val(res.work_phone);
					$('#address').val(res.address);
					$('#country').val(res.country);
					$('#city').val(res.city);
					$('#state').val(res.state);
					$('#zip').val(res.zip);
					$('#source').val(res.source).attr("selected", "selected");
					$('#facebook').val(res.facebook_url);
					$('#twitter').val(res.twitter_url);
					$('#linkedin').val(res.linkedin_url);
					$('#private_note').val(res.private_note);
					$('#agente_prospecto').val(res.user_id).attr("selected", "selected");

					$form.append('<input type="hidden" id="lead_id" name="lead_id" value="'+res.lead_id+'">');

					$form.find('.selectpicker').selectpicker('refresh');
				}
			},
			error: function(xhr, status, error) {
				var err = eval("(" + xhr.responseText + ")");
				console.log(err.Message);
			}
		})
	});	
    /* ------------------------------------------------------------------------ */
    /* dashboard slide panel
    /* ------------------------------------------------------------------------ */
    $('.open-close-slide-panel-ra').on('click', function (e) 
    {
		var $form = $('#lead-form');
		$('#name').val('');
		$('#first_name').val('');
		$('#last_name').val('');
		$('#prefix').val('').attr("selected", "selected");
		$('#user_type').val('');
		$('#email').val('');
		$('#mobile').val('');
		$('#home_phone').val('');
		$('#work_phone').val('');
		$('#address').val('');
		$('#country').val('');
		$('#city').val('');
		$('#state').val('');
		$('#zip').val('');
		$('#source').val('').attr("selected", "selected");
		$('#facebook').val('');
		$('#twitter').val('');
		$('#linkedin').val('');
		$('#private_note').val('');
		$('#agente_prospecto').val('').attr("selected", "selected");

		if ($("#lead_id").length > 0) 
		{
			$("#lead_id").remove();
		}

		$form.find('.selectpicker').selectpicker('refresh');

        $('.dashboard-slide-panel-wrap').toggleClass('dashboard-slide-panel-wrap-visible');
        $('.main-wrap').toggleClass('opacity-02');
    });

	$('.open-close-garantia-panel').on('click', function (e) {
		if ($("#panel-garantia").hasClass('nover') == false)
        {
            $("#panel-garantia").addClass('nover');
        }
		else
		{
			$('#panel-garantia').removeClass('nover');
		}
		$('.garantia-panel-js').toggleClass('dashboard-slide-panel-wrap-visible');
        $('.main-wrap').toggleClass('opacity-02');
    });

	$('.open-close-informe-panel').on('click', function (e) {
		if ($("#panel-informe").hasClass('nover') == false)
        {
            $("#panel-informe").addClass('nover');
        }
		else
		{
			$('#panel-informe').removeClass('nover');
		}
		$('.informe-panel-js').toggleClass('dashboard-slide-panel-wrap-visible');
        $('.main-wrap').toggleClass('opacity-02');
    });


	$('.open-close-nover').on('click', function (e) {
		if ($("#panel-garantia").hasClass('nover') == false)
        {
            $("#panel-garantia").addClass('nover');
        }
		else
		{
			$('#panel-garantia').removeClass('nover');
		}
    });

	$('.open-close-nover-informe').on('click', function (e) {
		if ($("#panel-informe").hasClass('nover') == false)
        {
            $("#panel-informe").addClass('nover');
        }
		else
		{
			$('#panel-informe').removeClass('nover');
		}
    });

	$('.open-close-garantia-js').on('click', function (e) {
		if ($("#panel-garantia").hasClass('nover') == false)
        {
            $("#panel-garantia").addClass('nover');
        }
		else
		{
			$('#panel-garantia').removeClass('nover');
		}
    });

	$('.open-close-informe-js').on('click', function (e) {
		if ($("#panel-informe").hasClass('nover') == false)
        {
            $("#panel-informe").addClass('nover');
        }
		else
		{
			$('#panel-informe').removeClass('nover');
		}
    });

	/*-------------------------------------------------------------------
    * Agregar garantía
    *------------------------------------------------------------------*/
	$('#add_new_garantia').on('click', function() {

		var $form = $('#garantia-form');
		var $this = $(this);
		var $messages = $('#garantia-msgs');

		$.ajax({
			type: 'post',
			url: ajaxurl,
			dataType: 'json',
			data: $form.serialize(),
			beforeSend: function( ) {
				$this.find('.houzez-loader-js').addClass('loader-show');
			},
			complete: function(){
				$this.find('.houzez-loader-js').removeClass('loader-show');
			},
			success: function( response ) {
				if( response.success ) {
					$messages.empty().append('<div class="alert alert-success" role="alert">'+ response.msg +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>');
					window.location.reload();
				} else {
					$messages.empty().append('<div class="alert alert-danger" role="alert">'+ response.msg +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>');
				}
			},
			error: function(xhr, status, error) 
			{
				console.log("Error en la función add_garantia");
			}
		})

	});

	/*-------------------------------------------------------------------
    * Agregar informe
    *------------------------------------------------------------------*/
	$('#add_new_informe').on('click', function() {

		var $form = $('#informe-form');
		var $this = $(this);
		var $messages = $('#informe-msgs');

		$.ajax({
			type: 'post',
			url: ajaxurl,
			dataType: 'json',
			data: $form.serialize(),
			beforeSend: function( ) {
				$this.find('.houzez-loader-js').addClass('loader-show');
			},
			complete: function(){
				$this.find('.houzez-loader-js').removeClass('loader-show');
			},
			success: function( response ) {
				if( response.success ) {
					$messages.empty().append('<div class="alert alert-success" role="alert">'+ response.msg +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>');
					window.location.reload();
				} else {
					$messages.empty().append('<div class="alert alert-danger" role="alert">'+ response.msg +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>');
				}
			},
			error: function(xhr, status, error) 
			{
				console.log("Error en la función add_informe");
			}
		})

	});

    /*-------------------------------------------------------------------
    * Editar garantía
    *------------------------------------------------------------------*/
	$('.edit_garantia_js').on('click', function(e) {
		e.preventDefault();
	
		var $form = $('#garantia-form');
		var garantia_id = $(this).data('id');

		$('#titulo_formulario_garantia').html('Editar garantía');

		$.ajax({
			type: 'post',
			url: ajaxurl,
			dataType: 'json',
			data: {
				'action': 'get_single_garantia',
				'garantia_id': garantia_id
			},
			beforeSend: function( ) {
				$('#garantia_id').remove();
				$('.houzez-overlay-loading').show();
			},
			complete: function(){
				$('.houzez-overlay-loading').hide();
			},
			success: function( response ) {
				if( response.success ) {
					var res = response.data;
					$('#fecha_garantia').val(res.fecha_garantia);
					$('#ubicacion_inmueble').val(res.ubicacion_inmueble);
					$('#nombre_cliente').val(res.nombre_cliente);
					$('#nombre_propietario').val(res.nombre_propietario);
					$('#propiedad_id').val(res.propiedad_id);
					$('#seguro').val(res.seguro);
					$('#estado_laboral').val(res.estado_laboral);
					$('#user_id').val(res.user_id);
					$('#estatus_garantia').val(res.estatus_garantia);
					$('#tipo_formulario').val('Editar');
					$('#comentarios_administrador').val(res.comentarios_administrador);
					
					var fila_adjunto = '';
					var descripcion_anterior = '';
					var contador_td = 0;
					$.each(response.adjuntos, function(key, value) 
                    {
						if (contador_td == 0)
						{
							descripcion_anterior = value.descripcion;
						}
						contador_td++;
						if (descripcion_anterior != value.descripcion)
						{
							document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
							descripcion_anterior = value.descripcion;
							fila_adjunto = '';
						}
						fila_adjunto += 
						'<tr class="attach-thumb">'+
						'<td class="table-full-width table-cell-title">'+
						'<span>'+value.nombre+'</span>'+
						'</td>'+
						'<td>'+
						'<a href="'+value.url+'" target="_blank" class="btn btn-light-grey-outlined"><i class="houzez-icon icon-download-bottom"></i></a>'+
						'</td>'+
						'<td>'+
						'<button data-attach-id="' + 0 + '"  data-attachment-id="' + value.id_post + '" data-clase-adjunto="garantia" class="attachment-delete btn btn-light-grey-outlined"><i class="houzez-icon icon-close"></i></button>'+
						'</td>'+
						'<input type="hidden" class="propperty-attach-id" name="'+value.descripcion+'_ids[]" value="'+value.id_post+'"/>'+
						'</tr>';
					});

					if (fila_adjunto != '')
					{					
						document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
					}
					
					propertyAttachmentEvents_ra();
					
					$form.append('<input type="hidden" id="garantia_id" name="garantia_id" class="garantia_id" value="'+res.id+'">');

					$form.find('.selectpicker').selectpicker('refresh');
				}
			},
			error: function(xhr, status, error) {
				var err = eval("(" + xhr.responseText + ")");
				console.log(err.Message);
			}
		}) 
	});

    /*-------------------------------------------------------------------
    * Editar informe
    *------------------------------------------------------------------*/
	$('.edit_informe_js').on('click', function(e) {
		e.preventDefault();
	
		var $form = $('#informe-form');
		var informe_id = $(this).data('id');

		$('#titulo_formulario_informe').html('Editar informe');

		$.ajax({
			type: 'post',
			url: ajaxurl,
			dataType: 'json',
			data: {
				'action': 'get_single_informe',
				'informe_id': informe_id
			},
			beforeSend: function( ) {
				$('#informe_id').remove();
				$('.houzez-overlay-loading').show();
			},
			complete: function(){
				$('.houzez-overlay-loading').hide();
			},
			success: function( response ) {
				if( response.success ) {
					var res = response.data;
					$('#user_id').val(res.user_id);
					$('#fecha_informe').val(res.fecha_informe);
					$('#ubicacion_inmueble').val(res.ubicacion_inmueble);
					$('#nombre_cliente').val(res.nombre_cliente);
					$('#tipo_propiedad').val(res.tipo_propiedad);
					$('#nombre_referencia_propiedad').val(res.nombre_referencia_propiedad);
					$('#numero_padron').val(res.numero_padron);
					$('#m2_totales').val(res.m2_totales);
					$('#m2_edificados').val(res.m2_edificados);
					$('#numero_dormitorios').val(res.numero_dormitorios);
					$('#numero_banos').val(res.numero_banos);
					$('#contribucion').val(res.contribucion);
					$('#primaria').val(res.primaria);
					$('#orientacion').val(res.orientacion);
					$('#gastos_comunes').val(res.gastos_comunes);
					$('#precio_tentativo_propietario').val(res.precio_tentativo_propietario);
					$('#estado_general').val(res.estado_general);
					$('#caracteristicas_generales').val(res.caracteristicas_generales);
					$('#configuracion_planta_baja').val(res.configuracion_planta_baja);
					$('#configuracion_planta_alta').val(res.configuracion_planta_alta);
					if (res.planos_al_dia == 'Sí')
					{
						$('#planos_al_dia_1').attr('checked', true);
					}
					else
					{
						$('#planos_al_dia_2').attr('checked', true);
					}
					if (res.acepta_banco == 'Sí')
					{
						$('#acepta_banco_1').attr('checked', true);
					}
					else
					{
						$('#acepta_banco_2').attr('checked', true);
					}
					if (res.hubo_oferta == 'Sí')
					{
						$('#hubo_oferta_1').attr('checked', true);
					}
					else
					{
						$('#hubo_oferta_2').attr('checked', true);
					}

					$('#de_cuanto').val(res.de_cuanto);

					if (res.vende_para_comprar == 'Sí')
					{
						$('#vende_para_comprar_1').attr('checked', true);
					}
					else
					{
						$('#vende_para_comprar_2').attr('checked', true);
					}

					$('#comentarios_agente').val(res.comentarios_agente);
					$('#comentarios_administrador').val(res.comentarios_administrador);
					$('#estatus_informe').val(res.estatus_informe);
					$('#tipo_formulario').val('Editar');
					
					var fila_adjunto = '';
					var descripcion_anterior = '';
					var contador_td = 0;
					$.each(response.adjuntos, function(key, value) 
                    {
						if (contador_td == 0)
						{
							descripcion_anterior = value.descripcion;
						}
						contador_td++;
						if (descripcion_anterior != value.descripcion)
						{
							document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
							descripcion_anterior = value.descripcion;
							fila_adjunto = '';
						}
						fila_adjunto += 
						'<tr class="attach-thumb">'+
						'<td class="table-full-width table-cell-title">'+
						'<span>'+value.nombre+'</span>'+
						'</td>'+
						'<td>'+
						'<a href="'+value.url+'" target="_blank" class="btn btn-light-grey-outlined"><i class="houzez-icon icon-download-bottom"></i></a>'+
						'</td>'+
						'<td>'+
						'<button data-attach-id="' + 0 + '"  data-attachment-id="' + value.id_post + '" data-clase-adjunto="informe"  class="attachment-delete btn btn-light-grey-outlined"><i class="houzez-icon icon-close"></i></button>'+
						'</td>'+
						'<input type="hidden" class="propperty-attach-id" name="'+value.descripcion+'_ids[]" value="'+value.id_post+'"/>'+
						'</tr>';
					});

					if (fila_adjunto != '')
					{					
						document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
					}
					
					propertyAttachmentEvents_ra();
					
					$form.append('<input type="hidden" id="informe_id" name="informe_id" class="informe_id" value="'+res.id+'">');

					$form.find('.selectpicker').selectpicker('refresh');
				}
			},
			error: function(xhr, status, error) {
				var err = eval("(" + xhr.responseText + ")");
				console.log(err.Message);
			}
		}) 
	});

	$('.aprobar_garantia_js').on('click', function(e) {
		e.preventDefault();
	
		var $form = $('#garantia-form');
		var garantia_id = $(this).data('id');

		$('#titulo_formulario_garantia').html('Aprobar garantía');

		$.ajax({
			type: 'post',
			url: ajaxurl,
			dataType: 'json',
			data: {
				'action': 'get_single_garantia',
				'garantia_id': garantia_id
			},
			beforeSend: function( ) {
				$('#garantia_id').remove();
				$('.houzez-overlay-loading').show();
			},
			complete: function(){
				$('.houzez-overlay-loading').hide();
			},
			success: function( response ) {
				if( response.success ) {
					var res = response.data;
					$('#fecha_garantia').val(res.fecha_garantia);
					$('#ubicacion_inmueble').val(res.ubicacion_inmueble);
					$('#nombre_cliente').val(res.nombre_cliente);
					$('#nombre_propietario').val(res.nombre_propietario);
					$('#propiedad_id').val(res.propiedad_id);
					$('#seguro').val(res.seguro);
					$('#estado_laboral').val(res.estado_laboral);
					$('#user_id').val(res.user_id);
					$('#estatus_garantia').val("Aprobado");
					$('#tipo_formulario').val('Aprobar');
					$('#comentarios_administrador').val(res.comentarios_administrador);
					
					var fila_adjunto = '';
					var descripcion_anterior = '';
					var contador_td = 0;
					$.each(response.adjuntos, function(key, value) 
                    {
						if (contador_td == 0)
						{
							descripcion_anterior = value.descripcion;
						}
						contador_td++;
						if (descripcion_anterior != value.descripcion)
						{
							document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
							descripcion_anterior = value.descripcion;
							fila_adjunto = '';
						}
						fila_adjunto += 
						'<tr class="attach-thumb">'+
						'<td class="table-full-width table-cell-title">'+
						'<span>'+value.nombre+'</span>'+
						'</td>'+
						'<td>'+
						'<a href="'+value.url+'" target="_blank" class="btn btn-light-grey-outlined"><i class="houzez-icon icon-download-bottom"></i></a>'+
						'</td>'+
						'<td>'+
						'<button data-attach-id="' + 0 + '"  data-attachment-id="' + value.id_post + '" data-clase-adjunto="garantia"  class="attachment-delete btn btn-light-grey-outlined"><i class="houzez-icon icon-close"></i></button>'+
						'</td>'+
						'<input type="hidden" class="propperty-attach-id" name="'+value.descripcion+'_ids[]" value="'+value.id_post+'"/>'+
						'</tr>';
					});

					if (fila_adjunto != '')
					{					
						document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
					}
					
					propertyAttachmentEvents_ra();

					$('#formulario_edit').addClass('nover');
					$('#formulario_comentarios_agente').addClass('nover');
					$('#formulario_aprobacion').removeClass('nover');
				
					$form.append('<input type="hidden" id="garantia_id" name="garantia_id" class="garantia_id" value="'+res.id+'">');

					$form.find('.selectpicker').selectpicker('refresh');
				}
			},
			error: function(xhr, status, error) {
				var err = eval("(" + xhr.responseText + ")");
				console.log(err.Message);
			}
		}) 
	});

    /*-------------------------------------------------------------------
    * Aprobar informe
    *------------------------------------------------------------------*/
	$('.aprobar_informe_js').on('click', function(e) {
		e.preventDefault();
	
		var $form = $('#informe-form');
		var informe_id = $(this).data('id');

		$('#titulo_formulario_informe').html('Aprobar informe');

		$.ajax({
			type: 'post',
			url: ajaxurl,
			dataType: 'json',
			data: {
				'action': 'get_single_informe',
				'informe_id': informe_id
			},
			beforeSend: function( ) {
				$('#informe_id').remove();
				$('.houzez-overlay-loading').show();
			},
			complete: function(){
				$('.houzez-overlay-loading').hide();
			},
			success: function( response ) {
				if( response.success ) {
					var res = response.data;
					$('#user_id').val(res.user_id);
					$('#fecha_informe').val(res.fecha_informe);
					$('#ubicacion_inmueble').val(res.ubicacion_inmueble);
					$('#nombre_cliente').val(res.nombre_cliente);
					$('#tipo_propiedad').val(res.tipo_propiedad);
					$('#nombre_referencia_propiedad').val(res.nombre_referencia_propiedad);
					$('#numero_padron').val(res.numero_padron);
					$('#m2_totales').val(res.m2_totales);
					$('#m2_edificados').val(res.m2_edificados);
					$('#numero_dormitorios').val(res.numero_dormitorios);
					$('#numero_banos').val(res.numero_banos);
					$('#contribucion').val(res.contribucion);
					$('#primaria').val(res.primaria);
					$('#orientacion').val(res.orientacion);
					$('#gastos_comunes').val(res.gastos_comunes);
					$('#precio_tentativo_propietario').val(res.precio_tentativo_propietario);
					$('#estado_general').val(res.estado_general);
					$('#caracteristicas_generales').val(res.caracteristicas_generales);
					$('#configuracion_planta_baja').val(res.configuracion_planta_baja);
					$('#configuracion_planta_alta').val(res.configuracion_planta_alta);
					if (res.planos_al_dia == 'Sí')
					{
						$('#planos_al_dia_1').attr('checked', true);
					}
					else
					{
						$('#planos_al_dia_2').attr('checked', true);
					}
					if (res.acepta_banco == 'Sí')
					{
						$('#acepta_banco_1').attr('checked', true);
					}
					else
					{
						$('#acepta_banco_2').attr('checked', true);
					}
					if (res.hubo_oferta == 'Sí')
					{
						$('#hubo_oferta_1').attr('checked', true);
					}
					else
					{
						$('#hubo_oferta_2').attr('checked', true);
					}

					$('#de_cuanto').val(res.de_cuanto);

					if (res.vende_para_comprar == 'Sí')
					{
						$('#vende_para_comprar_1').attr('checked', true);
					}
					else
					{
						$('#vende_para_comprar_2').attr('checked', true);
					}

					$('#comentarios_agente').val(res.comentarios_agente);
					$('#comentarios_administrador').val(res.comentarios_administrador);
					$('#estatus_informe').val('Aprobado');
					$('#tipo_formulario').val('Aprobar');
					
					var fila_adjunto = '';
					var descripcion_anterior = '';
					var contador_td = 0;
					$.each(response.adjuntos, function(key, value) 
                    {
						if (contador_td == 0)
						{
							descripcion_anterior = value.descripcion;
						}
						contador_td++;
						if (descripcion_anterior != value.descripcion)
						{
							document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
							descripcion_anterior = value.descripcion;
							fila_adjunto = '';
						}
						fila_adjunto += 
						'<tr class="attach-thumb">'+
						'<td class="table-full-width table-cell-title">'+
						'<span>'+value.nombre+'</span>'+
						'</td>'+
						'<td>'+
						'<a href="'+value.url+'" target="_blank" class="btn btn-light-grey-outlined"><i class="houzez-icon icon-download-bottom"></i></a>'+
						'</td>'+
						'<td>'+
						'<button data-attach-id="' + 0 + '"  data-attachment-id="' + value.id_post + '" data-clase-adjunto="informe"  class="attachment-delete btn btn-light-grey-outlined"><i class="houzez-icon icon-close"></i></button>'+
						'</td>'+
						'<input type="hidden" class="propperty-attach-id" name="'+value.descripcion+'_ids[]" value="'+value.id_post+'"/>'+
						'</tr>';
					});

					if (fila_adjunto != '')
					{					
						document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
					}
					
					propertyAttachmentEvents_ra();

					$('#formulario_edit_informe').addClass('nover');
					$('#formulario_comentarios_agente_informe').addClass('nover');
					$('#formulario_aprobacion_informe').removeClass('nover');
					
					$form.append('<input type="hidden" id="informe_id" name="informe_id" class="informe_id" value="'+res.id+'">');

					$form.find('.selectpicker').selectpicker('refresh');
				}
			},
			error: function(xhr, status, error) {
				var err = eval("(" + xhr.responseText + ")");
				console.log(err.Message);
			}
		}) 
	});

	$('.rechazar_garantia_js').on('click', function(e) {
		e.preventDefault();
	
		var $form = $('#garantia-form');
		var garantia_id = $(this).data('id');

		$('#titulo_formulario_garantia').html('Rechazar garantía');

		$.ajax({
			type: 'post',
			url: ajaxurl,
			dataType: 'json',
			data: {
				'action': 'get_single_garantia',
				'garantia_id': garantia_id
			},
			beforeSend: function( ) {
				$('#garantia_id').remove();
				$('.houzez-overlay-loading').show();
			},
			complete: function(){
				$('.houzez-overlay-loading').hide();
			},
			success: function( response ) {
				if( response.success ) {
					var res = response.data;
					$('#fecha_garantia').val(res.fecha_garantia);
					$('#ubicacion_inmueble').val(res.ubicacion_inmueble);
					$('#nombre_cliente').val(res.nombre_cliente);
					$('#nombre_propietario').val(res.nombre_propietario);
					$('#propiedad_id').val(res.propiedad_id);
					$('#seguro').val(res.seguro);
					$('#estado_laboral').val(res.estado_laboral);
					$('#user_id').val(res.user_id);
					$('#estatus_garantia').val("Rechazado");
					$('#tipo_formulario').val('Rechazar');
					$('#comentarios_administrador').val(res.comentarios_administrador);
					
					var fila_adjunto = '';
					var descripcion_anterior = '';
					var contador_td = 0;
					$.each(response.adjuntos, function(key, value) 
                    {
						if (contador_td == 0)
						{
							descripcion_anterior = value.descripcion;
						}
						contador_td++;
						if (descripcion_anterior != value.descripcion)
						{
							document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
							descripcion_anterior = value.descripcion;
							fila_adjunto = '';
						}
						fila_adjunto += 
						'<tr class="attach-thumb">'+
						'<td class="table-full-width table-cell-title">'+
						'<span>'+value.nombre+'</span>'+
						'</td>'+
						'<td>'+
						'<a href="'+value.url+'" target="_blank" class="btn btn-light-grey-outlined"><i class="houzez-icon icon-download-bottom"></i></a>'+
						'</td>'+
						'<td>'+
						'<button data-attach-id="' + 0 + '"  data-attachment-id="' + value.id_post + '" data-clase-adjunto="garantia"  class="attachment-delete btn btn-light-grey-outlined"><i class="houzez-icon icon-close"></i></button>'+
						'</td>'+
						'<input type="hidden" class="propperty-attach-id" name="'+value.descripcion+'_ids[]" value="'+value.id_post+'"/>'+
						'</tr>';
					});

					if (fila_adjunto != '')
					{					
						document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
					}
					
					propertyAttachmentEvents_ra();

					$('#formulario_edit').addClass('nover');
					$('#formulario_comentarios_agente').addClass('nover');
					$('#formulario_aprobacion').removeClass('nover');
					$('#div_adjunto_aprobacion').addClass('nover');
				
					$form.append('<input type="hidden" id="garantia_id" name="garantia_id" class="garantia_id" value="'+res.id+'">');

					$form.find('.selectpicker').selectpicker('refresh');
				}
			},
			error: function(xhr, status, error) {
				var err = eval("(" + xhr.responseText + ")");
				console.log(err.Message);
			}
		}) 
	});

    /*-------------------------------------------------------------------
    * Rechazar informe
    *------------------------------------------------------------------*/
	$('.rechazar_informe_js').on('click', function(e) {
		e.preventDefault();
	
		var $form = $('#informe-form');
		var informe_id = $(this).data('id');

		$('#titulo_formulario_informe').html('Rechazar informe');

		$.ajax({
			type: 'post',
			url: ajaxurl,
			dataType: 'json',
			data: {
				'action': 'get_single_informe',
				'informe_id': informe_id
			},
			beforeSend: function( ) {
				$('#informe_id').remove();
				$('.houzez-overlay-loading').show();
			},
			complete: function(){
				$('.houzez-overlay-loading').hide();
			},
			success: function( response ) {
				if( response.success ) {
					var res = response.data;
					$('#user_id').val(res.user_id);
					$('#fecha_informe').val(res.fecha_informe);
					$('#ubicacion_inmueble').val(res.ubicacion_inmueble);
					$('#nombre_cliente').val(res.nombre_cliente);
					$('#tipo_propiedad').val(res.tipo_propiedad);
					$('#nombre_referencia_propiedad').val(res.nombre_referencia_propiedad);
					$('#numero_padron').val(res.numero_padron);
					$('#m2_totales').val(res.m2_totales);
					$('#m2_edificados').val(res.m2_edificados);
					$('#numero_dormitorios').val(res.numero_dormitorios);
					$('#numero_banos').val(res.numero_banos);
					$('#contribucion').val(res.contribucion);
					$('#primaria').val(res.primaria);
					$('#orientacion').val(res.orientacion);
					$('#gastos_comunes').val(res.gastos_comunes);
					$('#precio_tentativo_propietario').val(res.precio_tentativo_propietario);
					$('#estado_general').val(res.estado_general);
					$('#caracteristicas_generales').val(res.caracteristicas_generales);
					$('#configuracion_planta_baja').val(res.configuracion_planta_baja);
					$('#configuracion_planta_alta').val(res.configuracion_planta_alta);
					if (res.planos_al_dia == 'Sí')
					{
						$('#planos_al_dia_1').attr('checked', true);
					}
					else
					{
						$('#planos_al_dia_2').attr('checked', true);
					}
					if (res.acepta_banco == 'Sí')
					{
						$('#acepta_banco_1').attr('checked', true);
					}
					else
					{
						$('#acepta_banco_2').attr('checked', true);
					}
					if (res.hubo_oferta == 'Sí')
					{
						$('#hubo_oferta_1').attr('checked', true);
					}
					else
					{
						$('#hubo_oferta_2').attr('checked', true);
					}

					$('#de_cuanto').val(res.de_cuanto);

					if (res.vende_para_comprar == 'Sí')
					{
						$('#vende_para_comprar_1').attr('checked', true);
					}
					else
					{
						$('#vende_para_comprar_2').attr('checked', true);
					}

					$('#comentarios_agente').val(res.comentarios_agente);
					$('#comentarios_administrador').val(res.comentarios_administrador);
					$('#estatus_informe').val('Rechazado');
					$('#tipo_formulario').val('Rechazar');
					
					var fila_adjunto = '';
					var descripcion_anterior = '';
					var contador_td = 0;
					$.each(response.adjuntos, function(key, value) 
                    {
						if (contador_td == 0)
						{
							descripcion_anterior = value.descripcion;
						}
						contador_td++;
						if (descripcion_anterior != value.descripcion)
						{
							document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
							descripcion_anterior = value.descripcion;
							fila_adjunto = '';
						}
						fila_adjunto += 
						'<tr class="attach-thumb">'+
						'<td class="table-full-width table-cell-title">'+
						'<span>'+value.nombre+'</span>'+
						'</td>'+
						'<td>'+
						'<a href="'+value.url+'" target="_blank" class="btn btn-light-grey-outlined"><i class="houzez-icon icon-download-bottom"></i></a>'+
						'</td>'+
						'<td>'+
						'<button data-attach-id="' + 0 + '"  data-attachment-id="' + value.id_post + '" data-clase-adjunto="informe"  class="attachment-delete btn btn-light-grey-outlined"><i class="houzez-icon icon-close"></i></button>'+
						'</td>'+
						'<input type="hidden" class="propperty-attach-id" name="'+value.descripcion+'_ids[]" value="'+value.id_post+'"/>'+
						'</tr>';
					});

					if (fila_adjunto != '')
					{					
						document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
					}
					
					propertyAttachmentEvents_ra();

					$('#formulario_edit_informe').addClass('nover');
					$('#formulario_comentarios_agente_informe').addClass('nover');
					$('#formulario_aprobacion_informe').removeClass('nover');
					$('#div_adjunto_aprobacion_informe').addClass('nover');
					
					$form.append('<input type="hidden" id="informe_id" name="informe_id" class="informe_id" value="'+res.id+'">');

					$form.find('.selectpicker').selectpicker('refresh');
				}
			},
			error: function(xhr, status, error) {
				var err = eval("(" + xhr.responseText + ")");
				console.log(err.Message);
			}
		}) 
	});

	$('.reenviar_garantia_js').on('click', function(e) {
		e.preventDefault();
	
		var $form = $('#garantia-form');
		var garantia_id = $(this).data('id');

		$('#titulo_formulario_garantia').html('Reenviar garantía');

		$.ajax({
			type: 'post',
			url: ajaxurl,
			dataType: 'json',
			data: {
				'action': 'get_single_garantia',
				'garantia_id': garantia_id
			},
			beforeSend: function( ) {
				$('#garantia_id').remove();
				$('.houzez-overlay-loading').show();
			},
			complete: function(){
				$('.houzez-overlay-loading').hide();
			},
			success: function( response ) {
				if( response.success ) {
					var res = response.data;
					$('#fecha_garantia').val(res.fecha_garantia);
					$('#ubicacion_inmueble').val(res.ubicacion_inmueble);
					$('#nombre_cliente').val(res.nombre_cliente);
					$('#nombre_propietario').val(res.nombre_propietario);
					$('#propiedad_id').val(res.propiedad_id);
					$('#seguro').val(res.seguro);
					$('#estado_laboral').val(res.estado_laboral);
					$('#user_id').val(res.user_id);
					$('#estatus_garantia').val("Reenviado");
					$('#tipo_formulario').val('Reenviar');
					$('#comentarios_administrador').val(res.comentarios_administrador);
					
					var fila_adjunto = '';
					var descripcion_anterior = '';
					var contador_td = 0;
					$.each(response.adjuntos, function(key, value) 
                    {
						if (contador_td == 0)
						{
							descripcion_anterior = value.descripcion;
						}
						contador_td++;
						if (descripcion_anterior != value.descripcion)
						{
							document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
							descripcion_anterior = value.descripcion;
							fila_adjunto = '';
						}
						fila_adjunto += 
						'<tr class="attach-thumb">'+
						'<td class="table-full-width table-cell-title">'+
						'<span>'+value.nombre+'</span>'+
						'</td>'+
						'<td>'+
						'<a href="'+value.url+'" target="_blank" class="btn btn-light-grey-outlined"><i class="houzez-icon icon-download-bottom"></i></a>'+
						'</td>'+
						'<td>'+
						'<button data-attach-id="' + 0 + '"  data-attachment-id="' + value.id_post + '" data-clase-adjunto="garantia"  class="attachment-delete btn btn-light-grey-outlined"><i class="houzez-icon icon-close"></i></button>'+
						'</td>'+
						'<input type="hidden" class="propperty-attach-id" name="'+value.descripcion+'_ids[]" value="'+value.id_post+'"/>'+
						'</tr>';
					});

					if (fila_adjunto != '')
					{					
						document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
					}
					
					propertyAttachmentEvents_ra();

					$('#formulario_edit').addClass('nover');
					$('#formulario_aprobacion').addClass('nover');
				
					$form.append('<input type="hidden" id="garantia_id" name="garantia_id" class="garantia_id" value="'+res.id+'">');

					$form.find('.selectpicker').selectpicker('refresh');
				}
			},
			error: function(xhr, status, error) {
				var err = eval("(" + xhr.responseText + ")");
				console.log(err.Message);
			}
		}) 
	});

    /*-------------------------------------------------------------------
    * Reenviar informe
    *------------------------------------------------------------------*/
	$('.reenviar_informe_js').on('click', function(e) {
		e.preventDefault();
	
		var $form = $('#informe-form');
		var informe_id = $(this).data('id');

		$('#titulo_formulario_informe').html('Reenviar informe');

		$.ajax({
			type: 'post',
			url: ajaxurl,
			dataType: 'json',
			data: {
				'action': 'get_single_informe',
				'informe_id': informe_id
			},
			beforeSend: function( ) {
				$('#informe_id').remove();
				$('.houzez-overlay-loading').show();
			},
			complete: function(){
				$('.houzez-overlay-loading').hide();
			},
			success: function( response ) {
				if( response.success ) {
					var res = response.data;
					$('#user_id').val(res.user_id);
					$('#fecha_informe').val(res.fecha_informe);
					$('#ubicacion_inmueble').val(res.ubicacion_inmueble);
					$('#nombre_cliente').val(res.nombre_cliente);
					$('#tipo_propiedad').val(res.tipo_propiedad);
					$('#nombre_referencia_propiedad').val(res.nombre_referencia_propiedad);
					$('#numero_padron').val(res.numero_padron);
					$('#m2_totales').val(res.m2_totales);
					$('#m2_edificados').val(res.m2_edificados);
					$('#numero_dormitorios').val(res.numero_dormitorios);
					$('#numero_banos').val(res.numero_banos);
					$('#contribucion').val(res.contribucion);
					$('#primaria').val(res.primaria);
					$('#orientacion').val(res.orientacion);
					$('#gastos_comunes').val(res.gastos_comunes);
					$('#precio_tentativo_propietario').val(res.precio_tentativo_propietario);
					$('#estado_general').val(res.estado_general);
					$('#caracteristicas_generales').val(res.caracteristicas_generales);
					$('#configuracion_planta_baja').val(res.configuracion_planta_baja);
					$('#configuracion_planta_alta').val(res.configuracion_planta_alta);
					if (res.planos_al_dia == 'Sí')
					{
						$('#planos_al_dia_1').attr('checked', true);
					}
					else
					{
						$('#planos_al_dia_2').attr('checked', true);
					}
					if (res.acepta_banco == 'Sí')
					{
						$('#acepta_banco_1').attr('checked', true);
					}
					else
					{
						$('#acepta_banco_2').attr('checked', true);
					}
					if (res.hubo_oferta == 'Sí')
					{
						$('#hubo_oferta_1').attr('checked', true);
					}
					else
					{
						$('#hubo_oferta_2').attr('checked', true);
					}

					$('#de_cuanto').val(res.de_cuanto);

					if (res.vende_para_comprar == 'Sí')
					{
						$('#vende_para_comprar_1').attr('checked', true);
					}
					else
					{
						$('#vende_para_comprar_2').attr('checked', true);
					}

					$('#comentarios_agente').val(res.comentarios_agente);
					$('#comentarios_administrador').val(res.comentarios_administrador);
					$('#estatus_informe').val('Reenviado');
					$('#tipo_formulario').val('Reenviar');
					
					var fila_adjunto = '';
					var descripcion_anterior = '';
					var contador_td = 0;
					$.each(response.adjuntos, function(key, value) 
                    {
						if (contador_td == 0)
						{
							descripcion_anterior = value.descripcion;
						}
						contador_td++;
						if (descripcion_anterior != value.descripcion)
						{
							document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
							descripcion_anterior = value.descripcion;
							fila_adjunto = '';
						}
						fila_adjunto += 
						'<tr class="attach-thumb">'+
						'<td class="table-full-width table-cell-title">'+
						'<span>'+value.nombre+'</span>'+
						'</td>'+
						'<td>'+
						'<a href="'+value.url+'" target="_blank" class="btn btn-light-grey-outlined"><i class="houzez-icon icon-download-bottom"></i></a>'+
						'</td>'+
						'<td>'+
						'<button data-attach-id="' + 0 + '"  data-attachment-id="' + value.id_post + '" data-clase-adjunto="informe"  class="attachment-delete btn btn-light-grey-outlined"><i class="houzez-icon icon-close"></i></button>'+
						'</td>'+
						'<input type="hidden" class="propperty-attach-id" name="'+value.descripcion+'_ids[]" value="'+value.id_post+'"/>'+
						'</tr>';
					});

					if (fila_adjunto != '')
					{					
						document.getElementById( 'tbody_'+descripcion_anterior ).innerHTML = fila_adjunto;
					}
					
					propertyAttachmentEvents_ra();

					$('#formulario_edit_informe').addClass('nover');
					$('#formulario_aprobacion_informe').addClass('nover');
					
					$form.append('<input type="hidden" id="informe_id" name="informe_id" class="informe_id" value="'+res.id+'">');

					$form.find('.selectpicker').selectpicker('refresh');
				}
			},
			error: function(xhr, status, error) {
				var err = eval("(" + xhr.responseText + ")");
				console.log(err.Message);
			}
		}) 
	});

    /*-------------------------------------------------------------------
    * Eliminar garantía
    *------------------------------------------------------------------*/
    $('#garantia_delete_multiple').on('click', function() {
        var $this = $( this );
        var ID = $this.data('id');
        var Nonce = $this.data('nonce');

        var checkboxVals = $('.garantia_multi_delete');

        var vals = $('.garantia_multi_delete:checked').map(function() {return this.value;}).get().join(',');

		console.log('vals ' + vals)

        if(vals == "") {
            return;
        }
        
        bootbox.confirm({
            message: "<strong>"+delete_confirmation+"</strong>",
            buttons: {
                confirm: {
                    label: confirm_btn_text,
                    className: 'btn btn-primary'
                },
                cancel: {
                    label: cancel_btn_text,
                    className: 'btn btn-grey-outlined'
                }
            },
            callback: function (result) {
                if(result==true) {
                    crm_processing_modal( processing_text );

                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: ajaxurl,
                        data: {
                            'action': 'houzez_delete_garantia',
                            'ids': vals,
                        },
                        success: function(data) {
                            if ( data.success == true ) {
                                window.location.reload();
                            } else {
                                jQuery('#fave_modal').modal('hide');
                                alert( data.reason );
                            }
                        },
                        error: function(errorThrown) {

                        }
                    }); // $.ajax
                } // result
            } // Callback
        });

        return false;
    });

    /*-------------------------------------------------------------------
    * Eliminar informe
    *------------------------------------------------------------------*/
    $('#informe_delete_multiple').on('click', function() {
        var $this = $( this );
        var ID = $this.data('id');
        var Nonce = $this.data('nonce');

        var checkboxVals = $('.informe_multi_delete');

        var vals = $('.informe_multi_delete:checked').map(function() {return this.value;}).get().join(',');

		console.log('vals ' + vals)

        if(vals == "") {
            return;
        }
        
        bootbox.confirm({
            message: "<strong>"+delete_confirmation+"</strong>",
            buttons: {
                confirm: {
                    label: confirm_btn_text,
                    className: 'btn btn-primary'
                },
                cancel: {
                    label: cancel_btn_text,
                    className: 'btn btn-grey-outlined'
                }
            },
            callback: function (result) {
                if(result==true) {
                    crm_processing_modal( processing_text );

                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: ajaxurl,
                        data: {
                            'action': 'houzez_delete_informe',
                            'ids': vals,
                        },
                        success: function(data) {
                            if ( data.success == true ) {
                                window.location.reload();
                            } else {
                                jQuery('#fave_modal').modal('hide');
                                alert( data.reason );
                            }
                        },
                        error: function(errorThrown) {

                        }
                    }); // $.ajax
                } // result
            } // Callback
        });

        return false;
    });

   /*-------------------------------------------------------------------------------
    * Multi select
    *------------------------------------------------------------------------------*/

   if($('#garantia_select_all').length > 0) 
   {
		var select_all = document.getElementById("garantia_select_all"); //select all checkbox
		var checkboxes = document.getElementsByClassName("garantia_multi_delete"); //checkbox items
		execute_muticheck = true;
   }

   if($('#informe_select_all').length > 0) 
   {
		var select_all = document.getElementById("informe_select_all"); //select all checkbox
		var checkboxes = document.getElementsByClassName("informe_multi_delete"); //checkbox items
		execute_muticheck = true;
   }

   if(execute_muticheck) 
   { 
		//select all checkboxes
		select_all.addEventListener("change", function(e){
			for (i = 0; i < checkboxes.length; i++) { 
				checkboxes[i].checked = select_all.checked;
			}
		});

		for (var i = 0; i < checkboxes.length; i++) {
			checkboxes[i].addEventListener('change', function(e){ //".checkbox" change 
				//uncheck "select all", if one of the listed checkbox item is unchecked
				if(this.checked == false){
					select_all.checked = false;
				}
				//check "select all" if all checkbox items are checked
				if(document.querySelectorAll('.checkbox:checked').length == checkboxes.length){
					select_all.checked = true;
				}
			});
		}
	}

        /* ------------------------------------------------------------------------ */
        /*	Property attachment delete
         /* ------------------------------------------------------------------------ */
		 var propertyAttachmentEvents_ra = function() {

            $( "#houzez_attachments_container" ).sortable({
                revert: 100,
                placeholder: "attachments-placeholder",
                handle: ".sort-attachment",
                cursor: "move"
            });

            //Remove Image
            $('.attachment-delete').on('click', function(e){
                e.preventDefault();
                var $this = $(this);
                var thumbnail = $this.closest('.attach-thumb');
                var loader = $this.siblings('.icon-loader');
                var prop_id = $this.data('attach-id');
                var thumb_id = $this.data('attachment-id');
				var clase_adjunto = $this.data('clase-adjunto');

                loader.show();

                var ajax_request = $.ajax({
                    type: 'post',
                    url: ajaxurl,
                    dataType: 'json',
                    data: {
                        'action': 'houzez_remove_property_thumbnail_ra',
                        'prop_id': prop_id,
                        'thumb_id': thumb_id,
                        'removeNonce': verify_nonce,
						'clase_adjunto': clase_adjunto
                    }
                });

                ajax_request.done(function( response ) {
                    if ( response.remove_attachment ) {
                        thumbnail.remove();
                    } else {

                    }
                });

                ajax_request.fail(function( jqXHR, textStatus ) {
                    alert( "Request failed: " + textStatus );
                });

            });

        }
        propertyAttachmentEvents_ra();

	//Js for property attachments upload
	var houzez_property_attachments_ra = function(nombre_adjunto, id_select, id_tbody, extensiones_archivos, tabla_adjuntos_ids, clase_adjunto) 
	{
		var atch_uploader = new plupload.Uploader({
			browse_button: id_select,
			file_data_name: 'property_attachment_file',
			url: ajaxurl + "?action=houzez_property_attachment_upload&verify_nonce="+verify_nonce,
			filters: {
				mime_types : [
					{ title : verify_file_type, extensions : extensiones_archivos }
				],
				max_file_size: attachment_max_file_size,
				prevent_duplicates: true
			}
		});
		atch_uploader.init();

		atch_uploader.bind('FilesAdded', function(up, files) {
			var houzez_thumbs = "";
			var maxfiles = max_prop_attachments;
			if(up.files.length > maxfiles ) {
				up.splice(maxfiles);
				alert('no more than '+maxfiles + ' file(s)');
				return;
			}
			plupload.each(files, function(file) {
				houzez_thumbs += '<tr id="attachment-holder-' + file.id + '" class="attach-thumb">' + '' + '</tr>';
			});
			document.getElementById(id_tbody).innerHTML += houzez_thumbs;
	
			up.refresh();
			atch_uploader.start();
		});


		atch_uploader.bind('UploadProgress', function(up, file) {
			document.getElementById( "attachment-holder-" + file.id ).innerHTML = '<span>' + file.percent + "%</span>";
		});

		atch_uploader.bind('Error', function( up, err ) {
			document.getElementById('houzez_atach_errors').innerHTML += "<br/>" + "Error #" + err.code + ": " + err.message;
		});

		atch_uploader.bind('FileUploaded', function ( up, file, ajax_response ) {
			var url_archivo = '';
			var response = $.parseJSON( ajax_response.response );

			if ( response.success ) {

				if (response.url != null)
				{
					url_archivo = response.url;
				}
				else
				{
					url_archivo = response.full_image;
				}

				var attachment_file = ''+
					'<td class="table-full-width table-cell-title">'+
						'<span>'+ response.attach_title +'</span>'+
					'</td>'+
					'<td>'+
						'<a href="'+ url_archivo +'" target="_blank" class="btn btn-light-grey-outlined"><i class="houzez-icon icon-download-bottom"></i></a>'+
					'</td>'+
					'<td>'+
						'<button data-attach-id="' + 0 + '"  data-attachment-id="' + response.attachment_id + '" data-clase-adjunto="' + clase_adjunto + '" class="attachment-delete btn btn-light-grey-outlined"><i class="houzez-icon icon-close"></i></button>'+
					'</td>'+
					'<input type="hidden" class="propperty-attach-id" name="'+tabla_adjuntos_ids+'" value="' + response.attachment_id + '"/>';
				
				document.getElementById( "attachment-holder-" + file.id ).innerHTML = attachment_file;

				if ($('.garantia_id').length) 
				{
					registrar_adjunto($('.garantia_id').val(), nombre_adjunto, response.attachment_id, 'garantia');
				}
				else if ($('.informe_id').length) 
				{
					registrar_adjunto($('.informe_id').val(), nombre_adjunto, response.attachment_id, 'informe');
				}


				propertyAttachmentEvents_ra();

			} else {
				console.log ( response );
			}
		});

	}
	houzez_property_attachments_ra('adjunto_sueldos', 'select_adjunto_sueldos_ra', 'tbody_adjunto_sueldos', 'jpg,jpeg,png,pdf,zip', 'adjunto_sueldos_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_cedula', 'select_adjunto_cedula_ra', 'tbody_adjunto_cedula', 'jpg,jpeg,png,pdf,zip', 'adjunto_cedula_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_caja', 'select_adjunto_caja_ra', 'tbody_adjunto_caja', 'jpg,jpeg,png,pdf,zip', 'adjunto_caja_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_ingresos', 'select_adjunto_ingresos_ra', 'tbody_adjunto_ingresos', 'jpg,jpeg,png,pdf,zip', 'adjunto_ingresos_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_declaracion_dgi', 'select_adjunto_declaracion_dgi_ra', 'tbody_adjunto_declaracion_dgi', 'jpg,jpeg,png,pdf,zip', 'adjunto_declaracion_dgi_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_bps', 'select_adjunto_bps_ra', 'tbody_adjunto_bps', 'jpg,jpeg,png,pdf,zip', 'adjunto_bps_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_certificado_dgi', 'select_adjunto_certificado_dgi_ra', 'tbody_adjunto_certificado_dgi', 'jpg,jpeg,png,pdf,zip', 'adjunto_certificado_dgi_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_cippu', 'select_adjunto_cippu_ra', 'tbody_adjunto_cippu', 'jpg,jpeg,png,pdf,zip', 'adjunto_cippu_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_rut', 'select_adjunto_rut_ra', 'tbody_adjunto_rut', 'jpg,jpeg,png,pdf,zip', 'adjunto_rut_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_social', 'select_adjunto_social_ra', 'tbody_adjunto_social', 'jpg,jpeg,png,pdf,zip', 'adjunto_social_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_domicilio', 'select_adjunto_domicilio_ra', 'tbody_adjunto_domicilio', 'jpg,jpeg,png,pdf,zip', 'adjunto_domicilio_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_aprobacion', 'select_adjunto_aprobacion_ra', 'tbody_adjunto_aprobacion', 'jpg,jpeg,png,pdf,zip', 'adjunto_aprobacion_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_recibo_sueldo', 'select_adjunto_recibo_sueldo_ra', 'tbody_adjunto_recibo_sueldo', 'jpg,jpeg,png,pdf,zip', 'adjunto_recibo_sueldo_ids[]', 'garantia');
	houzez_property_attachments_ra('adjunto_fotos', 'select_adjunto_fotos_ra', 'tbody_adjunto_fotos', 'jpg,jpeg,png', 'adjunto_fotos_ids[]', 'informe');
	houzez_property_attachments_ra('adjunto_informe', 'select_adjunto_informe_ra', 'tbody_adjunto_informe', 'jpg,jpeg,png,pdf,zip', 'adjunto_informe_ids[]', 'informe');


    /*-------------------------------------------------------------------
    * Eliminar adjuntos garantía
    *------------------------------------------------------------------*/
    $('#borrar_adjuntos_garantia').on('click', function() {
        var $this = $( this );
        var ID = $this.data('id');
        var Nonce = $this.data('nonce');

        var checkboxVals = $('.garantia_multi_delete');

        var vals = $('.garantia_multi_delete:checked').map(function() {return this.value;}).get().join(',');

		console.log('vals ' + vals)

        if(vals == "") {
            return;
        }
        
        bootbox.confirm({
            message: "<strong>"+delete_confirmation+"</strong>",
            buttons: {
                confirm: {
                    label: confirm_btn_text,
                    className: 'btn btn-primary'
                },
                cancel: {
                    label: cancel_btn_text,
                    className: 'btn btn-grey-outlined'
                }
            },
            callback: function (result) {
                if(result==true) {
                    crm_processing_modal( processing_text );

                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: ajaxurl,
                        data: {
                            'action': 'houzez_borrar_adjuntos_garantia',
                            'ids': vals,
                        },
                        success: function(data) {
                            if ( data.success == true ) {
                                window.location.reload();
                            } else {
                                jQuery('#fave_modal').modal('hide');
                                alert( data.reason );
                            }
                        },
                        error: function(errorThrown) {

                        }
                    }); // $.ajax
                } // result
            } // Callback
        });

        return false;
    });

    /*-------------------------------------------------------------------
    * Eliminar adjuntos informes
    *------------------------------------------------------------------*/
    $('#borrar_adjuntos_informe').on('click', function() {
        var $this = $( this );
        var ID = $this.data('id');
        var Nonce = $this.data('nonce');

        var checkboxVals = $('.informe_multi_delete');

        var vals = $('.informe_multi_delete:checked').map(function() {return this.value;}).get().join(',');

		console.log('vals ' + vals)

        if(vals == "") {
            return;
        }
        
        bootbox.confirm({
            message: "<strong>"+delete_confirmation+"</strong>",
            buttons: {
                confirm: {
                    label: confirm_btn_text,
                    className: 'btn btn-primary'
                },
                cancel: {
                    label: cancel_btn_text,
                    className: 'btn btn-grey-outlined'
                }
            },
            callback: function (result) {
                if(result==true) {
                    crm_processing_modal( processing_text );

                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: ajaxurl,
                        data: {
                            'action': 'houzez_borrar_adjuntos_informe',
                            'ids': vals,
                        },
                        success: function(data) {
                            if ( data.success == true ) {
                                window.location.reload();
                            } else {
                                jQuery('#fave_modal').modal('hide');
                                alert( data.reason );
                            }
                        },
                        error: function(errorThrown) {

                        }
                    }); // $.ajax
                } // result
            } // Callback
        });

        return false;
    });

	$( ".datepicker" ).datepicker({
		'format': 'dd/mm/yyyy'

	});

	$('#seguro').change(function(e) 
	{
		e.preventDefault();
		if ($('#seguro').val() == 'Porto Seguro' && $('#estado_laboral').val() == 'Trabajador dependiente')
		{
			if ($(".porto_seguro_requisitos_trabajador_dependiente").hasClass('nover') == true)
			{
				$(".porto_seguro_requisitos_trabajador_dependiente").removeClass('nover');
			}
			if ($(".adjunto_sueldos").hasClass('nover') == true)
			{
				$(".adjunto_sueldos").removeClass('nover');
			}
		}
		else
		{
			if ($(".porto_seguro_requisitos_trabajador_dependiente").hasClass('nover') == false)
			{
				$('.porto_seguro_requisitos_trabajador_dependiente').addClass('nover');
			}
			if ($(".adjunto_sueldos").hasClass('nover') == false)
			{
				$('.adjunto_sueldos').addClass('nover');
			}	
	
		}

		if ($('#seguro').val() == 'Porto Seguro' && $('#estado_laboral').val() == 'Jubilado pensionista')
		{
			if ($(".porto_seguro_requisitos_jubilado_pensionista").hasClass('nover') == true)
			{
				$(".porto_seguro_requisitos_jubilado_pensionista").removeClass('nover');
			}
			if ($(".adjunto_caja").hasClass('nover') == true)
			{
				$(".adjunto_caja").removeClass('nover');
			}
		}
		else
		{
			if ($(".porto_seguro_requisitos_jubilado_pensionista").hasClass('nover') == false)
			{
				$('.porto_seguro_requisitos_jubilado_pensionista').addClass('nover');
			}
			if ($('#seguro').val() != 'SURA')
			{ 
				if ($(".adjunto_caja").hasClass('nover') == false)
				{
					$('.adjunto_caja').addClass('nover');
				}
			}		
		}

		if ($('#seguro').val() == 'Porto Seguro' && $('#estado_laboral').val() == 'Trabajador y profesional independiente')
		{
			if ($(".porto_seguro_requisitos_trabajador_y_profesional_independiente").hasClass('nover') == true)
			{
				$(".porto_seguro_requisitos_trabajador_y_profesional_independiente").removeClass('nover');
			}
			if ($(".adjunto_ingresos").hasClass('nover') == true)
			{
				$(".adjunto_ingresos").removeClass('nover');
			}
			if ($(".adjunto_declaracion_dgi").hasClass('nover') == true)
			{
				$(".adjunto_declaracion_dgi").removeClass('nover');
			}
		}
		else
		{
			if ($(".porto_seguro_requisitos_trabajador_y_profesional_independiente").hasClass('nover') == false)
			{
				$('.porto_seguro_requisitos_trabajador_y_profesional_independiente').addClass('nover');
			}
			if ($('#seguro').val() != 'SURA' && $('#seguro').val() != 'BHU' && $('#estado_laboral').val() != 'Empresario')
			{ 
				if ($(".adjunto_ingresos").hasClass('nover') == false)
				{
					$('.adjunto_ingresos').addClass('nover');
				}
			}
			if ($('#seguro').val() != 'SURA' && $('#estado_laboral').val() != 'Empresario')
			{ 
				if ($(".adjunto_declaracion_dgi").hasClass('nover') == false)
				{
					$('.adjunto_declaracion_dgi').addClass('nover');
				}
			}		
		}

		if ($('#seguro').val() == 'Porto Seguro' && $('#estado_laboral').val() == 'Empresario')
		{
			if ($(".porto_seguro_requisitos_empresario").hasClass('nover') == true)
			{
				$(".porto_seguro_requisitos_empresario").removeClass('nover');
			}
			if ($(".adjunto_ingresos").hasClass('nover') == true)
			{
				$(".adjunto_ingresos").removeClass('nover');
			}
			if ($(".adjunto_declaracion_dgi").hasClass('nover') == true)
			{
				$(".adjunto_declaracion_dgi").removeClass('nover');
			}
		}
		else
		{
			if ($(".porto_seguro_requisitos_empresario").hasClass('nover') == false)
			{
				$('.porto_seguro_requisitos_empresario').addClass('nover');
			}
			if ($('#seguro').val() != 'SURA' && $('#seguro').val() != 'BHU' && $('#estado_laboral').val() != 'Trabajador y profesional independiente')
			{ 
				if ($(".adjunto_ingresos").hasClass('nover') == false)
				{
					$('.adjunto_ingresos').addClass('nover');
				}
			}
			if ($('#seguro').val() != 'SURA' && $('#estado_laboral').val() != 'Trabajador y profesional independiente')
			{ 
				if ($(".adjunto_declaracion_dgi").hasClass('nover') == false)
				{
					$('.adjunto_declaracion_dgi').addClass('nover');
				}
			}			
		}

		if ($('#seguro').val() == 'SURA' && $('#estado_laboral').val() == 'Jubilado pensionista')
		{
			if ($(".adjunto_caja").hasClass('nover') == true)
			{
				$(".adjunto_caja").removeClass('nover');
			}
		}
		else
		{
			if ($('#seguro').val() != 'Porto Seguro')
			{ 
				if ($(".adjunto_caja").hasClass('nover') == false)
				{
					$('.adjunto_caja').addClass('nover');
				}
			}		
		}

		if ($('#seguro').val() == 'SURA' && $('#estado_laboral').val() == 'Trabajador y profesional independiente')
		{
			if ($(".sura_requisitos_trabajador_y_profesional_independiente").hasClass('nover') == true)
			{
				$(".sura_requisitos_trabajador_y_profesional_independiente").removeClass('nover');
			}
			if ($(".adjunto_ingresos").hasClass('nover') == true)
			{
				$(".adjunto_ingresos").removeClass('nover');
			}
			if ($(".adjunto_declaracion_dgi").hasClass('nover') == true)
			{
				$(".adjunto_declaracion_dgi").removeClass('nover');
			}
		}
		else
		{
			if ($(".sura_requisitos_trabajador_y_profesional_independiente").hasClass('nover') == false)
			{
				$('.sura_requisitos_trabajador_y_profesional_independiente').addClass('nover');
			}
			if ($('#seguro').val() != 'Porto Seguro' && $('#seguro').val() != 'BHU' && $('#estado_laboral').val() != 'Empresario')
			{ 
				if ($(".adjunto_ingresos").hasClass('nover') == false)
				{
					$('.adjunto_ingresos').addClass('nover');
				}
			}
			if ($('#seguro').val() != 'Porto Seguro' && $('#estado_laboral').val() != 'Empresario')
			{ 
				if ($(".adjunto_declaracion_dgi").hasClass('nover') == false)
				{
					$('.adjunto_declaracion_dgi').addClass('nover');
				}
			}			
		}

		if ($('#seguro').val() == 'SURA' && $('#estado_laboral').val() == 'Empresario')
		{
			if ($(".sura_requisitos_empresario").hasClass('nover') == true)
			{
				$(".sura_requisitos_empresario").removeClass('nover');
			}
			if ($(".adjunto_ingresos").hasClass('nover') == true)
			{
				$(".adjunto_ingresos").removeClass('nover');
			}
		}
		else
		{
			if ($(".sura_requisitos_empresario").hasClass('nover') == false)
			{
				$('.sura_requisitos_empresario').addClass('nover');
			}
			if ($('#seguro').val() != 'Porto Seguro' && $('#seguro').val() != 'BHU' && $('#estado_laboral').val() != 'Trabajador y profesional independiente')
			{ 
				if ($(".adjunto_ingresos").hasClass('nover') == false)
				{
					$('.adjunto_ingresos').addClass('nover');
				}
			}			
		}

		if ($('#seguro').val() == 'BHU' && $('#estado_laboral').val() == 'Trabajador y profesional independiente')
		{
			if ($(".adjunto_ingresos").hasClass('nover') == true)
			{
				$(".adjunto_ingresos").removeClass('nover');
			}
		}
		else
		{
			if ($('#seguro').val() != 'Porto Seguro' && $('#seguro').val() != 'SURA' && $('#estado_laboral').val() != 'Empresario')
			{ 
				if ($(".adjunto_ingresos").hasClass('nover') == false)
				{
					$('.adjunto_ingresos').addClass('nover');
				}
			}		
		}

		if ($('#seguro').val() == 'BHU' && $('#estado_laboral').val() == 'Empresario')
		{
			if ($(".adjunto_ingresos").hasClass('nover') == true)
			{
				$(".adjunto_ingresos").removeClass('nover');
			}
		}
		else
		{
			if ($('#seguro').val() != 'Porto Seguro' && $('#seguro').val() != 'SURA' && $('#estado_laboral').val() != 'Trabajador y profesional independiente')
			{ 
				if ($(".adjunto_ingresos").hasClass('nover') == false)
				{
					$('.adjunto_ingresos').addClass('nover');
				}
			}		
		}

	});

	$('#estado_laboral').change(function(e) 
	{
		e.preventDefault();
		if ($('#seguro').val() == 'Porto Seguro' && $('#estado_laboral').val() == 'Trabajador dependiente')
		{
			if ($(".porto_seguro_requisitos_trabajador_dependiente").hasClass('nover') == true)
			{
				$(".porto_seguro_requisitos_trabajador_dependiente").removeClass('nover');
			}
			if ($(".adjunto_sueldos").hasClass('nover') == true)
			{
				$(".adjunto_sueldos").removeClass('nover');
			}
		}
		else
		{
			if ($(".porto_seguro_requisitos_trabajador_dependiente").hasClass('nover') == false)
			{
				$('.porto_seguro_requisitos_trabajador_dependiente').addClass('nover');
			}
			if ($(".adjunto_sueldos").hasClass('nover') == false)
			{
				$('.adjunto_sueldos').addClass('nover');
			}		
		}

		if ($('#seguro').val() == 'Porto Seguro' && $('#estado_laboral').val() == 'Jubilado pensionista')
		{
			if ($(".porto_seguro_requisitos_jubilado_pensionista").hasClass('nover') == true)
			{
				$(".porto_seguro_requisitos_jubilado_pensionista").removeClass('nover');
			}
			if ($(".adjunto_caja").hasClass('nover') == true)
			{
				$(".adjunto_caja").removeClass('nover');
			}
		}
		else
		{
			if ($(".porto_seguro_requisitos_jubilado_pensionista").hasClass('nover') == false)
			{
				$('.porto_seguro_requisitos_jubilado_pensionista').addClass('nover');
			}
			if ($('#seguro').val() != 'SURA')
			{ 
				if ($(".adjunto_caja").hasClass('nover') == false)
				{
					$('.adjunto_caja').addClass('nover');
				}
			}			
		}

		if ($('#seguro').val() == 'Porto Seguro' && $('#estado_laboral').val() == 'Trabajador y profesional independiente')
		{
			if ($(".porto_seguro_requisitos_trabajador_y_profesional_independiente").hasClass('nover') == true)
			{
				$(".porto_seguro_requisitos_trabajador_y_profesional_independiente").removeClass('nover');
			}
			if ($(".adjunto_ingresos").hasClass('nover') == true)
			{
				$(".adjunto_ingresos").removeClass('nover');
			}
			if ($(".adjunto_declaracion_dgi").hasClass('nover') == true)
			{
				$(".adjunto_declaracion_dgi").removeClass('nover');
			}
		}
		else
		{
			if ($(".porto_seguro_requisitos_trabajador_y_profesional_independiente").hasClass('nover') == false)
			{
				$('.porto_seguro_requisitos_trabajador_y_profesional_independiente').addClass('nover');
			}
			if ($('#seguro').val() != 'SURA' && $('#seguro').val() != 'BHU' && $('#estado_laboral').val() != 'Empresario')
			{ 
				if ($(".adjunto_ingresos").hasClass('nover') == false)
				{
					$('.adjunto_ingresos').addClass('nover');
				}
			}
			if ($('#seguro').val() != 'SURA' && $('#estado_laboral').val() != 'Empresario')
			{ 
				if ($(".adjunto_declaracion_dgi").hasClass('nover') == false)
				{
					$('.adjunto_declaracion_dgi').addClass('nover');
				}
			}		
		}

		if ($('#seguro').val() == 'Porto Seguro' && $('#estado_laboral').val() == 'Empresario')
		{
			if ($(".porto_seguro_requisitos_empresario").hasClass('nover') == true)
			{
				$(".porto_seguro_requisitos_empresario").removeClass('nover');
			}
			if ($(".adjunto_ingresos").hasClass('nover') == true)
			{
				$(".adjunto_ingresos").removeClass('nover');
			}
			if ($(".adjunto_declaracion_dgi").hasClass('nover') == true)
			{
				$(".adjunto_declaracion_dgi").removeClass('nover');
			}
		}
		else
		{
			if ($(".porto_seguro_requisitos_empresario").hasClass('nover') == false)
			{
				$('.porto_seguro_requisitos_empresario').addClass('nover');
			}
			if ($('#seguro').val() != 'SURA' && $('#seguro').val() != 'BHU' && $('#estado_laboral').val() != 'Trabajador y profesional independiente')
			{ 
				if ($(".adjunto_ingresos").hasClass('nover') == false)
				{
					$('.adjunto_ingresos').addClass('nover');
				}
			}
			if ($('#seguro').val() != 'SURA' && $('#estado_laboral').val() != 'Trabajador y profesional independiente')
			{ 
				if ($(".adjunto_declaracion_dgi").hasClass('nover') == false)
				{
					$('.adjunto_declaracion_dgi').addClass('nover');
				}
			}			
		}

		if ($('#seguro').val() == 'SURA' && $('#estado_laboral').val() == 'Jubilado pensionista')
		{
			if ($(".adjunto_caja").hasClass('nover') == true)
			{
				$(".adjunto_caja").removeClass('nover');
			}
		}
		else
		{
			if ($('#seguro').val() != 'Porto Seguro')
			{ 
				if ($(".adjunto_caja").hasClass('nover') == false)
				{
					$('.adjunto_caja').addClass('nover');
				}
			}		
		}

		if ($('#seguro').val() == 'SURA' && $('#estado_laboral').val() == 'Trabajador y profesional independiente')
		{
			if ($(".sura_requisitos_trabajador_y_profesional_independiente").hasClass('nover') == true)
			{
				$(".sura_requisitos_trabajador_y_profesional_independiente").removeClass('nover');
			}
			if ($(".adjunto_ingresos").hasClass('nover') == true)
			{
				$(".adjunto_ingresos").removeClass('nover');
			}
			if ($(".adjunto_declaracion_dgi").hasClass('nover') == true)
			{
				$(".adjunto_declaracion_dgi").removeClass('nover');
			}
		}
		else
		{
			if ($(".sura_requisitos_trabajador_y_profesional_independiente").hasClass('nover') == false)
			{
				$('.sura_requisitos_trabajador_y_profesional_independiente').addClass('nover');
			}
			if ($('#seguro').val() != 'Porto Seguro' && $('#seguro').val() != 'BHU' && $('#estado_laboral').val() != 'Empresario')
			{ 
				if ($(".adjunto_ingresos").hasClass('nover') == false)
				{
					$('.adjunto_ingresos').addClass('nover');
				}
			}
			if ($('#seguro').val() != 'Porto Seguro' && $('#estado_laboral').val() != 'Empresario')
			{ 
				if ($(".adjunto_declaracion_dgi").hasClass('nover') == false)
				{
					$('.adjunto_declaracion_dgi').addClass('nover');
				}
			}			
		}

		if ($('#seguro').val() == 'SURA' && $('#estado_laboral').val() == 'Empresario')
		{
			if ($(".sura_requisitos_empresario").hasClass('nover') == true)
			{
				$(".sura_requisitos_empresario").removeClass('nover');
			}
			if ($(".adjunto_ingresos").hasClass('nover') == true)
			{
				$(".adjunto_ingresos").removeClass('nover');
			}
		}
		else
		{
			if ($(".sura_requisitos_empresario").hasClass('nover') == false)
			{
				$('.sura_requisitos_empresario').addClass('nover');
			}
			if ($('#seguro').val() != 'Porto Seguro' && $('#seguro').val() != 'BHU' && $('#estado_laboral').val() != 'Trabajador y profesional independiente')
			{ 
				if ($(".adjunto_ingresos").hasClass('nover') == false)
				{
					$('.adjunto_ingresos').addClass('nover');
				}
			}			
		}

		if ($('#seguro').val() == 'BHU' && $('#estado_laboral').val() == 'Trabajador y profesional independiente')
		{
			if ($(".adjunto_ingresos").hasClass('nover') == true)
			{
				$(".adjunto_ingresos").removeClass('nover');
			}
		}
		else
		{
			if ($('#seguro').val() != 'Porto Seguro' && $('#seguro').val() != 'SURA' && $('#estado_laboral').val() != 'Empresario')
			{ 
				if ($(".adjunto_ingresos").hasClass('nover') == false)
				{
					$('.adjunto_ingresos').addClass('nover');
				}
			}		
		}

		if ($('#seguro').val() == 'BHU' && $('#estado_laboral').val() == 'Empresario')
		{
			if ($(".adjunto_ingresos").hasClass('nover') == true)
			{
				$(".adjunto_ingresos").removeClass('nover');
			}
		}
		else
		{
			if ($('#seguro').val() != 'Porto Seguro' && $('#seguro').val() != 'SURA' && $('#estado_laboral').val() != 'Trabajador y profesional independiente')
			{ 
				if ($(".adjunto_ingresos").hasClass('nover') == false)
				{
					$('.adjunto_ingresos').addClass('nover');
				}
			}		
		}

	});

});

})( jQuery );