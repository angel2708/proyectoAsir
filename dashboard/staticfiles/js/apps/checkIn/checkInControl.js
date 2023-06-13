/** JS PARA CONTROL HORARIO */
$('.loading-banner').hide();

table_time_control = $('#time_control_table').DataTable({
    dom: 'Bfrtip',
    buttons: [{
            extend: 'csvHtml5',
            fieldSeparator: ';',
            bom: true
            //..other options
        },
        'excel',
        'pdf'
    ],
    'order': [[0, 'asc']],
    pageLength : 20,
    "language": {

            "sProcessing":     "Procesando...",
            "sLengthMenu":     "Mostrar _MENU_ registros",
            "sZeroRecords":    "No se encontraron resultados",
            "sEmptyTable":     "Ningún dato disponible en esta tabla",
            "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
            "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0",
            "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix":    "",
            "sSearch":         "Buscar:",
            "sUrl":            "",
            "sInfoThousands":  ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
            "sFirst":    "Primero",
            "sLast":     "Último",
            "sNext":     "Siguiente",
            "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

    }
});

table_time_control.draw();
$('#time_control_table').show()

$(".buttons-excel").hide();
$(".buttons-csv").hide();
$(".buttons-pdf").hide();

$("#excelExport").on("click", function() {
    $(".buttons-excel").trigger("click");
});
$("#csvExport").on("click", function() {
    $(".buttons-csv").trigger("click");
});
$("#pdfExport").on("click", function() {
    $(".buttons-pdf").trigger("click");
});

//** Mostrar mes y año actual */
let date = new Date()
let month_list = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
let week_list = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves' ,'Viernes', 'Sábado']
let current_month = date.getMonth()
let current_year = date.getFullYear()
let current_day = date.getDate()
$('.current-month').text(month_list[current_month]+' '+current_year)
let current = 1
$('.arrow-next').hide()

let new_month = current_month
let new_year = current_year

let utc = (date.getTimezoneOffset())/-60

//** Establecemos los usuario que pueden ver los filtros --- JORGE, ÁLVARO, JOSEMI, PICHEL, JUANFRAN */
let user_id = $('.user-id').val()
if (user_id == 18 || user_id == 64 || user_id == 25 || user_id == 36 || user_id == 43 ) {
    $('.dept-filter').show()

    $('.content-rightt').each(function() {
        $(this).addClass('content-right')
    })

    $('.control-th').each(function() {
        $(this).css('width','19%')
    })
} else {
    $('.control-th').each(function() {
        $(this).css('width','19%')
    })
}

//** Cambiar de mes utilizando las flechas */
$(document).on('click', '.arrow-back', function () {
    $('#time_control_table').hide()
    $('.loading-banner').show();
    $('#slot_list').hide();
    $('#slot_list').empty()
    new_month = new_month-1
    if (new_month < 0) {
        new_year = new_year-1
        new_month = 11
        $('.export-year').val(new_year)
    }

    $('.current-month').text(month_list[new_month]+' '+new_year)
    $('.export-month').val(new_month+1)
    current = 0
    $('.arrow-next').show()

    let month_days = new Date(new_year, new_month+1, 0).getDate();
    calculateControl(new_year, new_month, month_days)

    nm = new_month+1
    if (nm < 10) {
        nm = '0'+(new_month+1)
        $('.export-month').val(nm)
    } else {
        $('.export-month').val(new_month+1)
    }

    if ($('.user-id').val() == 18 || $('.user-id').val() == 25 || $('.user-id').val() == 36 || $('.user-id').val() == 43 || $('.user-id').val() == 64) {
        $('.export-href').attr('href','https://gestion.esmovil.es/export-csv/'+$('.export-year').val()+'/'+$('.export-month').val())
    } else {
        $('.export-href').attr('href','https://gestion.esmovil.es/export-csv/'+$('.export-year').val()+'/'+$('.export-month').val()+'/'+$('.dept_id').val())
    }
})

