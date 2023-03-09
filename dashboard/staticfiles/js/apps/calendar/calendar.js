// Función que valide que un campo no este vacío. Los campos de Título y descripción(task) no pueden estar vacíos.
function validateEmpty(string) {
    if (string != '') {
        return true;
    }
    return false;
}

// Day Off - Holidays
function showContentHolidays() {
    element = document.getElementById("content_day_off");
    check = document.getElementById("day_off");
    if (check.checked) {
        element.style.display='none';
    }
    else {
        element.style.display='block';
    }
}

// Redimensionar el Select
$(document).ready(function() {
	$('#resizing_select').change(function(){
		$("#width_tmp_option").html($('#resizing_select option:selected').text()); 
		$(this).width($("#width_tmp_select").width());  
	});
});

// Fecha actual
var fecha = new Date();
var day = fecha.getDate();
if (day < 10) {
    day = "0"+day
}
var month = fecha.getMonth();
var months = new Array ("01","02","03","04","05","06","07","08","09","10","11","12");
var year = fecha.getFullYear();
var diasMes = new Date(year, months[month], 0).getDate();

// Damos valor a algunos input con la fecha actual
date = (year+"-"+months[month]+"-"+day);
document.getElementById('date_now2').value = date;

// Hora actual
hour = fecha.getHours();
minutes = fecha.getMinutes();
if (hour <10) {
	hour = '0'+hour;
}
if (minutes <10) {
	minutes = '0'+minutes;
}

// Damos valor a algunos input con la hora actual
time = (hour+':'+minutes+':00');

// Función para sacar datos de companies
/* $.ajax({
    type: 'POST',
    url: '/get-company/',
    data: {
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        action: 'get_companies'
    },
    success: function (respuesta) {
        let companies = JSON.parse(respuesta);
        min_vacations = (companies[0]['fields'].min_vacations);
        max_vacations = (companies[0]['fields'].max_vacations);
        company_vacations_days = (companies[0]['fields'].vacation_days);
        vacations_range = (companies[0]['fields'].vacations_range);
        start_day = (companies[0]['fields'].start_day);
        end_day = (companies[0]['fields'].end_day);
        if (vacations_range == false) {
            $('.hd-date2').prop("disabled", true)
        } else {
            $('.hd-date2').prop("disabled", false)
        }
    },
    error: function (xhr, errmsg, err) {
        console.log(xhr.status + ": " + xhr.responseText);
    }
}); */

// Función que saca los días laborables
function workingDays(dateFrom, dateTo) {
    var startDate = moment(dateFrom, 'YYYY-MM-DD');
    var finishDate = moment(dateTo, 'YYYY-MM-DD');
    var days = 0;
    
    while (!startDate.isAfter(finishDate)) {
        // Si no es sabado ni domingo
        if (startDate.isoWeekday() !== 6 && startDate.isoWeekday() !== 7) {
              days++;
        }
        startDate.add(1, 'days');
    }
    return days;
}

// Función que, en un rango de fechas, te calcula cuantos días no laborables hay.
function calculateDays(dateFrom) {
    var startDate = moment(dateFrom, 'YYYY-MM-DD');
    var contador = 0;
    var days = 0;
    
    while (contador < max_vacations) {
        if (startDate.isoWeekday() !== 6 && startDate.isoWeekday() !== 7) {
            contador++;
        } else {
            days++;
        }
        startDate.add(1, 'days');
    }
    return days;
}

