// Función que valide que un campo no este vacío. Los campos de Título y descripción(task) no pueden estar vacíos.
function validateEmpty(string) {
    if (string != '') {
        return true;
    }
    return false;
}

// Incidencia solo para el Responsable del Departamento (DISPONIBLE SOLO PARA TU DEPARTAMENTO)
/* function showContentBoss() {
    destination_dept = $('.inc-destination_departament').val()
    source_dept = $('.inc-source_departament').val()
    if (destination_dept == source_dept) {
        $('.inc-boss_only').css("display", "block")
        $('.inc-boss_only').css("margin-left", "-6%")
        $('.inc-boss_only').css("margin-bottom", "-5.5%")
        $('.inc-label_check').css("margin-left", "10.5%")
    }
    else {
        $('.inc-boss_only').css("display", "none")
    }
}

$(".inc-destination_departament").change(function () {
    showContentBoss();
}); */

// Guardar una incidencia en la base de datos.
$(document).on('click', '.saveIncidences', function () {
    console.log("hola")
    $(this).attr("disabled", true);
    user_id = $('.inc-id').val();
    company_id = $('.inc-company_id').val();
    source_departament_id = $('.inc-source_departament').val();
    current_departament = $('.inc-source_departament').val();
    priority = $('.inc-priority').val();
    boss_only = $('.inc-boss_only').is(':checked');
    issue = $('.inc-issue').val().replaceAll('"', "'");
    description = $('.inc-description').val().replaceAll('"', "'");

    if (source_departament_id == 2) {
        source_departament_id = $('.inc-departament').val()
    }

    var formData = new FormData();

    let rcount = 0;
    let files = $('.incidencesimg').prop('files')

    formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
    formData.append('action', 'save_incidence');
    formData.append('user_id', user_id);
    formData.append('company_id', company_id);
    formData.append('source_departament_id', source_departament_id);
    formData.append('priority', priority);
    formData.append('boss_only', boss_only);
    formData.append('issue', issue);
    formData.append('description', description);

    for (i in files) {
        formData.append('r' + rcount, $('.incidencesimg').prop('files')[i]);
        rcount++;
    }
    formData.append('count', rcount);

    // Llamada AJAX
    if (validateEmpty(issue) && validateEmpty(description)) {
        $.ajax({
            type: 'POST',
            url: '/save-incidence/',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (respuesta) {
                $('.tagimg').val();
                $('.inc-issue').val('');
                $('.inc-description').val('');
                $('#IncidenceModal').modal('hide')
                toastr.success('Operación realizada con éxito', 'La incidencia ha sido añadida.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                let incidence = JSON.parse(respuesta);

                if (incidence['incidence'][0]['fields'].priority == 0) {
                    var priority_badge = 'badge-success'
                    var priority_text = 'BAJA'
                } else if (incidence['incidence'][0]['fields'].priority == 1) {
                    var priority_badge = 'badge-warning'
                    var priority_text = 'MEDIA'
                } else if (incidence['incidence'][0]['fields'].priority == 2) {
                    var priority_badge = 'badge-danger'
                    var priority_text = 'ALTA'
                }

                if (current_departament == 2) {
                    $('.incidences_list').prepend(
                        '<li class="todo-item" inc="' + incidence['incidence'][0]['pk'] + '" priority=' + incidence['incidence'][0]['fields'].priority + ' dept=' + incidence['incidence'][0]['fields'].destination_departament_id + ' user=' + incidence['incidence'][0]['fields'].user_id + ' issue=' + incidence['incidence'][0]['fields'].issue + ' state="0">' +
                        '<div class="todo-title-wrapper d-flex justify-content-between align-items-center">' +
                        '<span class="badge badge-primary badge-pill ml-25" style="width:40px; margin-right:1%">' + incidence['incidence'][0]['pk'] + '</span>' +
                        '<div class="todo-title-area d-flex">' +
                        '<p class="todo-title mx-50 m-0 truncate" inc="' + incidence['incidence'][0]['pk'] + '" state="0" data-toggle="modal" data-target="#IncidenceInfoModal" style="width:100%; margin-left: -1% !important;">' + incidence['incidence'][0]['fields'].issue + '</p>' +
                        '</div>' +
                        '<div class="todo-item-action d-flex align-items-center">' +
                        '<span class="badge badge-primary badge-pill ml-25 badge-state" style="width:100px;" inc="' + incidence['incidence'][0]['pk'] + '" state="0">Pendiente</span>' +
                        '<span class="badge badge-light badge-pill ml-25" style="width:180px; background-color: #B4B4B4;">' + incidence['user'][0]['fields'].first_name + ' ' + incidence['user'][0]['fields'].last_name + '</span>' +
                        '<input type="hidden" class="inc-sort-priority" value="' + incidence['incidence'][0]['fields'].priority + '">' +
                        '<span class="badge ' + priority_badge + ' badge-pill ml-25" style="width:70px;">' + priority_text + '</span>' +
                        '<a class="todo-item-assign ml-50" inc="' + incidence['incidence'][0]['pk'] + '" state="0" assigned="0"><i class="feather icon-plus" data-toggle="modal" data-target="#incidences_settings_modal"></i></a>' +
                        '<a class="todo-item-delete ml-50" style="color:red" inc="' + incidence['incidence'][0]['pk'] + '"><i class="feather icon-trash-2"></i></a>' +
                        '</div>' +
                        '</div>' +
                        '</li>'
                    )
                } else {
                    $('.incidences_list').prepend(
                        '<li class="todo-item" inc="' + incidence['incidence'][0]['pk'] + '" priority=' + incidence['incidence'][0]['fields'].priority + ' dept=' + incidence['incidence'][0]['fields'].destination_departament_id + ' user=' + incidence['incidence'][0]['fields'].user_id + ' issue=' + incidence['incidence'][0]['fields'].issue + ' state="0">' +
                        '<div class="todo-title-wrapper d-flex justify-content-between align-items-center">' +
                        '<span class="badge badge-primary badge-pill ml-25" style="width:40px; margin-right:1%">' + incidence['incidence'][0]['pk'] + '</span>' +
                        '<div class="todo-title-area d-flex">' +
                        '<p class="todo-title mx-50 m-0 truncate" inc="' + incidence['incidence'][0]['pk'] + '" state="0" data-toggle="modal" data-target="#IncidenceInfoModal" style="width:100%; margin-left: -1% !important;">' + incidence['incidence'][0]['fields'].issue + '</p>' +
                        '</div>' +
                        '<div class="todo-item-action d-flex align-items-center">' +
                        '<span class="badge badge-primary badge-pill ml-25 badge-state" style="width:100px" inc="' + incidence['incidence'][0]['pk'] + '" state="0">Pendiente</span>' +
                        '<span class="badge badge-light badge-pill ml-25" style="width:180px; background-color: #B4B4B4;">' + incidence['user'][0]['fields'].first_name + ' ' + incidence['user'][0]['fields'].last_name + '</span>' +
                        '<input type="hidden" class="inc-sort-priority" value="' + incidence['incidence'][0]['fields'].priority + '">' +
                        '<span class="badge ' + priority_badge + ' badge-pill ml-25" style="width:70px;">' + priority_text + '</span>' +
                        '<a class="todo-item-delete ml-50" style="color:red" inc="' + incidence['incidence'][0]['pk'] + '"><i class="feather icon-trash-2"></i></a>' +
                        '</div>' +
                        '</div>' +
                        '</li>'
                    )
                }

                $('.no-inc').slideUp()
                $('.saveIncidences').attr("disabled", false);

            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });

    } else {
        return toastr.error('No se pueden dejar vacíos ni el asunto ni la descripción.', 'Error');
    }
});

// Marcar una incidencia como finalizada o resuelta
$(document).on('click', '.inc-checkbox', function () {
    let inc_id = $(this).attr('inc')

    $('.todo-item').each(function (index) {
        if ($(this).attr('inc') == inc_id) {
            if (!$(this).hasClass('completed')) {
                $(this).addClass('completed')
                $(this).prop('checked', true)
                // Llamada AJAX
                $.ajax({
                    type: 'POST',
                    url: '/check-incidence/',
                    data: {
                        inc_id: inc_id,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        action: 'check_incidence'
                    },
                    success: function () {
                        $('.badge-state').each(function () {
                            if ($(this).attr('inc') == inc_id) {
                                $(this).text('Resuelta');
                            }
                        })

                        $('.todo-title').each(function () {
                            if ($(this).attr('inc') == inc_id) {
                                $(this).attr('state', 3);
                            }
                        })

                        toastr.success('La incidencia se ha marcado como resuelta', 'Incidencia resuelta');
                    },
                    error: function (xhr, errmsg, err) {
                        console.log(xhr.status + ": " + xhr.responseText);
                    }
                });
            } else {
                $(this).removeClass('completed')
                $(this).prop('checked', false)
                // Llamada AJAX
                $.ajax({
                    type: 'POST',
                    url: '/uncheck-incidence/',
                    data: {
                        inc_id: inc_id,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        action: 'uncheck_incidence'
                    },
                    success: function () {
                        $('.badge-state').each(function () {
                            if ($(this).attr('inc') == inc_id) {
                                $(this).text('Testeo');
                            }
                        })

                        $('.todo-title').each(function () {
                            if ($(this).attr('inc') == inc_id) {
                                $(this).attr('state', 2);
                            }
                        })

                        toastr.success('La incidencia se ha desmarcado como resuelta', 'Incidencia no resuelta');
                    },
                    error: function (xhr, errmsg, err) {
                        console.log(xhr.status + ": " + xhr.responseText);
                    }
                });
            }
        }
    });
});







// Borrar una incidencia cuando se pulsa en la papelera
$(document).on('click', '.todo-item-delete', function () {
    let item = $(this).attr('inc')
    $('.todo-item').each(function (index) {
        if ($(this).attr('inc') == item) {
            var inc = $(this)
            swal.fire({
                title: "¿Seguro que quieres borrar esta incidencia?",
                text: "Esta acción borrará la incidencia de la lista",
                type: 'question',
                showCancelButton: true,
                cancelButtonText: 'NO',
                confirmButtonText: 'SÍ'
            }).then(function (resp) {
                if (resp['value'] == true) {
                    inc.remove()
                    inc_id = item
                    // Llamada AJAX
                    $.ajax({
                        type: 'POST',
                        url: '/delete-incidence/',
                        data: {
                            inc_id: inc_id,
                            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                            action: 'delete_incidence'
                        },
                        success: function () {
                            toastr.success('Operación realizada con éxito', 'La incidencia ha sido eliminada.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                        },
                        error: function (xhr, errmsg, err) {
                            console.log(xhr.status + ": " + xhr.responseText);
                        }
                    });
                }
            });
        }
    });
});

//Obtener los datos de las incidencias
$(document).on('click', '.todo-title', function () {
    $('.img-container').empty()
    var user_id = $('.inc-id').val()
    var inc_id = $(this).attr('inc')
    var current_state = $(this).attr('state')
    var btn_edit_issue = $('.btn-edit_issue')
    var btn_edit_description = $('.btn-edit_description')
    var priority_item = $('.inc-priority_info')
    var btn_item = $('.updateIncidence')
    var departament_id = $('.inc-source_departament').val();
    company_id = $('.inc-company_id').val();

    btn_item.val(inc_id)

    $('.inc-issue_info').css('display', 'block')
    $('.inc-description_info').css('display', 'block')
    $('.inc-issue_edit').css('display', 'none')
    $('.inc-description_edit').css('display', 'none')
    btn_item.css('display', 'none')

    $.ajax({
        type: 'POST',
        url: '/get-incidence/',
        data: {
            inc_id: inc_id,
            user_id: user_id,
            company_id: company_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (respuesta) {
            let incidences = JSON.parse(respuesta);
            let as_name = incidences[0].as_fn.toUpperCase()
            let as_lname = incidences[0].as_ln.toUpperCase()
            let au_name = incidences[0].au_fn.toUpperCase()
            let au_lname = incidences[0].au_ln.toUpperCase()
            $('.inc-author').html(au_name+' '+au_lname)
               

            priority_item.removeClass('badge-success')
            priority_item.removeClass('badge-warning')
            priority_item.removeClass('badge-danger')

            if (incidences[0].priority == 0) {
                $('.inc-priority_info').html("BAJA")
                priority_item.addClass('badge-success')
            } else if (incidences[0].priority == 1) {
                $('.inc-priority_info').html("MEDIA")
                priority_item.addClass('badge-warning')
            } else if (incidences[0].priority == 2) {
                $('.inc-priority_info').html("ALTA")
                priority_item.addClass('badge-danger')
            }

            if ((incidences[0].user_id == user_id) || (departament_id == 2)) {
                btn_edit_issue.css('display', 'initial')
                btn_edit_description.css('display', 'initial')
            } else {
                btn_edit_issue.css('display', 'none')
                btn_edit_description.css('display', 'none')
            }

            $('.inc-issue_info').html(incidences[0].issue)
            $('.inc-description_info').html(incidences[0].description)
            $('.inc-issue_edit').val(incidences[0].issue)
            $('.inc-description_edit').val(incidences[0].description)

            if (current_state == 0) {
                $('.inc-state').html('PENDIENTE')
            } else if (current_state == 1) {
                $('.inc-state').html('EN CURSO')
            } else if (current_state == 2) {
                $('.inc-state').html('TESTEO')
            } else if (current_state == 3) {
                $('.inc-state').html('RESUELTA')
            } else if (current_state == 4) {
                $('.inc-state').html('FALTAN DATOS')
            }

            // Cambiar usuarios en 'Asignado a'
            /* --------------------------------------------------------------------------------------
                            Cambiar luego dependiendo los ID dentro de la BD real
            -------------------------------------------------------------------------------------- */
            $('.inc-assign').html(as_name+' '+as_lname)
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });

    $.ajax({
        type: 'POST',
        url: '/get-dates/',
        data: {
            inc_id: inc_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (respuesta) {
            let incidences = JSON.parse(respuesta);

            // Fecha de Inicio
            let start_date = new Date(incidences[0]['fields'].created_at);
            let dd = String(start_date.getDate()).padStart(2, '0');
            let mm = String(start_date.getMonth() + 1).padStart(2, '0');
            let yyyy = start_date.getFullYear();

            let hours = String(start_date.getHours()).padStart(2, '0');
            let minutes = String(start_date.getMinutes()).padStart(2, '0');

            let time = hours + ':' + minutes

            start_date = dd + '/' + mm + '/' + yyyy + ' - ' + time

            $('.inc-start_date').html(start_date)

            // Fecha de Finalización
            if (current_state == 3) {
                let finish_date = new Date(incidences[0]['fields'].update_at);
                let dd = String(finish_date.getDate()).padStart(2, '0');
                let mm = String(finish_date.getMonth() + 1).padStart(2, '0');
                let yyyy = finish_date.getFullYear();

                let hours = String(finish_date.getHours()).padStart(2, '0');
                let minutes = String(finish_date.getMinutes()).padStart(2, '0');

                let time = hours + ':' + minutes

                finish_date = dd + '/' + mm + '/' + yyyy + ' - ' + time

                $('.inc-finish_date').html(finish_date)
            } else {
                $('.inc-finish_date').html('NO HA FINALIZADO')
            }
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });

    $.ajax({
        type: 'POST',
        url: '/get-images/',
        data: {
            inc_id: inc_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (respuesta) {
            let media = JSON.parse(respuesta);
            for (let i = 0; i < media.length; i++) {
                $('.img-container').append(
                    '<img class="img-preview" style="cursor:pointer;padding:30px;" src="/dashboard/media/' + media[i]['fields'].incidence_img + '" width="100%" height="100%" data-toggle="modal" data-target="#img_modal"></img>'
                )
            }
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
});

// Ver imagen a tamaño más grande
$(document).on('click', '.img-preview', function () {
    let this_url = $(this).attr('src');
    $('.img-modal-container').empty()
    $('.image-title').text('Imagen de la incidencia')
    $('.img-modal-container').append(
        '<img class="" style="padding:30px;" src="' + this_url + '" width="100%" height="100%"></img>'
    )
})

// Cambiar el estado o asignar la incidencia a un miembro del departamento
$(document).on('click', '.todo-item-assign', function () {
    let inc_id = $(this).attr('inc')
    let current_state = $(this).attr('state')
    let current_assigned = $(this).attr('assigned')
    $('#modify_incidence').attr("inc", inc_id)
    // console.log(current_state)
    $('.settings-title').empty()
    $('.settings-title').text('Editar incidencia número ' + inc_id)


    // $('.settings-container').append(
    //     '<div class="col-1">'+
    //     '</div>'+
    //     '<div class="col-4">'+
    //         '<div class="form-group">'+
    //             '<label>Estado</label>'+
    //             '<select id="select-state" class="pres_consult_type form-control">'+
    //                 '<option class="new-state" value="0">Pendiente</option>'+
    //                 '<option class="new-state" value="1">En curso</option>'+
    //                 '<option class="new-state" value="2">Testeo</option>'+
    //                 '<option class="new-state" value="3">Resuelta</option>'+
    //             '</select>'+
    //         '</div>'+
    //     '</div>'+
    //     '<div class="col-4">'+
    //         '<div class="form-group">'+
    //             '<label>Asignar a</label>'+
    //             '<select id="select-assigned" class="pres_consult_type form-control">'+
    //                 '<option class="new-assigned" value="0">Sin asignar</option>'+
    //                 '<option class="new-assigned" value="1">Juanfran Rodríguez</option>'+
    //                 '<option class="new-assigned" value="2">Iván Rodríguez</option>'+
    //             '</select>'+
    //         '</div>'+
    //     '</div>'+
    //     '<div class="col-3">'+
    //         '<button type="button" id="modify_incidence" class="btn btn-primary btn-md" style="margin-top: 15%;" data-toggle="modal" data-target="#objetives_settings_modal" inc="'+inc_id+'">'+
    //             '<span class="d-md-block d-none">Guardar cambios</span>'+
    //         '</button>'+
    //     '</div>'+
    //     '<div class="col-1">'+
    //     '</div>'+
    //     '<div class="col-10">'+
    //         '<div class="form-group">'+
    //             '<label>Comentario</label>'+
    //             '<input type="text" class="incidence-comm form-control">'+
    //         '</div>'+
    //     '</div>'
    // )

    $("#select-state option[value=" + current_state + "]").attr("selected", true);
    $("#select-assigned option[value=" + current_assigned + "]").attr("selected", true);
})

// Modificar estado y asignado de la incidencia
$(document).on('click', '#modify_incidence', function () {
    let inc_id = $(this).attr('inc')
    let new_state = $('#select-state').val()
    let new_assigned = $('#select-assigned').val()
    let comm = $('.incidence-comm').val()
    // console.log(new_state)

    // Llamada AJAX
    if (new_state == '4' && !comm) {
        toastr.error('Tienes que rellenar el comentario')
    } else {
        $.ajax({
            type: 'POST',
            url: '/update-incidence/',
            data: {
                inc_id: inc_id,
                new_state: new_state,
                new_assigned: new_assigned,
                comm: comm,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'modify_incidence'
            },
            success: function () {
                $('.todo-title').each(function () {
                    if ($(this).attr('inc') == inc_id) {
                        $(this).attr('state', new_state)
                    }
                })

                $('.todo-item-assign').each(function () {
                    if ($(this).attr('inc') == inc_id) {
                        $(this).attr('state', new_state)
                        $(this).attr('assigned', new_assigned)
                    }
                })

                $('.badge-state').each(function () {
                    if ($(this).attr('inc') == inc_id) {
                        if (new_state == 0) {
                            $(this).html('PENDIENTE')

                            $('.todo-item').each(function () {
                                if ($(this).attr('inc') == inc_id) {
                                    $(this).removeClass('completed')
                                }
                            })

                            $('.inc-checkbox').each(function () {
                                if ($(this).attr('inc') == inc_id) {
                                    $(this).prop('checked', false)
                                }
                            })

                        } else if (new_state == 1) {
                            $(this).html('EN CURSO')

                            $('.todo-item').each(function () {
                                if ($(this).attr('inc') == inc_id) {
                                    $(this).removeClass('completed')
                                }
                            })

                            $('.inc-checkbox').each(function () {
                                if ($(this).attr('inc') == inc_id) {
                                    $(this).prop('checked', false)
                                }
                            })

                        } else if (new_state == 2) {
                            $(this).html('TESTEO')

                            $('.todo-item').each(function () {
                                if ($(this).attr('inc') == inc_id) {
                                    $(this).removeClass('completed')
                                }
                            })

                            $('.inc-checkbox').each(function () {
                                if ($(this).attr('inc') == inc_id) {
                                    $(this).prop('checked', false)
                                }
                            })

                        } else if (new_state == 3) {
                            $(this).html('RESUELTA')
                            $('.todo-item').each(function () {
                                if ($(this).attr('inc') == inc_id) {
                                    $(this).addClass('completed')
                                }
                            })

                            $('.inc-checkbox').each(function () {
                                if ($(this).attr('inc') == inc_id) {
                                    $(this).prop('checked', true)
                                }
                            })
                        } else if (new_state == 4) {
                            $(this).html('FALTAN DATOS')

                            $('.todo-item').each(function () {
                                if ($(this).attr('inc') == inc_id) {
                                    $(this).addClass('lessData')
                                }
                            })

                            $('.inc-checkbox').each(function () {
                                if ($(this).attr('inc') == inc_id) {
                                    $(this).prop('checked', false)
                                }
                            })

                        }
                    }
                })

                $('#incidences_settings_modal').modal('hide')
                toastr.success('Operación realizada con éxito', 'La incidencia ha sido modificada.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }
})

////// LISTA DE INCIDENCIAS //////
incMainFilter = $(".filter-main");
incPriorityFilter = $(".filter-priority");
incPrioritySort = $(".sort-priority");
var priorityFilter = -1
var arraySort;

// Clase Active para los filtros principales
$(".filter-all").click(function () {
    incMainFilter.find(".active").removeClass('active');
    $(this).addClass("active")
});

$(".filter-pending").click(function () {
    incMainFilter.find(".active").removeClass('active');
    $(this).addClass("active")
});

$(".filter-inprogress").click(function () {
    incMainFilter.find(".active").removeClass('active');
    $(this).addClass("active")
});

$(".filter-test").click(function () {
    incMainFilter.find(".active").removeClass('active');
    $(this).addClass("active")
});

$(".filter-finish").click(function () {
    incMainFilter.find(".active").removeClass('active');
    $(this).addClass("active")
});

$(".filter-data").click(function () {
    incMainFilter.find(".active").removeClass('active');
    $(this).addClass("active")
});

// Clase Active para los filtros de prioridad
$(".priority-low").click(function () {
    if ($(this).is(".active")) {
        $(this).removeClass('active');
    } else {
        incPriorityFilter.find(".active").removeClass('active');
        $(this).addClass("active")
    }
});

$(".priority-medium").click(function () {
    if ($(this).is(".active")) {
        $(this).removeClass('active');
    } else {
        incPriorityFilter.find(".active").removeClass('active');
        $(this).addClass("active")
    }
});

$(".priority-high").click(function () {
    if ($(this).is(".active")) {
        $(this).removeClass('active');
    } else {
        incPriorityFilter.find(".active").removeClass('active');
        $(this).addClass("active")
    }
});

// Clase Active para el sort
$(".sort-less").click(function () {
    if ($(this).is(".active")) {
        $(this).removeClass('active');
    } else {
        incPrioritySort.find(".active").removeClass('active');
        $(this).addClass("active")
    }
});

$(".sort-higher").click(function () {
    if ($(this).is(".active")) {
        $(this).removeClass('active');
    } else {
        incPrioritySort.find(".active").removeClass('active');
        $(this).addClass("active")
    }
});

// Barra de búsqueda de incidencias
$('.inc-search').keyup(function () {
    let search = $(this).val()
    let count = 0;
    $(".todo-item").each(function () {
        /* let element = $(this).attr('issue'); */
        if ($(this).text().search(new RegExp(search, "i")) < 0) {
            $(this).fadeOut();
        } else {
            $(this).show();
            count++;
        }
    });
});

// Función para filtrar las incidencias
$(".filtro").click(function () {
    showIncidences();
});

function showIncidences() {
    /* var myDept = $('.inc-source_departament').val() */
    var myUser = $('.inc-id').val()
    var contador = 0;
    let mainValue = incMainFilter.find(".active").attr('mainFilter')
    let priorityValue = incPriorityFilter.find(".active").attr('priorityFilter')
    let prioritySort = incPrioritySort.find(".active").attr('sort')
    // Si no hay marcada una prioridad, le damos un valor por defecto
    if (!incPriorityFilter.find(".active").attr('priorityFilter')) {
        priorityValue = priorityFilter
    }

    // Sort
    if (prioritySort == 0) {
        // Ordenados de menor a mayor prioridad
        arraySort = [];
        $('.todo-item ').each(function (index) {
            arraySort.push($(this))
        });

        var incidences_list = '';
        for (i in arraySort) {
            if (arraySort[i].attr('priority') == 0) {
                incidences_list += $(arraySort[i]).prop('outerHTML');
            }
        }
        for (i in arraySort) {
            if (arraySort[i].attr('priority') == 1) {
                incidences_list += $(arraySort[i]).prop('outerHTML');
            }
        }
        for (i in arraySort) {
            if (arraySort[i].attr('priority') == 2) {
                incidences_list += $(arraySort[i]).prop('outerHTML');
            }
        }
        $('.inc-container').html(incidences_list);

    } else if (prioritySort == 1) {
        // Ordenados de mayor a menor prioridad
        arraySort = [];
        $('.todo-item ').each(function (index) {
            arraySort.push($(this))
        });

        var incidences_list = '';
        for (i in arraySort) {
            if (arraySort[i].attr('priority') == 2) {
                incidences_list += $(arraySort[i]).prop('outerHTML');
            }
        }
        for (i in arraySort) {
            if (arraySort[i].attr('priority') == 1) {
                incidences_list += $(arraySort[i]).prop('outerHTML');
            }
        }
        for (i in arraySort) {
            if (arraySort[i].attr('priority') == 0) {
                incidences_list += $(arraySort[i]).prop('outerHTML');
            }
        }
        $('.inc-container').html(incidences_list);
    }

    // Comportamiento de los filtros - Estado y prioridad
    if (mainValue == 0) {
        if (priorityValue == -1) {
            // Se muestran todas las incidencias
            $('.todo-item').each(function (index) {
                $(this).show()
                contador++
            });
        } else if (priorityValue == 0) {
            // Se muestran todas las incidencias de prioridad baja
            $('.todo-item').each(function (index) {
                if (($(this)).attr('priority') == priorityValue) {
                    $(this).show()
                    contador++
                } else {
                    $(this).hide()
                }
            });
        } else if (priorityValue == 1) {
            // Se muestran todas las incidencias de prioridad media
            $('.todo-item').each(function (index) {
                if (($(this)).attr('priority') == priorityValue) {
                    $(this).show()
                    contador++
                } else {
                    $(this).hide()
                }
            });
        } else if (priorityValue == 2) {
            // Se muestran todas las incidencias de prioridad alta
            $('.todo-item').each(function (index) {
                if (($(this)).attr('priority') == priorityValue) {
                    $(this).show()
                    contador++
                } else {
                    $(this).hide()
                }
            });
        }
    } else if (mainValue == 1) {
        if (priorityValue == -1) {
            // Se muestran las incidencias pendientes
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 0) {
                    $(this).show()
                    contador++
                } else {
                    $(this).hide()
                }
            });
        } else if (priorityValue == 0) {
            // Se muestran las incidencias pendientes de prioridad baja
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 0) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });
        } else if (priorityValue == 1) {
            // Se muestran las incidencias pendientes de prioridad media
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 0) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });
        } else if (priorityValue == 2) {
            // Se muestran las incidencias pendientes de prioridad alta
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 0) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });
        }
    } else if (mainValue == 2) {
        if (priorityValue == -1) {
            // Se muestran incidencias en curso
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 1) {
                    $(this).show()
                    contador++
                } else {
                    $(this).hide()
                }
            });
        } else if (priorityValue == 0) {
            // Se muestran incidencias en curso de prioridad baja
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 1) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });
        } else if (priorityValue == 1) {
            // Se muestran incidencias en curso de prioridad media
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 1) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });
        } else if (priorityValue == 2) {
            // Se muestran incidencias en curso de prioridad alta
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 1) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });
        }
    } else if (mainValue == 3) {
        if (priorityValue == -1) {
            // Se muestran las incidencias resueltas
            $('.todo-item').each(function (index) {
                if ($(this).is('.completed')) {
                    $(this).show()
                    contador++
                } else {
                    $(this).hide()
                }
            });
        } else if (priorityValue == 0) {
            // Se muestran las incidencias resueltas de prioridad baja
            $('.todo-item').each(function (index) {
                if ($(this).is('.completed')) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });
        } else if (priorityValue == 1) {
            // Se muestran las incidencias resueltas de prioridad media
            $('.todo-item').each(function (index) {
                if ($(this).is('.completed')) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });
        } else if (priorityValue == 2) {
            // Se muestran las incidencias resueltas de prioridad alta
            $('.todo-item').each(function (index) {
                if ($(this).is('.completed')) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });
        }
    } else if (mainValue == 4) {
        if (priorityValue == -1) {
            // Se muestran todas las incidencias en testeo
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 2) {
                    $(this).show()
                    contador++
                } else {
                    $(this).hide()
                }
            });

        } else if (priorityValue == 0) {
            // Se muestran las incidencias en testeo de prioridad baja
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 2) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });

        } else if (priorityValue == 1) {
            // Se muestran las incidencias en testeo de prioridad media
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 2) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });

        } else if (priorityValue == 2) {
            // Se muestran las incidencias en testeo de prioridad alta
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 2) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });
        }
    } else if (mainValue == 5) {
        if (priorityValue == -1) {
            // Se muestran todas las incidencias en testeo
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 4) {
                    $(this).show()
                    contador++
                } else {
                    $(this).hide()
                }
            });

        } else if (priorityValue == 0) {
            // Se muestran las incidencias en testeo de prioridad baja
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 4) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });

        } else if (priorityValue == 1) {
            // Se muestran las incidencias en testeo de prioridad media
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 4) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });

        } else if (priorityValue == 2) {
            // Se muestran las incidencias en testeo de prioridad alta
            $('.todo-item').each(function (index) {
                if (($(this)).attr('state') == 4) {
                    if (($(this)).attr('priority') == priorityValue) {
                        $(this).show()
                        contador++
                    } else {
                        $(this).hide()
                    }
                } else {
                    $(this).hide()
                }
            });
        }
    }

    // Mensaje que indique que no hay incidencias con esos filtros
    $('.no-inc').remove()
    if (contador == 0) {
        $('.incidences_list').append(
            '<li class="no-inc" style="text-align: center; margin-top: 2%"><h4>No hay incidencias con esos filtros</h4></li>'
        )
    }
}