$(document).on('click', '.arrow-next', function () {
    $('#time_control_table').hide()
    $('.loading-banner').show();
    $('#slot_list').hide();
    $('#slot_list').empty()
    new_month = new_month+1
    if (new_month > 11) {
        new_year = new_year+1
        new_month = 0
        $('.export-year').val(new_year)
    }

    $('.current-month').text(month_list[new_month]+' '+new_year)

    if ((new_month == current_month) && (new_year == current_year)) {
        current = 1
        $('.arrow-next').hide()
        calculateControl(new_year, new_month, current_day)
    } else {
        let month_days = new Date(new_year, new_month+1, 0).getDate();
        calculateControl(new_year, new_month, month_days)
    }

    nm = new_month+1
    if (nm < 10) {
        nm = '0'+(new_month+1)
        $('.export-month').val(nm)
    } else {
        $('.export-month').val(new_month+1)
    }

    if ($('.user-id').val() == 18 || $('.user-id').val() == 25 || $('.user-id').val() == 36 || $('.user-id').val() == 43 || $('.user-id').val() == 64) {
        $('.export-href').attr('href','https://gestion.esmovil.es/export-csv/'+$('.export-year').val()+'/'+$('.export-month').val())
    } else {
        $('.export-href').attr('href','https://gestion.esmovil.es/export-csv/'+$('.export-year').val()+'/'+$('.export-month').val()+'/'+$('.dept_id').val())
    }
})

//** Damos un valor al enlace al cargar la página */
if ($('.user-id').val() == 18 || $('.user-id').val() == 25 || $('.user-id').val() == 36 || $('.user-id').val() == 43 || $('.user-id').val() == 64) {
    $('.export-href').attr('href','https://gestion.esmovil.es/export-csv/'+$('.export-year').val()+'/'+$('.export-month').val())
} else {
    $('.export-href').attr('href','https://gestion.esmovil.es/export-csv/'+$('.export-year').val()+'/'+$('.export-month').val()+'/'+$('.dept_id').val())
}
$('.dept-column').hide()
// FILTROS DE DEPARTAMENTO
// Clase Active para los filtros
let filter_container = $(".filter-list");
$(document).on('click', '.dept-filter-item', function () {
    filter_container.find(".active").removeClass('active');
    $(this).addClass("active")
    let filter_value = filter_container.find(".active").attr('dept')

    // Dibuja todos
    if (filter_value == 0) {
        $('.filter-row').each(function() {
            table_time_control.columns(6).search('Sistemas & Marketing|Compras|Ventas|Almacén|Administración|Ventas Canarias',true,false).draw();
            $('.dept-column').each(function() {
                $(this).remove()
            })
        })
    // Dibuja solo el departamento marcado
    } else {
        table_time_control.columns(6).search(filter_value,true,false).draw();
        $('.dept-column').each(function() {
            $(this).remove()
        })
    }
});

function calculateControl(this_year, this_month, this_days) {
    $.ajax({
        type:'POST',
        url:'/check-in-control/',
        data:{
            year: this_year,
            month: this_month,
            day: this_days,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            action: 'change_month'
        },
        success:function(respuesta){
            let data = JSON.parse(respuesta)
            table_time_control.clear()
            
            for (let i = 0; i < data.length; i++) {
                let dept_text = ''
                if (data[i]['dept'] == 2) {
                    dept_text = 'Sistemas & Marketing'
                } else if (data[i]['dept'] == 3) {
                    dept_text = 'Compras'
                } else if (data[i]['dept'] == 4) {
                    dept_text = 'Ventas'
                } else if (data[i]['dept'] == 5) {
                    dept_text = 'Almacén'
                } else if (data[i]['dept'] == 7) {
                    dept_text = 'Administración'
                } else {
                    dept_text = 'Gerencia'
                }

                table_time_control.row.add( [
                    '<p>'+data[i]['name']+'</p>',
                    '<p>'+data[i]['estimated']+'</p>',
                    '<p>'+data[i]['total']+'</p>',
                    '<p>'+data[i]['balance']+'</p>',
                    '<p>'+data[i]['edited']+'</p>',
                    '<a href="'+data[i]['id']+'/'+this_year+'/'+parseInt(this_month+1)+'"><i class="fas fa-arrow-right" style="font-size: 22px; cursor:pointer;"></i></a>',
                    '<p>'+dept_text+'</p>',
                ])
            }
            $('.loading-banner').hide();
            table_time_control.draw( false );
            $('#time_control_table').show()
        },
        error : function(xhr,errmsg,err) {
            toastr.error('', 'Error al actualizar');
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
}