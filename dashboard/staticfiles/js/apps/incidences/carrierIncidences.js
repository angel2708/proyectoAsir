$('.loading-banner').addClass('d-none');
$('#tableDeliveryIncidences').show();

//Datatables en Español
var deliveryIncidencesDataTable = $('#tableDeliveryIncidences').DataTable({
    'order' : [[0,'asc']],
    "columnDefs": [{
        "targets": [ 0 ],
        "visible": false,
    }],
    "language": {
        "sProcessing":    "Procesando...",
        "sLengthMenu":    "Mostrar _MENU_ registros",
        "sZeroRecords":   "No se encontraron resultados",
        "sEmptyTable":    "Ningún dato disponible en esta tabla",
        "sInfo":          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty":     "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered":  "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix":   "",
        "sSearch":        "Buscar:",
        "sUrl":           "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst":    "Primero",
            "sLast":    "Último",
            "sNext":    "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    }
});

/* deliveryIncidencesDataTable.draw(); */
deliveryIncidencesDataTable.column(0).search('0|1|2|5|6',true,false).draw();
$('.dt-buttons').remove()

/** Comportamiento del botón de mostrar/ocultar las incidencias pagadas */
$(document).on('click', '.paid-filter', function () {
    if ($(this).attr('state') == 0) {
        deliveryIncidencesDataTable.column(0).search('4',true,false).draw();
        $(this).attr('state','1')
        $(this).children().html('<i class="fas fa-hourglass-half"></i> Mostrar Activos</span>')
    } else {
        deliveryIncidencesDataTable.column(0).search('0|1|2|5|6',true,false).draw();
        $(this).attr('state','0')
        $(this).children().html('<i class="fas fa-money-bill-alt"></i> Mostrar Pagados</span>')
    }
})

/** Comportamiento del botón de editar incidencia de transporte */
$(document).on('click', '.editIncidence', function () {
    let idi = $(this).attr('idi')

    $('.message_pdfs').empty()
    $('.message_pdfs').append(
        '<label for="add-shipment-number">PDF Adjuntos</label><br>'
    )

    $('.message_images').empty()
    $('.message_images').append(
        '<label for="add-shipment-number">Imagenes Adjuntas</label><br>'
    )

    $.ajax({
        type: 'POST',
        url: '/delivery-incidence/',
        data: {
            idi: idi,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'get_delivery_inc_data'
        },
        success: function(respuesta) {
            let data = JSON.parse(respuesta);
            
            $('.client_id').val(data[0]['fields']['client_id'])
            $('.client_name').val(data[0]['fields']['client_name'])
            $('.bill_client').val(data[0]['fields']['fac_client'])
            $('.inc_date').val(data[0]['fields']['date'])
            $('.serial_number').val(data[0]['fields']['nserie'])
            $('.bill_delivery').val(data[0]['fields']['fac_carrier'])
            $('.edited_delivery_number').val(data[0]['fields']['delivery_number'])
            $('.observations').val(data[0]['fields']['observations'])
            
            let destination = data[0]['fields']['destination']
            if (destination == 1) {
                destination = 'MRW'
                $('.message_destination').val('cial.alfonso.colorado.01711@grupomrw.com')
            } else if (destination == 2) {
                destination = 'NACEX'
                $('.message_destination').val('1814.operativa@nacex.es')
            } else if (destination == 3) {
                destination = 'CORREOS'
                $('.message_destination').val('clientes@correosexpress.com')
            } else if (destination == 4) {
                destination = 'RMA'
            }

            $('.edited_destination').val(destination)
            
            let inc_type = data[0]['fields']['inc_type']
            if (inc_type == 1) {
                inc_type = 'Robo'
            } else if (inc_type == 2) {
                inc_type = 'Mojado'
            } else if (inc_type == 3) {
                inc_type = 'Rotura'
            } else if (inc_type == 4) {
                inc_type = 'Pérdida'
            } else if (inc_type == 5) {
                inc_type = 'Otro'
            }

            $('.inc_type').val(inc_type)

            if (data[0]['fields']['article_name'] != 'null') {
                $('.articles').val(data[0]['fields']['article_name'])
            } else {
                $('.articles').val('')
            }

            $('.message_cc').val('miguel.mancha@esmovil.es')

            $('.message_issue').val('Incidencia de Transporte '+data[0]['fields']['delivery_number']+' ('+data[0]['fields']['client_name']+')')

            $('.sendDeliveryIncidence').attr('idi',data[0]['pk'])

            $.ajax({
                type: 'POST',
                url: '/delivery-incidence/',
                data: {
                    idi: idi,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'get_incidence_files'
                },
                success: function(respuesta) {
                    let data = JSON.parse(respuesta);

                    for (let f = 0; f < data.length; f++) {
                        if (data[f]['fields']['type'] == 0) {
                            $('.message_pdfs').append(
                                '<a class="attached" href="/dashboard/media/'+data[f]['fields']['file']+'" download><i class="far fa-file-pdf"></i> '+data[f]['fields']['file'].split('/')[2]+'</a><br>'
                            )
                        } else {
                            $('.message_images').append(
                                '<a class="attached" href="/dashboard/media/'+data[f]['fields']['file']+'" download><i class="far fa-file-image"></i> '+data[f]['fields']['file'].split('/')[2]+'</a><br>'
                            )
                        }
                    }
                },
                error: function (xhr, errmsg, err) {
                    toastr.error('El cliente introducido no tiene facturas de los últimos 10 días.', 'Error al obtener facturas');
                }
            });
            
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
})

/** Comportamiento cuando se añade una imagen antes de enviar la incidencia */
$(document).on('change', '.new_incidencesimg', function () {
    if ($(this).val()) {
        $('.sendDeliveryIncidence').html('Subir imagen')
        $('.sendDeliveryIncidence').addClass('new_delivery_image')
        $('.sendDeliveryIncidence').removeClass('sendDeliveryIncidence')
    } else {
        $('.new_delivery_image').html('<i class="far fa-paper-plane"></i> Enviar Incidencia')
        $('.new_delivery_image').addClass('sendDeliveryIncidence')
        $('.new_delivery_image').removeClass('new_delivery_image')
    }
})

$(document).on('click', '.new_delivery_image', function () {
    var formData = new FormData();

    let icount = 0;
    let images = $('.new_incidencesimg').prop('files')
    let idi = $('.new_delivery_image').attr('idi')
    for (i in images){
        formData.append('i'+icount, $('.new_incidencesimg').prop('files')[i]);
        icount++;
    }
    formData.append('icount', icount);
    formData.append('idi', idi);
    formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
    formData.append('action', 'add_new_delivery_image');

    $.ajax({
        type: 'POST',
        url: '/delivery-incidence/',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(respuesta) {
            let data = JSON.parse(respuesta);
            $('.message_images').empty()
            $('.message_images').append(
                '<label for="add-shipment-number">Imagenes Adjuntas</label><br>'
            )

            for (let ni = 0; ni < data.length; ni++) {
                $('.message_images').append(
                    '<a class="attached" href="/dashboard/media/'+data[ni]['fields']['file']+'" download><i class="far fa-file-image"></i> '+data[ni]['fields']['file'].split('/')[2]+'</a><br>'
                )
            }

            $('.new_incidencesimg').val('')
            $('.new_delivery_image').html('<i class="far fa-paper-plane"></i> Enviar Incidencia')
            $('.new_delivery_image').addClass('sendDeliveryIncidence')
            $('.new_delivery_image').removeClass('new_delivery_image')
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
})

/** Enviar la incidencia a la compañía */
$(document).on('click', '.sendDeliveryIncidence', function () {
    if ($('.message_body').val() != '') {
        let mailto = $('.message_destination').val()
        let cc = $('.message_cc').val()
        let issue = $('.message_issue').val()
        let body = $('.message_body').val()
        let idi = $(this).attr('idi')
        let edited_bill_delivery = $('.edited_bill_delivery').val()
        let edited_delivery_number = $('.edited_delivery_number').val()
        let edited_destination = $('.edited_destination').val()

        $.ajax({
            type: 'POST',
            url: '/delivery-incidence/',
            data: {
                idi: idi,
                mailto: mailto,
                cc: cc,
                issue: issue,
                body: body,
                edited_bill_delivery: edited_bill_delivery,
                edited_delivery_number: edited_delivery_number,
                edited_destination: edited_destination,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'send_delivery_incidence'
            },
            success: function() {
                $("#editCarrierIncidenceModal").modal('hide')
                toastr.success('Se ha enviado un correo electrónico al transportista.', 'Incidencia enviada con éxito');

                if ($('.edited_destination').val() != 'NACEX') {
                    $('.tr_delivery_incidence[idi='+idi+']').css('background-color','#E0FFCD')
    
                    $('.editIncidence[idi='+idi+']').remove()
                    $('.removeIncidence[idi='+idi+']').remove()
    
                    $('.td_state[idi='+idi+']').append(
                        '<button type="button" class="btn btn-link success checkIncidence" style="margin-left:-30px; margin-right:-30px;font-size: 20px;" title="Pagar" idi="'+idi+'"><i class="fas fa-check-circle"></i></button>'
                    )

                } else {
                    $('.tr_delivery_incidence[idi='+idi+']').css('background-color','#D7FBFF')

                    $('.editIncidence[idi='+idi+']').remove()
                    $('.removeIncidence[idi='+idi+']').remove()
                }
                
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    } else {
        toastr.error('El cuerpo del mensaje no puede estar vacío.', 'Error al enviar el mensaje');
    }
})

/** Comportamiento del botón de PAGAR */
$(document).on('click', '.checkIncidence', function () {
    let idi = $(this).attr('idi')
    let client_name = ''

    $('.td_client_name').each(function() {
        if ($(this).attr('idi') == idi) {
            client_name = $(this).text()
        }
    })

    swal.fire({
        title: '¿Deseas cambiar esta incidencia a "Terminada"?',
        html: '<fieldset class="form-group"><label for="rejectionReason"><b>Cliente: '+client_name+'</b></label></fieldset>',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SI'
    }).then(function (resp) {
        if (resp['value'] == true) {
            $.ajax({
                type: 'POST',
                url: '/delivery-incidence/',
                data: {
                    idi: idi,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'finish_delivery_incidence'
                },
                success: function() {
                    toastr.success('La incidencia se ha marcado como "Terminada".', 'Incidencia modificada con éxito');
                    $('.tr_delivery_incidence[idi='+idi+']').remove()
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
    })
})

/** Comportamiento del botón de RECHAZAR */
$(document).on('click', '.removeIncidence', function () {
    let idi = $(this).attr('idi')

    swal.fire({
        title: '¿Deseas eliminar de forma definitiva esta incidencia?',
        html: '<fieldset class="form-group"><label for="rejectionReason"><b>Escribe aquí el motivo</b></label><textarea id="rejectionReason" class="rejectionReason form-control" rows="3" cols="95" style="height: 100px;"></textarea></fieldset>',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SI'
    }).then(function (resp) {
        if (resp['value'] == true) {
            let rejectionReason = $('.rejectionReason').val()
            $.ajax({
                type: 'POST',
                url: '/delivery-incidence/',
                data: {
                    idi: idi,
                    rejectionReason: rejectionReason,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'delete_delivery_incidence'
                },
                success: function() {
                    toastr.success('La incidencia se ha borrado de forma definitiva.', 'Incidencia borrada con éxito');
                    $('.tr_delivery_incidence[idi='+idi+']').remove()
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
    })
})

/** Comportamiento del botón de ENVIAR A RMA */
$(document).on('click', '.sendToRMA', function () {
    let idi = $(this).attr('idi')

    swal.fire({
        title: '¿Deseas enviar la incidencia a RMA?',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SI'
    }).then(function (resp) {
        if (resp['value'] == true) {
            $.ajax({
                type: 'POST',
                url: '/delivery-incidence/',
                data: {
                    idi: idi,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'rma_delivery_incidence'
                },
                success: function() {
                    toastr.success('La incidencia se ha enviado a RMA.', 'Incidencia enviada');
                    $('.tr_delivery_incidence[idi='+idi+']').css('background-color','#D7FBFF')
                    $('.td_state[idi='+idi+']').empty()
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
    })
})

/** Comportamiento del botón de ABONAR */
$(document).on('click', '.payRMA', function () {
    let idi = $(this).attr('idi')

    swal.fire({
        title: '¿Deseas marcar la incidencia como abonada?',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SI'
    }).then(function (resp) {
        if (resp['value'] == true) {
            $.ajax({
                type: 'POST',
                url: '/delivery-incidence/',
                data: {
                    idi: idi,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'pay_delivery_incidence'
                },
                success: function() {
                    toastr.success('Se ha enviado correo a Administración con los datos.', 'Incidencia abonada con éxito');
                    $('.tr_delivery_incidence[idi='+idi+']').remove()
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
    })
})

/** Comportamiento del botón de PENDIENTE NACEX */
$(document).on('click', '.nacexIncidence', function () {
    $('.addDeliveryBill').attr('idi',$(this).attr('idi'))
})

/** Comportamiento del botón de ENVIAR FACTURA DE TRANSPORTE */
$(document).on('click', '.addDeliveryBill', function () {
    let idi = $(this).attr('idi')
    let bill_name = $('.delivery_bill_name').val()

    var formData = new FormData();
        
    let pcount = 0;
    let pdfs = $('.delivery_bill_file').prop('files')
    for (i in pdfs){
        formData.append('p'+pcount, $('.delivery_bill_file').prop('files')[i]);
        pcount++;
    }
    formData.append('pcount', pcount);

    formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
    formData.append('action', 'send_nacex_bill');

    formData.append('idi', idi);
    formData.append('bill_name', bill_name);

    $.ajax({
        type: 'POST',
        url: '/delivery-incidence/',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function() {
            $('.tr_delivery_incidence[idi='+idi+']').css('background-color','#E0FFCD')
            $('.nacexIncidence[idi='+idi+']').remove()

            $('.td_state[idi='+idi+']').append(
                '<button type="button" class="btn btn-link success checkIncidence" style="margin-left:-30px; margin-right:-30px;font-size: 20px;" title="Terminar" idi="'+idi+'"><i class="fas fa-check-circle"></i></button>'
            )

            $('.td_bill_name[idi='+idi+']').append(
                bill_name
            )

            $("#addNacexBill").modal('hide')
            toastr.success('La factura ha sido enviada a NACEX correctamente.', 'Factura enviada con éxito');
            },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
})

/** Comportamiento al modificar el número de envío */
$(document).on('focusout', '.edited_delivery_number', function () {
    $('.message_issue').val('Incidencia de Transporte '+$('.edited_delivery_number').val()+' ('+$('.client_name').val()+')')
})

/** Comportamiento del botón de GALERÍA */
$(document).on('click', '.gallery', function (){
    imgIncidence(this);
 });


/** Función para mostrar las imágenes en el modal */
function imgIncidence(element){
    let id = $(element).attr('idi');
    $('.add-more-img').attr('this_idc',id)

    $.ajax({
        type: 'POST',
        url: '/delivery-incidence/',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            id: id,
            action: 'gallery_delivery_incidence'
        },
        
        success: function(json) {
            json = JSON.parse(json);
            console.log(json);

            if (json != '') {

                $(".img-container").html('');
            
                for (let i = 0; i < json.length; i++) {
                    $(".img-container").append(
                        '<div class="col-md-3" style="margin-bottom: 15px;">'+
                            '<a class="open-media" max="'+((json.length)-1)+'" order="'+i+'" media_id="'+json[i]['pk']+'" type="image" img_src="/dashboard/media/'+json[i]['fields']['file']+'">'+
                                '<img src="/dashboard/media/'+json[i]['fields']['file']+'" class="w-75 mx-auto d-block" style="height:160px;width:146px;padding;5px;float:left;margin:2px;left: 50%; transform: translate(15%, 0%);border-radius: 25px;">'+
                            '</a>'+
                        '</div>'
                    )
                }
                
                // Mostramos en grande la imagen o video seleccionado
                $(document).on("click", ".open-media", function() {
                    $('#GalleryModal').slideUp()
                    $('#ImageModal').slideDown()
                    $('.img-modal').empty()
                    let media_id = $(this).attr('media_id')
                    let order = $(this).attr('order')
                    let max = $(this).attr('max')
                    let url = $(this).attr('img_src')

                    let menor
                    let mayor

                    if (order > 0) {
                        order--
                        menor = order
                        order++
                    }
                    
                    if (order < max) {
                        order++
                        mayor = order
                    }

                    $('.img-modal').append(
                        '<a id="prev-media" max="'+max+'" order="'+menor+'" media_id="'+media_id+'" style="position:absolute;right: 150%; margin-top: 90%;"><i class="fas fa-chevron-left" style="color: white; font-size: 50px;"></i></a>'+
                            '<img src="'+url+'" class="img-gallery" width="1280" height="960" style="padding:30px; margin-top: 120px;"></img>'+
                        '<a id="next-media" max="'+max+'" order="'+mayor+'" media_id="'+media_id+'" style="position:absolute;right: -53%; margin-top: -77%;"><i class="fas fa-chevron-right" style="color: white; font-size: 50px;"></i></a>'
                    )

                    $(document).on("click", "#prev-media", function() {
                        let p_order = $(this).attr('order')
                        $(".open-media").each(function(){
                            let o_order = $(this).attr('order')
                            let o_max = $(this).attr('max')
                            let o_id = $(this).attr('media_id')
                            let o_url = $(this).attr('img_src')

                            let o_menor
                            let o_mayor

                            if (p_order == o_order) {

                                if (o_order > 0) {
                                    o_order--
                                    o_menor = o_order
                                    o_order++
                                }
                                
                                if (o_order < max) {
                                    o_order++
                                    o_mayor = o_order
                                }

                                $('.img-modal').empty()
                                $('.img-modal').append(
                                    '<a id="prev-media" max="'+o_max+'" order="'+o_menor+'" media_id="'+o_id+'" style="position:absolute;right: 150%; margin-top: 90%;"><i class="fas fa-chevron-left" style="color: white; font-size: 50px;"></i></a>'+
                                        '<img src="'+o_url+'" class="img-gallery" width="1280" height="960" style="padding:30px; margin-top: 120px;"></img>'+
                                    '<a id="next-media" max="'+o_max+'" order="'+o_mayor+'" media_id="'+o_id+'" style="position:absolute;right: -53%; margin-top: -77%;"><i class="fas fa-chevron-right" style="color: white; font-size: 50px;"></i></a>'
                                )
                            }
                        })
                    })

                    $(document).on("click", "#next-media", function() {
                        let n_order = $(this).attr('order')
                        $(".open-media").each(function(){
                            let o_order = $(this).attr('order')
                            let o_max = $(this).attr('max')
                            let o_id = $(this).attr('media_id')
                            let o_url = $(this).attr('img_src')

                            let o_menor
                            let o_mayor

                            if (n_order == o_order) {

                                if (o_order > 0) {
                                    o_order--
                                    o_menor = o_order
                                    o_order++
                                }
                                
                                if (o_order < max) {
                                    o_order++
                                    o_mayor = o_order
                                }

                                $('.img-modal').empty()
                                $('.img-modal').append(
                                    '<a id="prev-media" max="'+o_max+'" order="'+o_menor+'" media_id="'+o_id+'" style="position:absolute;right: 150%; margin-top: 90%;"><i class="fas fa-chevron-left" style="color: white; font-size: 50px;"></i></a>'+
                                        '<img src="'+o_url+'" class="img-gallery" width="1280" height="960" style="padding:30px; margin-top: 120px;"></img>'+
                                    '<a id="next-media" max="'+o_max+'" order="'+o_mayor+'" media_id="'+o_id+'" style="position:absolute;right: -53%; margin-top: -77%;"><i class="fas fa-chevron-right" style="color: white; font-size: 50px;"></i></a>'
                                )
                            }
                        })
                    })

                    $('#ImageModal').keyup(function (e) {
                        if (e.which == 27) {
                            $('#ImageModal').modal('toggle');
                            $('#GalleryModal').slideDown()
                        }
                    })

                    if (json.length == 0) {
                        $('#ImageModal').modal('hide');
                    } else {
                        $('#ImageModal').modal('show');
                    }
                })

            } else {

                $(".img-container").html('');
                $(".img-container").html('<h1>Sin Imagenes asignadas</h1>');

            }
        },
        error: function (xhr, errmsg, err) {
            //console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
     })
}

// Cerramos el modal de las imagenes con click
$(document).on("click", "#close-media", function() {
    $('#ImageModal').modal('toggle');
    $('#GalleryModal').slideDown()
})