function updateScroll() {
    $("#commentaries").animate({ scrollTop: $('#commentaries').prop("scrollHeight") }, 1000);
}

//Uso de los botones de editar el asunto y la descripción
$(document).on('click', '.btn-edit_issue', function () {
    var $this = $(this);
    var btn_edit_description = $('.btn-edit_description')
    var info_issue = $('.inc-issue_info')
    var edit_issue = $('.inc-issue_edit')
    var btn_item = $('.updateIncidence')

    if ($this.is(".active")) {
        $this.removeClass('active');
        info_issue.css('display', 'block')
        edit_issue.css('display', 'none')

        if (!btn_edit_description.is(".active")) {
            btn_item.css('display', 'none')
        }

        btn_item.removeClass('issue')
    } else {
        $this.addClass("active")
        info_issue.css('display', 'none')
        edit_issue.css('display', 'block')
        btn_item.css('display', 'block')
        btn_item.addClass('issue')

        if ($('.btn-edit_description').is(".active")) {
            $('.btn-edit_description').removeClass('active');
            $('.inc-description_info').css('display', 'block')
            $('.inc-description_edit').css('display', 'none')
            btn_item.removeClass('description')
        }
    }
});

$(document).on('click', '.btn-edit_description', function () {
    var $this = $(this);
    var btn_edit_issue = $('.btn-edit_issue')
    var info_description = $('.inc-description_info')
    var edit_description = $('.inc-description_edit')
    var btn_item = $('.updateIncidence')

    if ($this.is(".active")) {
        $this.removeClass('active');
        info_description.css('display', 'block')
        edit_description.css('display', 'none')

        if (!btn_edit_issue.is(".active")) {
            btn_item.css('display', 'none')
        }

        btn_item.removeClass('description')
    } else {
        $this.addClass("active")
        info_description.css('display', 'none')
        edit_description.css('display', 'block')
        btn_item.css('display', 'block')
        btn_item.addClass('description')

        if ($('.btn-edit_issue').is(".active")) {
            $('.btn-edit_issue').removeClass('active');
            $('.inc-issue_info').css('display', 'block')
            $('.inc-issue_edit').css('display', 'none')
            btn_item.removeClass('issue')
        }
    }
});