// Función que guarda las vacaciones en la base de datos.
$(document).on('click', '.addAbsencee', function () {
    user_id = $('.user_id').val();
    departament_id = $('.departament_id').val();
    absence_type = $('.absence_type').val()
    description = $('.absence_description').val()
    start_date = $('.hd-date1').val();
    finish_date = $('.hd-date2').val();

    vacations_range = vacations_range;
    vacation_days = $('.hd-vacation_days').val();
    
    //Validamos si las vacaciones son o no correctas en función de los días que se cogen y los que quedan.
    if (vacations_range == false) {
        startDate = moment(start_date);
        finishDate = moment(finish_date);
        work_days = workingDays(startDate, finishDate);
        if (absence_type != 0) {
            if (work_days == min_vacations) {
                if (startDate.isoWeekday() >=start_day && startDate.isoWeekday() <=end_day) {
                    vacation_days = vacation_days +++ work_days;
                    if (vacation_days >= company_vacations_days) {
                        return toastr.error('No dispones de días de vacaciones.', 'Error');
                    } else {
                        $('.hd-vacation_days').val(vacation_days)
                    }
                } else {
                    return toastr.error('El día seleccionado no es válido.', 'Error');
                }	
            } else if (work_days == max_vacations) {
                if (startDate.isoWeekday() == start_day) {
                    vacation_days = vacation_days +++ work_days;
                    if (vacation_days >= company_vacations_days) {
                        return toastr.error('No dispones de tantos días de vacaciones.', 'Error');
                    } else {
                        $('.hd-vacation_days').val(vacation_days)
                    }
                } else {
                    return toastr.error('Los días seleccionados no son válidos.', 'Error');
                }
            } else {
                return toastr.error('No te puedes coger días libres en un fin de semana', 'Error');
            }
        } else {
            return toastr.error('Debes seleccionar un tipo de ausencia.', 'Error');
        }
    } else {
        startDate = moment(start_date);
        finishDate = moment(finish_date);
        work_days = workingDays(startDate, finishDate);
        if (absence_type != 0) {
            if ((work_days >= min_vacations) && (work_days <= max_vacations)) {
                vacation_days = vacation_days +++ work_days;
                if (vacation_days >= company_vacations_days) {
                    return toastr.error('No dispones de días de vacaciones suficientes.', 'Error');
                } else {
                    $('.hd-vacation_days').val(vacation_days)
                }
            } else {
                return toastr.error('Sólo se permiten rangos de días entre '+min_vacations+' y '+max_vacations, 'Error');
            }
        } else {
            return toastr.error('Debes seleccionar un tipo de ausencia.', 'Error');
        }
    }

    // Llamada AJAX
    /* $.ajax({
        type: 'POST',
        url: '/save-holidays/',
        data: {
            user_id: user_id,
            departament_id: departament_id,
            vacation_days: vacation_days,
            start_date: start_date,
            finish_date: finish_date,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'save_holidays'
        },
        success: function(respuesta) {
            $(".hd-vacation_days").value = vacation_days
            $('.absence_description').val('')
            toastr.success('Quedan '+(company_vacations_days-vacation_days)+' días de vacaciones.', 'Las vacaciones han sido añadidas.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            let vacations = JSON.parse(respuesta);

            // Formateamos las fechas de inicio y de fin de las vacaciones para que se muestren correctamente. 
            let months = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

            let start_day = vacations['vacations'][0]['fields'].start_date.split('-')[2]
            let start_month = vacations['vacations'][0]['fields'].start_date.split('-')[1]
            start_month = (start_month.split('0')[1])-1
            let start_year = vacations['vacations'][0]['fields'].start_date.split('-')[0]
            let full_start = start_day+' de '+months[start_month]+' de '+start_year

            let finish_day = vacations['vacations'][0]['fields'].finish_date.split('-')[2]
            let finish_month = vacations['vacations'][0]['fields'].finish_date.split('-')[1]
            finish_month = (finish_month.split('0')[1])-1
            let finish_year = vacations['vacations'][0]['fields'].finish_date.split('-')[0]
            let full_finish = finish_day+' de '+months[finish_month]+' de '+finish_year

            $("tbody.vacations-data").each(function () {
                let table = $(this)
                table.append(
                    '<tr class="vacations-data new" vacations_id="'+vacations['vacations'][0]['pk']+'">'+
                        '<td class="text-center">'+
                            '<input type="hidden" class="vacations-data vacations-id" value="'+vacations['vacations'][0]['pk']+'">'+
                            '<input type="hidden" class="vacations-data user-id" value="'+vacations['vacations'][0]['fields'].user_id+'">'+
                            '<p class="vacations-data vacations-names"><a href="{% url \'users-management\' %}'+vacations['vacations'][0]['fields'].user_id+'">'+vacations['account'][0]['fields'].first_name+' '+vacations['account'][0]['fields'].last_name+'</a></p>'+
                        '</td>'+
                        '<td class="text-center">'+
                            '<input type="hidden" class="vacations-data departament-id" value="'+vacations['vacations'][0]['fields'].departament_id+'">'+
                            '<p class="vacations-data vacations-departament_name">'+vacations['departament'][0]['fields'].name+'</p>'+
                        '</td>'+
                        '<td class="text-center">'+
                            '<p class="vacations-data vacations-start_date">'+full_start+'</p>'+
                        '</td>'+
                        '<td class="text-center">'+
                            '<p class="vacations-data vacations-finish_date">'+full_finish+'</p>'+
                        '</td>'+
                        '<td class="text-center">'+
                            '<p class="vacations-data vacations-state">'+vacations['vacations'][0]['fields'].state+'</p>'+
                        '</td>'+
                        '<td class="text-center vacations-actions">'+
                        '</td>'+
                    '</tr>'
                )

                $("tr.vacations-data.new").each(function () {
                    let row = $(this)
                    
                    if (row.attr('vacations_id') == vacations['vacations'][0]['pk']) {
                        if (vacations['departament'][0]['fields'].manager == user_id) {
                            
                            if (vacations['vacations'][0]['fields'].state == 'Pendientes') {
                                let item = row.find('td.vacations-actions')
                                item.append(
                                    '<i class="feather icon-check accept-vacations new" style="color:#77D797; cursor: pointer; font-size: 18px; padding: 5px;" vacations_id="'+vacations['vacations'][0]['pk']+'" accepted="False"></i>'+
                                    '<i class="feather icon-edit-2 edit-vacations new" style="color:#00b5b8; cursor: pointer; font-size: 18px; padding: 5px;" data-toggle="modal" data-target="#EditingModal" vacations_id="'+vacations['vacations'][0]['pk']+'" accepted="False"></i>'+
                                    '<i class="feather icon-trash-2 delete-vacations new" style="color:#F55F5F; cursor: pointer; font-size: 18px; padding: 5px;" vacations_id="'+vacations['vacations'][0]['pk']+'" accepted="False"></i>'
                                )
                            } else if (vacations['vacations'][0]['fields'].state == 'Aceptadas') {
                                let item = row.find('td.vacations-actions')
                                item.append(
                                    '<i class="feather icon-edit-2 edit-vacations new" style="color:#00b5b8; cursor: pointer; font-size: 18px; padding: 5px;" data-toggle="modal" data-target="#EditingModal" vacations_id="'+vacations['vacations'][0]['pk']+'" accepted="True"></i>'+
                                    '<i class="feather icon-trash-2 delete-vacations new" style="color:#F55F5F; cursor: pointer; font-size: 18px; padding: 5px;" vacations_id="'+vacations['vacations'][0]['pk']+'" accepted="True"></i>'
                                )
                            }
                        } else {
                            let item = row.find('td.vacations-actions')
                            item.append(
                                '<i class="feather icon-edit-2 edit-vacations new" style="color:#00b5b8; cursor: pointer; font-size: 18px; padding: 5px;" data-toggle="modal" data-target="#EditingModal" vacations_id="'+vacations['vacations'][0]['pk']+'" accepted="False"></i>'+
                                '<i class="feather icon-trash-2 delete-vacations new" style="color:#F55F5F; cursor: pointer; font-size: 18px; padding: 5px;" data-toggle="modal" data-target="#EditingModal" vacations_id="'+vacations['vacations'][0]['pk']+'" accepted="False"></i>'
                            )
                        }

                        // Aceptar peticiones de vacaciones que aun no están aceptadas
                        $(".accept-vacations.new").click(function () {
                            let vacations_id = $(this).attr('vacations_id')

                            // Llamada AJAX
                            $.ajax({
                                type: 'POST',
                                url: '/accept-pending-vacations/',
                                data: {
                                    vacations_id: vacations_id,
                                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                    action: 'accept_pending_vacations'
                                },
                                success: function(respuesta) {
                                    $("tr.vacations-data").each(function () {
                                        let row = $(this)
                                        let row_id = row.find('.vacations-id').val()
                                        if (row_id == vacations_id) {
                                            row.find('.vacations-state').text(respuesta)
                                            row.find('.accept-vacations').remove()
                                            let edit_btn = row.find('.edit-vacations')
                                            edit_btn.attr('accepted', 'True')
                                            let delete_btn = row.find('.delete-vacations')
                                            delete_btn.attr('accepted', 'True')
                                            dataTable()
                                        }
                                    })
                                    dataTable()
                                },
                                error: function (xhr, errmsg, err) {
                                    console.log(xhr.status + ": " + xhr.responseText);
                                }
                            });
                        })

                        // Editar vacaciones
                        $(".edit-vacations.new").click(function () {
                            let vacations_id = $(this).attr('vacations_id')
                            $("tr.vacations-data").each(function () {
                                if ($(this).attr('vacations_id') == vacations_id) {
                                    let user_id = $(this).find('input.user-id').val()
                                    let departament_id = $(this).find('input.departament-id').val()
                        
                                    // Llamada AJAX
                                    $.ajax({
                                        type: 'POST',
                                        url: '/get-editing-vacations/',
                                        data: {
                                            vacations_id: vacations_id,
                                            user_id: user_id,
                                            departament_id: departament_id,
                                            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                            action: 'get_editing_vacations'
                                        },
                                        success: function(respuesta) {
                                            let info = JSON.parse(respuesta);
                                            $('.editing-departament').text(info['departament'][0]['fields'].name)
                                            $('.editing-start').val(info['vacations'][0]['fields'].start_date)
                                            $('.editing-finish').val(info['vacations'][0]['fields'].finish_date)
                        
                                            $('.editing-names').empty()
                                            $('.editing-names').append(
                                                '<div class="avatar avatar_user editing-avatar"><img src="/dashboard/staticfiles/images/portrait/small/'+info['account'][0]['fields'].avatar+'"></div>'+
                                                '<p style="margin-top: 2px;margin-left: 15%;font-weight: bold;">'+info['account'][0]['fields'].first_name+' '+info['account'][0]['fields'].last_name+'</p>'
                                            )

                                            $('.updateVacations').attr('vacations_id', vacations_id)
                                        },
                                        error: function (xhr, errmsg, err) {
                                            console.log(xhr.status + ": " + xhr.responseText);
                                        }
                                    });
                                }
                            })
                        })

                        // Borrar vacaciones
                        $(".delete-vacations.new").click(function () {
                            let vacations_id = $(this).attr('vacations_id')
                            if ($(this).attr('accepted') == 'False') {
                                // Llamada AJAX
                                $.ajax({
                                    type: 'POST',
                                    url: '/delete-pending-vacations/',
                                    data: {
                                        vacations_id: vacations_id,
                                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                        action: 'delete_pending_vacations'
                                    },
                                    success: function() {
                                        toastr.success('Operación realizada con éxito', 'Vacaciones rechazadas con éxito.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                                        $("tr.vacations-data").each(function () {
                                            let row = $(this)
                                            let row_id = row.find('.vacations-id').val()
                                            if (row_id == vacations_id) {
                                                $(row).remove()
                                            }
                                        })
                                        dataTable()
                                    },
                                    error: function (xhr, errmsg, err) {
                                        console.log(xhr.status + ": " + xhr.responseText);
                                    }
                                });
                            } else if ($(this).attr('accepted') == 'True') {
                                swal.fire({
                                    title: "¿Seguro que quieres borrar estas vacaciones?",
                                    text: "Esta acción solo podrá revertirla el administrador de la empresa",
                                    type: 'question',
                                    showCancelButton: true,
                                    cancelButtonText: 'NO',
                                    confirmButtonText: 'SÍ'
                                }) .then(function (resp) {
                                    if (resp['value'] == true) {
                                        // Llamada AJAX
                                        $.ajax({
                                            type: 'POST',
                                            url: '/delete-accepted-vacations/',
                                            data: {
                                                vacations_id: vacations_id,
                                                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                                                action: 'delete_accepted_vacations'
                                            },
                                            success: function() {
                                                toastr.success('Operación realizada con éxito', 'Vacaciones eliminadas con éxito.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                                                $("tr.vacations-data").each(function () {
                                                    let row = $(this)
                                                    let row_id = row.find('.vacations-id').val()
                                                    if (row_id == vacations_id) {
                                                        $(row).remove()
                                                    }
                                                })
                                                dataTable()
                                            },
                                            error: function (xhr, errmsg, err) {
                                                console.log(xhr.status + ": " + xhr.responseText);
                                            }
                                        });
                                    }
                                })
                            }
                        })
                    }
                })
            })
            $('#CalendarModal').modal('hide')
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    }); */
});