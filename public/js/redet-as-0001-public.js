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

	var crm_processing_modal = function ( msg ) {
        var process_modal ='<div class="modal fade" id="fave_modal" tabindex="-1" role="dialog" aria-labelledby="faveModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-body houzez_messages_modal">'+msg+'</div></div></div></div></div>';
        jQuery('body').append(process_modal);
        jQuery('#fave_modal').modal();
    }

    var crm_processing_modal_close = function ( ) {
        jQuery('#fave_modal').modal('hide');
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
					$('#tipo_documento_redet_as').val(res.tipo_documento_redet_as).attr("selected", "selected");
					$('#cedula_rif_redet_as').val(res.cedula_rif_redet_as);
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
});

})( jQuery );