// Guardar los cambios realizados en las incidencias
$('.updateIncidence').click(function () {
    company_id = $('.inc-company_id').val();
    inc_id = $('.updateIncidence').val()

    var user_id = $('.inc-id').val()
    var issue = $('.inc-issue_edit').val().replaceAll('"', "'")
    var description = $('.inc-description_edit').val().replaceAll('"', "'")

    var info_issue = $('.inc-issue_info')
    var info_description = $('.inc-description_info')
    var edit_issue = $('.inc-issue_edit')
    var edit_description = $('.inc-description_edit')
    var btn_item = $('.updateIncidence')

    var modified
    if ($(this).hasClass('issue')) {
        modified = 'Título'
    } else if ($(this).hasClass('description')) {
        modified = 'Descripción'
    }

    if (validateEmpty(issue) && validateEmpty(description)) {
        $.ajax({
            type: 'POST',
            url: '/update-incidence/',
            data: {
                company_id: company_id,
                inc_id: inc_id,
                user_id: user_id,
                issue: issue,
                description: description,
                modified: modified,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'update_incidence'
            },
            success: function (result) {
                if (result == "error") {
                    return toastr.error('No puedes modificar incidencias que no sean tuyas.', 'Error');
                } else {
                    info_issue.css('display', 'block')
                    info_description.css('display', 'block')
                    edit_issue.css('display', 'none')
                    edit_description.css('display', 'none')
                    btn_item.css('display', 'none')
                    $('.inc-issue_info').html(issue)
                    $('.inc-description_info').html(description)
                    toastr.success('Operación realizada con éxito', 'La incidencia ha sido modificada.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                }

                $('.todo-title').each(function (index) {
                    if ($(this).attr('inc') == inc_id) {
                        $(this).text(issue)
                    }
                })
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    } else {
        return toastr.error('No se pueden dejar vacíos ni el asunto ni la descripción.', 'Error');
    }
});

// Guardar un comentario en la base de datos
$('.saveComment').click(function () {
    inc_id = $('.updateIncidence').val()
    commentator = $('.inc-id').val();
    company_id = $('.inc-company_id').val();
    content = $('.inc-comment').val();

    user_data = $('.user-name').text()
    avatar = $('.inc-avatar').val()

    // Ajustamos la fecha para los comentarios
    var d = new Date();
    var day = d.getDate();
    if (day < 10) {
        day = '0' + day
    }
    var month = d.getMonth() + 1;
    if (month < 10) {
        month = '0' + month
    }
    var year = d.getFullYear();
    var hour = d.getHours();
    var minutes = d.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    var date = (day + '/' + month + '/' + year + ' - ' + hour + ':' + minutes)

    var name = user_data.split(' ')[0]
    var surname = user_data.split(' ')[1]
    var div_id = (name + surname + day + month + year + hour + minutes)

    // Llamada AJAX
    if (validateEmpty(content)) {
        $.ajax({
            type: 'POST',
            url: '/save-comment/',
            data: {
                inc_id: inc_id,
                commentator: commentator,
                company_id: company_id,
                content: content,
                date: date,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'save_comment'
            },
            success: function () {
                let cont_box_u = 0
                let cont_box_o = 0

                $('.box_user').each(function (index) {
                    cont_box_u++
                })

                $('.box_other').each(function (index) {
                    cont_box_o++
                })

                if ((cont_box_u == 0) && (cont_box_o == 0)) {
                    $('.commentaries_list').empty()
                }

                $('.inc-comment').val('');
                $('.commentaries_list').append(
                    '<div>' +
                    '<div class="avatar avatar_user"><img src="/dashboard/staticfiles/images/portrait/small/' + avatar + '"></div>' +
                    '<div class="box_user">' +
                    '<div>' +
                    '<p class="comm_user">' + content + '</p>' +
                    '</div>' +
                    '<div id="' + div_id + '">' +
                    '<span class="chat-time info_user">' + user_data + ' - ' + date + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                )
                setTimeout(function () { updateScroll(); }, 500);
                toastr.success('Operación realizada con éxito', 'El comentario ha sido añadido.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    } else {
        return toastr.error('El comentario no puede estar vacío', 'Error');
    }
});

//Mostrar imagenes al pulsar el boton
let idimg
$('.classimg').on('click', function () {
    idimg = $(this).attr('inc');
});

$('.showimg').on('click', function () {

    console.log(idimg);

    $.ajax({
        type: 'POST',
        url: '/incidences-management/',
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            id: idimg,
            action: 'get-img'
        },

        success: function (json) {
            console.log(json);
            json = JSON.parse(json);
            // console.log(json);
            $(".img-container").html('');

            for (let i = 0; i < json.length; i++) {
                console.log(json[i]['fields']['incidence_img'])
                $(".img-container").append('<img src="/dashboard/media/' + json[i]['fields']['incidence_img'] + '" alt="imagenes" class="w-75 mx-auto d-block">')
                $(".img-container").append('<hr/>')

                /*http://localhost:8000/dashboard/media/exp/order_91/7-74293_la-siguiente-playstation-playstation-4-logo-png.png*/


            }
        },
        error: function (xhr, errmsg, err) {
            //console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    })
});

// Ocultar los checkbox a quien no debe verlos
$('.inc-checkbox').each(function () {
    let box = $(this)
    if ($('.user_id').val() != 64) {
        box.parent().remove()
    }
})