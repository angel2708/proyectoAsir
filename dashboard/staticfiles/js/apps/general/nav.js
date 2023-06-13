$('.switchCompany').change(function(){
    let company = $('.switchCompany').val();
    $.ajax({
        type:'POST',
        url:'/switch-company/',
        data:{
            location: window.location.href,
            function: $('li.menu-page.active').attr('function-id'),
            company: company,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(res){
            if (res=='ok')
                location.reload();
            else
                location.replace(res)
        },
        error : function(xhr,errmsg,err) {
            toastr.error('', 'Error al actualizar');
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
});

if ( $( "#myDiv" ).length ) {
 
    $( "#myDiv" ).show();
 
}

$(document).on('click', '.notification-link', function () {
    let notification = $(this).attr('notification-id');
    let action = $(this).attr('action');

    swal.fire({
        title: '¿Deseas marcar la notificación como leida?',
        text: ' ',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SI'
    }).then(function (resp) {
        if (resp['value'] == true || resp['dismiss'] == 'cancel'){
            if (resp['value'] == true) {
                $.ajax({
                    type: 'POST',
                    url: '/read-notification/',
                    data: {
                        notification:notification,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    },
                    success: function () {
                        if(action != 'none')
                            location.replace(action);
                    },
                    error: function (xhr, errmsg, err) {
                        console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                    }
                });
            }else if (resp['dismiss'] == 'cancel') {
                location.replace(action);
            }
        }
    });
});

//// COMPORTAMIENTO DE LOS OBJETIVOS

// En caso de que el usuario pertenezca al departamento de ventas, hay objetivos que mostrar.

var days, first_day, last_day, elapsed, remaining, tphox_message, reds_message, scooter_message, laptop_message, active_message, qcharx_message, tphox_color, reds_color, scooter_color, laptop_color, active_color, qcharx_color
var green_message = '¡Vas genial, sigue así!'
var red_message = '¡Venga, ponte las pilas que hay que remontar!'
var complete_message = '¡Felicidades, has alcanzado el objetivo!'
var green_color = '#BCF1A9'
var red_color = '#F56D6D'
$( document ).ready(function() {
    // CALCULO DIAS DE TRIMESTE - TOTALES / RESTANTES / TRANSCURRIDOS
    function daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }

    let today = new Date();
    let year = today.getFullYear()
    
    let q = [1,2,3,4];
    q = q[Math.floor(today.getMonth() / 3)]
    if (q == 1) {
        // Días totales
        days = daysInMonth(1,year)+daysInMonth(2,year)+daysInMonth(3,year)

        first_day = year+'-'+1+'-0'+1
        first_day = new Date(first_day);

        last_day = year+'-'+3+'-'+daysInMonth(3,year)
        last_day = new Date(last_day);

        // Dias hábiles
        let count = 0
        for (let i = 0; i < days; i++) {
            if (first_day.getDay() != 6 && first_day.getDay() != 0) {
                count++
            }
            first_day.setDate(first_day.getDate()+1)
        }
        days = count

        // Días hábiles transcurridos
        first_day = year+'-'+1+'-0'+1
        first_day = new Date(first_day);
        elapsed = moment(today).diff(moment(first_day), 'days')+1

        count = 0
        for (let e = 0; e < elapsed; e++) {
            if (first_day.getDay() != 6 && first_day.getDay() != 0) {
                count++
            }
            first_day.setDate(first_day.getDate()+1)
        }
        elapsed = count

        // Días hábiles restantes
        remaining = moment(last_day).diff(moment(today), 'days')
        count = 0
        for (let r = 0; r < remaining; r++) {
            if (last_day.getDay() != 6 && last_day.getDay() != 0) {
                count++
            }
            last_day.setDate(last_day.getDate()-1)
        }
        remaining = count+1
        $('.remaining-days').text(remaining+' días para acabar el trimestre')

    } else if (q == 2) {
        // Días totales
        days = daysInMonth(4,year)+daysInMonth(5,year)+daysInMonth(6,year)

        first_day = year+'-'+4+'-0'+1
        first_day = new Date(first_day);

        last_day = year+'-'+6+'-'+daysInMonth(6,year)
        last_day = new Date(last_day);

        // Dias hábiles
        let count = 0
        for (let i = 0; i < days; i++) {
            if (first_day.getDay() != 6 && first_day.getDay() != 0) {
                count++
            }
            first_day.setDate(first_day.getDate()+1)
        }
        days = count

        // Días hábiles transcurridos
        first_day = year+'-'+4+'-0'+1
        first_day = new Date(first_day);
        elapsed = moment(today).diff(moment(first_day), 'days')+1

        count = 0
        for (let e = 0; e < elapsed; e++) {
            if (first_day.getDay() != 6 && first_day.getDay() != 0) {
                count++
            }
            first_day.setDate(first_day.getDate()+1)
        }
        elapsed = count

        // Días hábiles restantes
        remaining = moment(last_day).diff(moment(today), 'days')
        count = 0
        for (let r = 0; r < remaining; r++) {
            if (last_day.getDay() != 6 && last_day.getDay() != 0) {
                count++
            }
            last_day.setDate(last_day.getDate()-1)
        }
        remaining = count+1
        $('.remaining-days').text(remaining+' días para acabar el trimestre')

    } else if (q == 3) {
        // Días totales
        days = daysInMonth(7,year)+daysInMonth(8,year)+daysInMonth(9,year)

        first_day = year+'-'+7+'-0'+1
        first_day = new Date(first_day);

        last_day = year+'-'+9+'-'+daysInMonth(9,year)
        last_day = new Date(last_day);

        // Dias hábiles
        let count = 0
        for (let i = 0; i < days; i++) {
            if (first_day.getDay() != 6 && first_day.getDay() != 0) {
                count++
            }
            first_day.setDate(first_day.getDate()+1)
        }
        days = count

        // Días hábiles transcurridos
        first_day = year+'-'+7+'-0'+1
        first_day = new Date(first_day);
        elapsed = moment(today).diff(moment(first_day), 'days')+1

        count = 0
        for (let e = 0; e < elapsed; e++) {
            if (first_day.getDay() != 6 && first_day.getDay() != 0) {
                count++
            }
            first_day.setDate(first_day.getDate()+1)
        }
        elapsed = count

        // Días hábiles restantes
        remaining = moment(last_day).diff(moment(today), 'days')
        count = 0
        for (let r = 0; r < remaining; r++) {
            if (last_day.getDay() != 6 && last_day.getDay() != 0) {
                count++
            }
            last_day.setDate(last_day.getDate()-1)
        }
        remaining = count+1
        $('.remaining-days').text(remaining+' días para acabar el trimestre')

    } else if (q == 4) {
        // Días totales
        days = daysInMonth(10,year)+daysInMonth(11,year)+daysInMonth(12,year)

        first_day = year+'-'+10+'-0'+1
        first_day = new Date(first_day);

        last_day = year+'-'+12+'-'+daysInMonth(12,year)
        last_day = new Date(last_day);

        // Dias hábiles
        let count = 0
        for (let i = 0; i < days; i++) {
            if (first_day.getDay() != 6 && first_day.getDay() != 0) {
                count++
            }
            first_day.setDate(first_day.getDate()+1)
        }
        days = count

        // Días hábiles transcurridos
        first_day = year+'-'+10+'-0'+1
        first_day = new Date(first_day);
        elapsed = moment(today).diff(moment(first_day), 'days')+1

        count = 0
        for (let e = 0; e < elapsed; e++) {
            if (first_day.getDay() != 6 && first_day.getDay() != 0) {
                count++
            }
            first_day.setDate(first_day.getDate()+1)
        }
        elapsed = count

        // Días hábiles restantes
        remaining = moment(last_day).diff(moment(today), 'days')
        count = 0
        for (let r = 0; r < remaining; r++) {
            if (last_day.getDay() != 6 && last_day.getDay() != 0) {
                count++
            }
            last_day.setDate(last_day.getDate()-1)
        }
        remaining = count+1
        $('.remaining-days').text(remaining+' días hábiles para acabar el trimestre')
    }

    // CALCULO DEL PROGRESO DE CADA CATEGORIA
    let tphox_obj = $('.objetive-tphox').text().split(' ')[1]
    let tphox_total = $('.total-tphox').text().replace(',','.')
    let tphox_percentage = 100*tphox_total/tphox_obj

    if (tphox_percentage >= 100) {
        tphox_percentage = 100
        $('.progress-tphox').html('<span style="font-weight: 1000; color:white;">Objetivo Conseguido</span>')
    }
    $('.progress-tphox').css('width',tphox_percentage.toFixed(2)+'%')

    let reds_obj = $('.objetive-reds').text().split(' ')[1]
    let reds_total = $('.total-reds').text().replace(',','.')
    let reds_percentage = 100*reds_total/reds_obj

    if (reds_percentage >= 100) {
        reds_percentage = 100
        $('.progress-reds').html('<span style="font-weight: 1000; color:white;">Objetivo Conseguido</span>')
    }
    $('.progress-reds').css('width',reds_percentage.toFixed(2)+'%')

    let scooter_obj = $('.objetive-scooter').text().split(' ')[1]
    let scooter_total = $('.total-scooter').text().replace(',','.')
    let scooter_percentage = 100*scooter_total/scooter_obj

    if (scooter_percentage >= 100) {
        scooter_percentage = 100
        $('.progress-scooter').html('<span style="font-weight: 1000; color:white;">Objetivo Conseguido</span>')
    }
    $('.progress-scooter').css('width',scooter_percentage.toFixed(2)+'%')

    let laptop_obj = $('.objetive-laptop').text().split(' ')[1]
    let laptop_total = $('.total-laptop').text().replace(',','.')
    let laptop_percentage = 100*laptop_total/laptop_obj

    if (laptop_percentage >= 100) {
        laptop_percentage = 100
        $('.progress-laptop').html('<span style="font-weight: 1000; color:white;">Objetivo Conseguido</span>')
    }
    $('.progress-laptop').css('width',laptop_percentage.toFixed(2)+'%')

    let qcharx_obj = $('.objetive-qcharx').text().split(' ')[1]
    let qcharx_total = $('.total-qcharx').text().replace(',','.')
    let qcharx_percentage = 100*qcharx_total/qcharx_obj

    if (qcharx_percentage >= 100) {
        qcharx_percentage = 100
        $('.progress-qcharx').html('<span style="font-weight: 1000; color:white;">Objetivo Conseguido</span>')
    }
    $('.progress-qcharx').css('width',qcharx_percentage.toFixed(2)+'%')

    let active_obj = $('.objetive-active-clients').text().split(' ')[1]
    let active_total = $('.total-active-clients').text().replace(',','')
    let active_percentage = 100*active_total/active_obj

    if (active_percentage >= 100) {
        active_percentage = 100
        $('.progress-active-clients').html('<span style="font-weight: 1000; color:white;">Objetivo Conseguido</span>')
    }
    $('.progress-active-clients').css('width',active_percentage.toFixed(2)+'%')

    // CALCULO DEL MARKER DE CADA CATEGORÍA Y COLORES

    // Cálculo T-Phox
    let tphox_marker = elapsed*100/days
    $('.marker-tphox').css('margin-left',(tphox_marker-tphox_percentage-10).toFixed(2)+'%')
    if (tphox_marker <= tphox_percentage) {
        $('.total-tphox').css('color','#BCF1A9')
        tphox_message = green_message
        tphox_color = green_color
    } else {
        $('.total-tphox').css('color','#F56D6D')
        tphox_message = red_message
        tphox_color = red_color
    }

    if (tphox_percentage == 100) {
        tphox_message = complete_message
        tphox_color = green_color
    }

    // Tooltip T-Phox
    $(document).on('mouseover', '.progress-bar-tphox', function () {
        $('.tooltip-progress-data').html(
            '<strong class="progress-category">T-Phox</strong>'+
            '<p style="margin-top: 5px;">Progreso actual: '+tphox_percentage.toFixed(2)+'% ('+tphox_total+' €)</p>'+
            '<p>Progreso estimado: '+tphox_marker.toFixed(2)+'% ('+(tphox_marker*tphox_obj/100).toFixed(2)+' €)</p>'+
            '<p style="color:'+tphox_color+'">'+tphox_message+'</p>'
        )
        $('.tooltip-progress-data').css('display','block')
    })

    $(document).on('mouseout', '.progress-bar-tphox', function () {
        $('.tooltip-progress-data').html('')
        $('.tooltip-progress-data').css('display','none')
    })

    // Cálculo Rojos
    let reds_marker = elapsed*100/days
    $('.marker-reds').css('margin-left',(reds_marker-reds_percentage-10).toFixed(2)+'%')
    if (reds_marker <= reds_percentage) {
        $('.total-reds').css('color','#BCF1A9')
        reds_message = green_message
        reds_color = green_color
    } else {
        $('.total-reds').css('color','#F56D6D')
        reds_message = red_message
        reds_color = red_color
    }

    if (reds_percentage == 100) {
        reds_message = complete_message
        reds_color = green_color
    }

    // Tooltip Rojos
    $(document).on('mouseover', '.progress-bar-reds', function () {
        $('.tooltip-progress-data').html(
            '<strong class="progress-category">Rojos</strong>'+
            '<p style="margin-top: 5px;">Progreso actual: '+reds_percentage.toFixed(2)+'% ('+reds_total+' €)</p>'+
            '<p>Progreso estimado: '+reds_marker.toFixed(2)+'% ('+(reds_marker*reds_obj/100).toFixed(2)+' €)</p>'+
            '<p style="color:'+reds_color+'">'+reds_message+'</p>'
        )
        $('.tooltip-progress-data').css('display','block')
    })

    $(document).on('mouseout', '.progress-bar-reds', function () {
        $('.tooltip-progress-data').html('')
        $('.tooltip-progress-data').css('display','none')
    })

    // Cálculo Patinete
    let scooter_marker = elapsed*100/days
    $('.marker-scooter').css('margin-left',(scooter_marker-scooter_percentage-10).toFixed(2)+'%')
    if (scooter_marker <= scooter_percentage) {
        $('.total-scooter').css('color','#BCF1A9')
        scooter_message = green_message
        scooter_color = green_color
    } else {
        $('.total-scooter').css('color','#F56D6D')
        scooter_message = red_message
        scooter_color = red_color
    }

    if (scooter_percentage == 100) {
        scooter_message = complete_message
        scooter_color = green_color
    }

    // Tooltip PATINETE
    $(document).on('mouseover', '.progress-bar-scooter', function () {
        $('.tooltip-progress-data').html(
            '<strong class="progress-category">Patinete</strong>'+
            '<p style="margin-top: 5px;">Progreso actual: '+scooter_percentage.toFixed(2)+'% ('+scooter_total+' €)</p>'+
            '<p>Progreso estimado: '+scooter_marker.toFixed(2)+'% ('+(scooter_marker*scooter_obj/100).toFixed(2)+' €)</p>'+
            '<p style="color:'+scooter_color+'">'+scooter_message+'</p>'
        )
        $('.tooltip-progress-data').css('display','block')
    })

    $(document).on('mouseout', '.progress-bar-scooter', function () {
        $('.tooltip-progress-data').html('')
        $('.tooltip-progress-data').css('display','none')
    })

    // Cálculo Portátil
    let laptop_marker = elapsed*100/days
    $('.marker-laptop').css('margin-left',(laptop_marker-laptop_percentage-10).toFixed(2)+'%')
    if (laptop_marker <= laptop_percentage) {
        $('.total-laptop').css('color','#BCF1A9')
        laptop_message = green_message
        laptop_color = green_color
    } else {
        $('.total-laptop').css('color','#F56D6D')
        laptop_message = red_message
        laptop_color = red_color
    }

    if (laptop_percentage == 100) {
        laptop_message = complete_message
        laptop_color = green_color
    }

    // Tooltip PORTATIL
    $(document).on('mouseover', '.progress-bar-laptop', function () {
        $('.tooltip-progress-data').html(
            '<strong class="progress-category">Portatil</strong>'+
            '<p style="margin-top: 5px;">Progreso actual: '+laptop_percentage.toFixed(2)+'% ('+laptop_total+' €)</p>'+
            '<p>Progreso estimado: '+laptop_marker.toFixed(2)+'% ('+(laptop_marker*laptop_obj/100).toFixed(2)+' €)</p>'+
            '<p style="color:'+laptop_color+'">'+laptop_message+'</p>'
        )
        $('.tooltip-progress-data').css('display','block')
    })

    $(document).on('mouseout', '.progress-bar-laptop', function () {
        $('.tooltip-progress-data').html('')
        $('.tooltip-progress-data').css('display','none')
    })

    // Cálculo Qcharx
    let qcharx_marker = elapsed*100/days
    $('.marker-qcharx').css('margin-left',(qcharx_marker-qcharx_percentage-10).toFixed(2)+'%')
    if (qcharx_marker <= qcharx_percentage) {
        $('.total-qcharx').css('color','#BCF1A9')
        qcharx_message = green_message
        qcharx_color = green_color
    } else {
        $('.total-qcharx').css('color','#F56D6D')
        qcharx_message = red_message
        qcharx_color = red_color
    }

    if (qcharx_percentage == 100) {
        qcharx_message = complete_message
        qcharx_color = green_color
    }

    // Tooltip Qcharx
    $(document).on('mouseover', '.progress-bar-qcharx', function () {
        $('.tooltip-progress-data').html(
            '<strong class="progress-category">Portatil</strong>'+
            '<p style="margin-top: 5px;">Progreso actual: '+qcharx_percentage.toFixed(2)+'% ('+qcharx_total+' €)</p>'+
            '<p>Progreso estimado: '+qcharx_marker.toFixed(2)+'% ('+(qcharx_marker*qcharx_obj/100).toFixed(2)+' €)</p>'+
            '<p style="color:'+qcharx_color+'">'+qcharx_message+'</p>'
        )
        $('.tooltip-progress-data').css('display','block')
    })

    $(document).on('mouseout', '.progress-bar-laptop', function () {
        $('.tooltip-progress-data').html('')
        $('.tooltip-progress-data').css('display','none')
    })

    // Cálculo Clientes Activos
    let active_marker = elapsed*100/days
    $('.marker-active-clients').css('margin-left',(active_marker-active_percentage-10).toFixed(2)+'%')
    if (active_marker <= active_percentage) {
        $('.total-active-clients').css('color','#BCF1A9')
        active_message = green_message
        active_color = green_color
    } else {
        $('.total-active-clients').css('color','#F56D6D')
        active_message = red_message
        active_color = red_color
    }

    if (active_percentage == 100) {
        active_message = complete_message
        active_color = green_color
    }

    // Tooltip Clientes Activos
    $(document).on('mouseover', '.progress-bar-active-clients', function () {
        $('.tooltip-progress-data').html(
            '<strong class="progress-category">Clientes Activos</strong>'+
            '<p style="margin-top: 5px;">Progreso actual: '+active_percentage.toFixed(2)+'% ('+active_total.split('.')[0]+')</p>'+
            '<p>Progreso estimado: '+active_marker.toFixed(2)+'% ('+(active_marker*active_obj/100).toFixed(0)+')</p>'+
            '<p style="color:'+active_color+'">'+active_message+'</p>'
        )
        $('.tooltip-progress-data').css('display','block')
    })

    $(document).on('mouseout', '.progress-bar-active-clients', function () {
        $('.tooltip-progress-data').html('')
        $('.tooltip-progress-data').css('display','none')
    })
})

// Tooltip INFO
$(document).on('mouseover', '.info-progress-bar', function () {
    $('.tooltip-info-data').css('display','block')
})

$(document).on('mouseout', '.info-progress-bar', function () {
    $('.tooltip-info-data').css('display','none')
})

$(document).on('click', '.toggle-icon.font-medium-3.white.feather', function () {
    if ($(this).hasClass('icon-toggle-right')) {
        $('.objetives').css('display','none')
    } else if ($(this).hasClass('icon-toggle-left')) {
        $('.objetives').css('display','block')
    }
})

/** FICHAJE */
var working = 0
var device = 0

/** Re-calcular de forma automática el fichaje */
reCount()

/** Si es menor que 10 le añadimos un cero por la izquierda */
function ten(pr) {
    if (pr < 10) {
        pr = '0'+pr
    }
    return pr
}

/** Recalcular el fichaje */
function reCount() {
    /** Ajax */
    $.ajax({
        type:'POST',
        url:'/check-data/',
        data:{
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            action: 're_count'
        },
        success:function(respuesta){
            let hours = respuesta.split(':')[0]
            let minutes = respuesta.split(':')[1]

            minutes = ten(minutes)
            $('.check-in-time').html(hours+'h '+minutes+'m<i class="fas fa-info-circle" style="margin-left:3%;"></i>')
            $('.check-in-time').tooltip('hide')

            if (respuesta.split(':')[3] == 'yes') {
                $('.check-in-text').text('Salida')
                $('.green-point').css('visibility','visible')
                $('.check-in-button').css('transform','translate(27px, 0%)')
                working = 1
            }
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

/** Rellenar de datos el Tooltip */
tooltipData()
function tooltipData() {
    let date = new Date()
    var zh = (date.getTimezoneOffset())/-60;

    let year = date.getFullYear()

    let month = date.getMonth()+1
    month = ten(month)

    let day = date.getDate()
    day = ten(day)

    let string = '<p class="title-tooltip">JORNADA DE HOY</p> <hr class="hr-tooltip"> '
    /** Ajax */
    $.ajax({
        type:'POST',
        url:'/check-data/',
        data:{
            year: year,
            month: month,
            day: day,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            action: 'tooltip_data'
        },
        success:function(respuesta){
            data = JSON.parse(respuesta)
            let total = $('.check-in-time').text()
            let eh, em, es, sh, sm, ss, th, tm, ts, now_slot

            for (let i = 0; i < data.length; i++) {
                sh = parseInt(((data[i]['fields'].check_in).split('T')[1]).split(':')[0])+zh
                sm = parseInt(((data[i]['fields'].check_in).split('T')[1]).split(':')[1])
                ss = parseInt((((data[i]['fields'].check_in).split('T')[1]).split(':')[2]).split(sep=".")[0])
                sh = ten(sh)
                sm = ten(sm)
                ss = ten(ss)

                if (data[i]['fields'].check_out) {
                    eh = parseInt(((data[i]['fields'].check_out).split('T')[1]).split(':')[0])+zh
                    em = parseInt(((data[i]['fields'].check_out).split('T')[1]).split(':')[1])  
                    es = parseInt((((data[i]['fields'].check_out).split('T')[1]).split(':')[2]).split(sep=".")[0]) 
                    now_slot = 0
                } else {
                    eh = date.getHours()
                    em = date.getMinutes()
                    es = date.getSeconds()
                    now_slot = 1
                }

                eh = ten(eh)
                em = ten(em)
                es = ten(es)

                th = eh-sh
                tm = em-sm
                ts = es-ss

                if (ts < 0) {
                    ts = ts+60
                    tm = -1+tm
                }

                if (tm < 0) {
                    tm = tm+60
                    th = -1+th
                }

                tm = ten(tm)

                if (now_slot == 0) {
                    string = string + '<p>'+sh+':'+sm+' - '+eh+':'+em+' <i class="fas fa-long-arrow-alt-right arrow-tooltip"></i> '+th+'h '+tm+'m</p> '
                } else if (now_slot == 1) {
                    string = string + '<p>'+sh+':'+sm+' - Ahora <i class="fas fa-long-arrow-alt-right arrow-tooltip"></i> '+th+'h '+tm+'m</p> '
                }
            }

            string = string + '<p>Total trabajado <i class="fas fa-long-arrow-alt-right arrow-tooltip"></i> '+total+'</p>'
            $('.check-in-time').attr('data-original-title', string)
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

/** Botón de Entrada/Salida */
$(document).on('click', '.check-in-button', function () {
    let button = $(this)
    if (working == 0) {

        /** Detectamos si ficha desde móvil/tablet */
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            device = 1
        }

        if (button.css('cursor') == 'pointer') {
            /** AJAX */
            $.ajax({
                type:'POST',
                url:'/check-data/',
                data:{
                    device: device,
                    csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
                    action: 'check_in_data'
                },
                success:function(){
                    $('.check-in-text').text('Salida')
                    $('.green-point').css('visibility','visible')
                    $('.check-in-button').css('transform','translate(27px, 0%)')
                    working = 1
                    device = 0
                    /* setTimeout(function() {
                        if (working == 1) {
                            reCount()
                        }
                    }, 60000) */
                },
                error : function(xhr,errmsg,err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }

    } else {
        button.css("cursor","not-allowed")
        /** Detectamos si ficha desde móvil/tablet */
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            device = 1
        }

        /** AJAX */
        $.ajax({
            type:'POST',
            url:'/check-data/',
            data:{
                device: device,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
                action: 'check_out_data'
            },
            success:function(){
                $('.check-in-text').text('Entrada')
                $('.green-point').css('visibility','hidden')
                $('.check-in-button').css('transform','translate(0%, 0%)')
                working = 0
                device = 0
                setTimeout(function(){button.css("cursor","pointer")}, 10000);
            },
            error : function(xhr,errmsg,err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }
})

// Botón para cerrar la ventana emergente del buscador de clientes
$(document).on('click','#close-search-clients',function() {
    $('#search-clients').slideUp();
    $('#input-client').val('');
});

/** Comportamiento de crear una incidencia de transporte */
// Buscador de clientes
$(document).on('keyup','.client_id',function() {
    let name = $(this).val()
    let company = $('.company_id').val()
    if($(this).val().length >0){
        if (isNaN(name)) {
            if($(this).val().length >=3){
                $.ajax({
                    type: 'POST',
                    url: '/sat-get-clients/',
                    data: {
                        company: company,
                        name: name,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        action: 'get_clients'
                    },
                    success: function(respuesta) {
                        clients = JSON.parse(respuesta);
                        console.log(clients);

                        $('#search-models').slideUp();

                        $('#search-clients').slideDown();
                        $('#search-clients').show();
                        $('#result-clients').html('');

                        for (let i = 0; i < clients.length; i++) { 
                            $('#result-clients').append(
                                '<a class="client-search" art-data="'+clients[i]+'">'+
                                '    <div class="row autocomplete-client" style="padding:15px;background-color:white;border-bottom:solid 1px #ededed;" name="'+clients[i]['fields'].name+'" email="'+clients[i]['fields'].mail+'" tel="'+clients[i]['fields'].tel+'" nif="'+clients[i]['fields'].NIF+'" tariff="'+clients[i]['fields'].tariff_id+'" client_id="'+clients[i]['fields'].ADN_code+'">'+
                                '        <div class="col-7">'+
                                '            <b>'+clients[i]['fields'].name+'</b>'+
                                '        </div>'+
                                '        <div class="col-5" style="text-align:center;">'+
                                '            <p>Cod.:'+clients[i]['fields'].ADN_code+'</p>'+
                                '        </div>'+
                                '    </div>'+
                                '</a>'
                            );
                        }

                        if (clients.length == 0) {
                            $('#result-clients').html('<p style="text-align:center;"><b>No hay resultados para el criterio de búsqueda</b></p>');
                        }

                    },
                    error: function (xhr, errmsg, err) {
                        console.log(xhr.status + ": " + xhr.responseText);
                        $('#search-clients').slideDown();
                        $('#result-clients').html('<p style="text-align:center;"><b>No hay resultados para el criterio de búsqueda</b></p>');
                    }
                })
            } else if($(this).val().length<=2) {
                $('#result-clients').html('');
                $('#search-clients').hide()
            }
        } else {
            $.ajax({
                type: 'POST',
                url: '/sat-get-clients/',
                data: {
                    company: company,
                    name: name,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'get_clients'
                },
                success: function(respuesta) {
                    clients = JSON.parse(respuesta);

                    $('#search-clients').slideDown();
                    $('#search-clients').show();
                    $('#result-clients').html('');

                    for (let i = 0; i < clients.length; i++) { 
                        $('#result-clients').append(
                            '<a class="client-search" art-data="'+clients[i]+'">'+
                            '    <div class="row autocomplete-client" style="padding:15px;background-color:white;border-bottom:solid 1px #ededed;" name="'+clients[i]['fields'].name+'" email="'+clients[i]['fields'].mail+'" tel="'+clients[i]['fields'].tel+'" nif="'+clients[i]['fields'].NIF+'" tariff="'+clients[i]['fields'].tariff_id+'" client_id="'+clients[i]['fields'].ADN_code+'">'+
                            '        <div class="col-7">'+
                            '            <b>'+clients[i]['fields'].name+'</b>'+
                            '        </div>'+
                            '        <div class="col-5" style="text-align:center;">'+
                            '            <p>Cod.:'+clients[i]['fields'].ADN_code+'</p>'+
                            '        </div>'+
                            '    </div>'+
                            '</a>'
                        );
                    }

                    if (clients.length == 0) {
                        $('#result-clients').html('<p style="text-align:center;"><b>No hay resultados para el criterio de búsqueda</b></p>');
                    }

                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                    $('#search-clients').slideDown();
                    $('#result-clients').html('<p style="text-align:center;"><b>No hay resultados para el criterio de búsqueda</b></p>');
                }
            })
        }
    } else {
        $('#result-clients').html('');
        $('#search-clients').hide()
    }
})

/** Comportamiento al pulsar en un cliente */
$(document).on('click', '.autocomplete-client', function () {
    $('.client_name').val($(this).attr('name'))
    $('.client_id').val($(this).attr('client_id'))

    $('#result-clients').html('');
    $('#search-clients').hide()

    let client_id = $(this).attr('client_id')
    let client_name = $(this).attr('name')
    $.ajax({
        type: 'POST',
        url: '/get-invoices/',
        data: {
            client_id: client_id,
            client_name: client_name,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'get_invoices'
        },
        success: function(respuesta) {
            let data = JSON.parse(respuesta);
            console.log(data);

            $('.bill_client').empty()
            $('.bill_client').append(
                '<option value="0" selected disabled>Seleccione una factura</option>'
            );

            for (let i = 0; i < data.length; i++) {
                $('.bill_client').append(
                    '<option value="'+data[i]['invoice']+'" invoice_date="'+(data[i]['fecha']['date']).split(' ')[0]+'">'+data[i]['invoice']+'</option>'
                );
            }

            $('.bill_client').prop('disabled',false)
        },
        error: function (xhr, errmsg, err) {
            toastr.error('El cliente introducido no tiene facturas de los últimos 10 días.', 'Error al obtener facturas');
        }
    });
});

/** Comportamiento al pulsar en una factura */
$(document).on('change', '.bill_client', function () {
    $('.inc_date').val($('option:selected', this).attr('invoice_date'))
    let client_name = $('.client_name').val()
    let client_id = $('.client_id').val()

    let invoice = $(this).val()
    $.ajax({
        type: 'POST',
        url: '/get-invoice-articles/',
        data: {
            invoice: invoice.split('/')[1],
            client_name: client_name,
            client_id: client_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'get_invoice_articles'
        },
        success: function(respuesta) {
            let data = JSON.parse(respuesta);
            console.log(data);

            $('.articles').empty()
            $('.articles').append(
                '<option value="0" selected disabled>Seleccione un artículo</option>'
            );

            for (let i = 0; i < data.length; i++) {
                $('.articles').append(
                    '<option class="autocomplete-invoice" value="'+data[i]['articulo']+'" article_nserie="'+data[i]['nserie']+'" article_reference="'+data[i]['referencia']+'">'+data[i]['articulo']+'</option>'
                );
            }

            $('.articles').prop('disabled',false)
        },
        error: function (xhr, errmsg, err) {
            toastr.error('La factura seleccionada no tiene artículos relacionados.', 'Error al obtener facturas');
        }
    });
});

/** Comportamiento al pulsar en un artículo */
$(document).on('change', '.articles', function () {
    $('.serial_number').val($('option:selected', this).attr('article_nserie'))
    $('.art_ref').val($('option:selected', this).attr('article_reference'))
});

/** Comportamiento al pulsar en un destinatario */
$(document).on('change', '.destination', function () {
    if ($(this).val() == '1') {
        $('.bill_delivery').prop('readonly',false)
    } else {
        $('.bill_delivery').prop('readonly',true)
    }
});

/** Añadir una incidencia de transporte */
$(document).on('click', '.addDeliveryIncidence', function () {
    if ($('.destination').val() != 4) {
        if ($('.inc_type').val() == 1 || $('.inc_type').val() == 4) {
            if ($('.client_id').val() && $('.client_name').val() && $('.destination').val() != null && $('.inc_type').val() != null && $('.bill_client').val() != null && $('.inc_date').val() && $('.observations').val() && $('.pdfs').val()) {
                $(".addDeliveryIncidence").prop('disabled', true);
                let client_id = $('.client_id').val()
                let client_name = $('.client_name').val()
                let destination = $('.destination').val()
                let inc_type = $('.inc_type').val()
                let bill_client = $('.bill_client').val()
                let inc_date = $('.inc_date').val()
                let articles = $('.articles').val()
                let serial_number = $('.serial_number').val()
                let article_reference = $('.art_ref').val()
                let bill_delivery = $('.bill_delivery').val()
                let delivery_number = $('.delivery_number').val()
                let observations = $('.observations').val()
        
                var formData = new FormData();
        
                let pcount = 0;
                let pdfs = $('.pdfs').prop('files')
                for (i in pdfs){
                    formData.append('p'+pcount, $('.pdfs').prop('files')[i]);
                    pcount++;
                }
                formData.append('pcount', pcount);
        
                let icount = 0;
                let images = $('.images').prop('files')
                for (j in images){
                    formData.append('i'+icount, $('.images').prop('files')[j]);
                    icount++;
                }
                formData.append('icount', icount);
        
                formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
                formData.append('action', 'get_delivery_incidence');
        
                formData.append('client_id', client_id);
                formData.append('client_name', client_name);
                formData.append('destination', destination);
                formData.append('inc_type', inc_type);
                formData.append('bill_client', bill_client);
                formData.append('inc_date', inc_date);
                formData.append('articles', articles);
                formData.append('serial_number', serial_number);
                formData.append('article_reference', article_reference);
                formData.append('bill_delivery', bill_delivery);
                formData.append('delivery_number', delivery_number);
                formData.append('observations', observations);
                
                $.ajax({
                    type: 'POST',
                    url: '/delivery-incidence/',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function() {
                        $("#addCarrierIncidenceModal").modal('hide')
                        toastr.success('Se ha enviado un correo electrónico a los responsables.', 'Incidencia añadida con éxito');
                        $('.client_id').val('')
                        $('.client_name').val('')
                        $('.destination').val('0')
                        $('.inc_type').val('0')
                        $('.bill_client').val('0')
                        $('.inc_date').val('')
                        $('.articles').val('0')
                        $('.serial_number').val('')
                        $('.bill_delivery').val('')
                        $('.delivery_number').val('')
                        $('.observations').val('')

                        $(".addDeliveryIncidence").prop('disabled', false);
                    },
                    error: function (xhr, errmsg, err) {
                        console.log(xhr.status + ": " + xhr.responseText);
                    }
                });
            } else {
                toastr.error('Debe completar todos los campos', 'Error');
            }
        } else {
            if ($('.client_id').val() && $('.client_name').val() && $('.destination').val() != null && $('.inc_type').val() != null && $('.bill_client').val() != null && $('.inc_date').val() && $('.articles').val() != null && $('.observations').val() && $('.pdfs').val() && $('.images').val()) {
                let client_id = $('.client_id').val()
                let client_name = $('.client_name').val()
                let destination = $('.destination').val()
                let inc_type = $('.inc_type').val()
                let bill_client = $('.bill_client').val()
                let inc_date = $('.inc_date').val()
                let articles = $('.articles').val()
                let serial_number = $('.serial_number').val()
                let article_reference = $('.art_ref').val()
                let bill_delivery = $('.bill_delivery').val()
                let delivery_number = $('.delivery_number').val()
                let observations = $('.observations').val()
        
                var formData = new FormData();
        
                let pcount = 0;
                let pdfs = $('.pdfs').prop('files')
                for (i in pdfs){
                    formData.append('p'+pcount, $('.pdfs').prop('files')[i]);
                    pcount++;
                }
                formData.append('pcount', pcount);
        
                let icount = 0;
                let images = $('.images').prop('files')
                for (j in images){
                    formData.append('i'+icount, $('.images').prop('files')[j]);
                    icount++;
                }
                formData.append('icount', icount);
        
                formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
                formData.append('action', 'get_delivery_incidence');
        
                formData.append('client_id', client_id);
                formData.append('client_name', client_name);
                formData.append('destination', destination);
                formData.append('inc_type', inc_type);
                formData.append('bill_client', bill_client);
                formData.append('inc_date', inc_date);
                formData.append('articles', articles);
                formData.append('serial_number', serial_number);
                formData.append('article_reference', article_reference);
                formData.append('bill_delivery', bill_delivery);
                formData.append('delivery_number', delivery_number);
                formData.append('observations', observations);
                
                $.ajax({
                    type: 'POST',
                    url: '/delivery-incidence/',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function() {
                        $("#addCarrierIncidenceModal").modal('hide')
                        toastr.success('Se ha enviado un correo electrónico a los responsables.', 'Incidencia añadida con éxito');
                        $('.client_id').val('')
                        $('.client_name').val('')
                        $('.destination').val('0')
                        $('.inc_type').val('0')
                        $('.bill_client').val('0')
                        $('.inc_date').val('')
                        $('.articles').val('0')
                        $('.serial_number').val('')
                        $('.bill_delivery').val('')
                        $('.delivery_number').val('')
                        $('.observations').val('')
                    },
                    error: function (xhr, errmsg, err) {
                        console.log(xhr.status + ": " + xhr.responseText);
                    }
                });
            } else {
                toastr.error('Debe completar todos los campos', 'Error');
            }
        }
    } else {
        if ($('.inc_type').val() == 1 || $('.inc_type').val() == 4) {
            if ($('.client_id').val() && $('.client_name').val() && $('.destination').val() != null && $('.inc_type').val() != null && $('.bill_client').val() != null && $('.inc_date').val() && $('.observations').val() && $('.images').val()) {
                $(".addDeliveryIncidence").prop('disabled', true);
                let client_id = $('.client_id').val()
                let client_name = $('.client_name').val()
                let destination = $('.destination').val()
                let inc_type = $('.inc_type').val()
                let bill_client = $('.bill_client').val()
                let inc_date = $('.inc_date').val()
                let articles = $('.articles').val()
                let serial_number = $('.serial_number').val()
                let article_reference = $('.art_ref').val()
                let bill_delivery = $('.bill_delivery').val()
                let delivery_number = $('.delivery_number').val()
                let observations = $('.observations').val()
        
                var formData = new FormData();
        
                let pcount = 0;
                let pdfs = $('.pdfs').prop('files')
                for (i in pdfs){
                    formData.append('p'+pcount, $('.pdfs').prop('files')[i]);
                    pcount++;
                }
                formData.append('pcount', pcount);
        
                let icount = 0;
                let images = $('.images').prop('files')
                for (j in images){
                    formData.append('i'+icount, $('.images').prop('files')[j]);
                    icount++;
                }
                formData.append('icount', icount);
        
                formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
                formData.append('action', 'get_delivery_incidence');
        
                formData.append('client_id', client_id);
                formData.append('client_name', client_name);
                formData.append('destination', destination);
                formData.append('inc_type', inc_type);
                formData.append('bill_client', bill_client);
                formData.append('inc_date', inc_date);
                formData.append('articles', articles);
                formData.append('serial_number', serial_number);
                formData.append('article_reference', article_reference);
                formData.append('bill_delivery', bill_delivery);
                formData.append('delivery_number', delivery_number);
                formData.append('observations', observations);
                
                $.ajax({
                    type: 'POST',
                    url: '/delivery-incidence/',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function() {
                        $("#addCarrierIncidenceModal").modal('hide')
                        toastr.success('Se ha enviado un correo electrónico a los responsables.', 'Incidencia añadida con éxito');
                        $('.client_id').val('')
                        $('.client_name').val('')
                        $('.destination').val('0')
                        $('.inc_type').val('0')
                        $('.bill_client').val('0')
                        $('.inc_date').val('')
                        $('.articles').val('0')
                        $('.serial_number').val('')
                        $('.bill_delivery').val('')
                        $('.delivery_number').val('')
                        $('.observations').val('')

                        $(".addDeliveryIncidence").prop('disabled', false);
                    },
                    error: function (xhr, errmsg, err) {
                        console.log(xhr.status + ": " + xhr.responseText);
                    }
                });
            } else {
                toastr.error('Debe completar todos los campos', 'Error');
            }
        } else {
            if ($('.client_id').val() && $('.client_name').val() && $('.destination').val() != null && $('.inc_type').val() != null && $('.bill_client').val() != null && $('.inc_date').val() && $('.articles').val() != null && $('.observations').val() && $('.images').val()) {
                let client_id = $('.client_id').val()
                let client_name = $('.client_name').val()
                let destination = $('.destination').val()
                let inc_type = $('.inc_type').val()
                let bill_client = $('.bill_client').val()
                let inc_date = $('.inc_date').val()
                let articles = $('.articles').val()
                let serial_number = $('.serial_number').val()
                let article_reference = $('.art_ref').val()
                let bill_delivery = $('.bill_delivery').val()
                let delivery_number = $('.delivery_number').val()
                let observations = $('.observations').val()
        
                var formData = new FormData();
        
                let pcount = 0;
                let pdfs = $('.pdfs').prop('files')
                for (i in pdfs){
                    formData.append('p'+pcount, $('.pdfs').prop('files')[i]);
                    pcount++;
                }
                formData.append('pcount', pcount);
        
                let icount = 0;
                let images = $('.images').prop('files')
                for (j in images){
                    formData.append('i'+icount, $('.images').prop('files')[j]);
                    icount++;
                }
                formData.append('icount', icount);
        
                formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
                formData.append('action', 'get_delivery_incidence');
        
                formData.append('client_id', client_id);
                formData.append('client_name', client_name);
                formData.append('destination', destination);
                formData.append('inc_type', inc_type);
                formData.append('bill_client', bill_client);
                formData.append('inc_date', inc_date);
                formData.append('articles', articles);
                formData.append('serial_number', serial_number);
                formData.append('article_reference', article_reference);
                formData.append('bill_delivery', bill_delivery);
                formData.append('delivery_number', delivery_number);
                formData.append('observations', observations);
                
                $.ajax({
                    type: 'POST',
                    url: '/delivery-incidence/',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function() {
                        $("#addCarrierIncidenceModal").modal('hide')
                        toastr.success('Se ha enviado un correo electrónico a los responsables.', 'Incidencia añadida con éxito');
                        $('.client_id').val('')
                        $('.client_name').val('')
                        $('.destination').val('0')
                        $('.inc_type').val('0')
                        $('.bill_client').val('0')
                        $('.inc_date').val('')
                        $('.articles').val('0')
                        $('.serial_number').val('')
                        $('.bill_delivery').val('')
                        $('.delivery_number').val('')
                        $('.observations').val('')
                    },
                    error: function (xhr, errmsg, err) {
                        console.log(xhr.status + ": " + xhr.responseText);
                    }
                });
            } else {
                toastr.error('Debe completar todos los campos', 'Error');
            }
        }
    }
});

/** Limpiamos el formulario cuando se abre de nuevo */
$(document).on('click', '.addCarrierIncidenceModal', function () {
    $('.client_id').val('')
    $('.client_name').val('')
    $('.destination').val('0')
    $('.inc_type').val('0')
    $('.bill_client').val('0')
    $('.inc_date').val('')
    $('.articles').val('0')
    $('.serial_number').val('')
    $('.bill_delivery').val('')
    $('.delivery_number').val('')
    $('.observations').val('')
})