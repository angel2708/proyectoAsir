/** JS PARA FICHAJE */
$('.loading-banner').hide();
$('#slot_list').show();
//** Mostrar mes y año actual */
let date = new Date()
let month_list = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
let week_list = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves' ,'Viernes', 'Sábado']
let current_month = date.getMonth()
let current_year = date.getFullYear()
let current_day = date.getDate()
$('.current-month').text(month_list[current_month]+' '+current_year)
let current = 1

let new_month = current_month
let new_year = current_year

let utc = (date.getTimezoneOffset())/-60
calculateSlots(current_year, current_month, date.getDate())

//** Cambiar de mes utilizando las flechas */
$(document).on('click', '.arrow-back', function () {
    $('.loading-banner').show();
    $('#slot_list').hide();
    $('#slot_list').empty()
    new_month = new_month-1
    if (new_month < 0) {
        new_year = new_year-1
        new_month = 11
    }

    current = 0
    $('.arrow-next').show()

    let month_days = new Date(new_year, new_month+1, 0).getDate();
    calculateSlots(new_year, new_month, month_days)
})

$(document).on('click', '.arrow-next', function () {
    $('.loading-banner').show();
    $('#slot_list').hide();
    $('#slot_list').empty()
    new_month = new_month+1
    if (new_month > 11) {
        new_year = new_year+1
        new_month = 0
    }

    if ((new_month == current_month) && (new_year == current_year)) {
        current = 1
        calculateSlots(new_year, new_month, current_day)
    } else {
        let month_days = new Date(new_year, new_month+1, 0).getDate();
        calculateSlots(new_year, new_month, month_days)
    }
})

//** Introducir los tramos trabajados hasta el día de hoy al cargar la página */
function calculateSlots(this_year, this_month, this_days) {
    if ($('.specific-year').val() && $('.specific-month').val()) {
        this_year = parseInt($('.specific-year').val())
        this_month = parseInt($('.specific-month').val())
        this_month = this_month-1
    }
    $('.current-month').text(month_list[this_month]+' '+new_year)

    if ((this_month == current_month) && (this_year == current_year)) {
        $('.arrow-next').hide()
    } else {
        $('.arrow-next').show()
    }

    let this_month_days = new Date(this_year, this_month+1, 0).getDate();
    ///** Ajax */
    $.ajax({
        type:'POST',
        url:'/check-in/',
        data:{
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            year: this_year,
            month: this_month,
            day: this_days,
            user: $('.specific-user').val(),
            action: 'get_slots'
        },
        success:function(respuesta){
            let data = JSON.parse(respuesta)
            console.log(data.absences);
            
            let continue_slot = 0
            let day_count = 1
            let check_now = 0
            let day_total
            let bag = 0
            let day_balance = -480

            let absence_days = new Array()
            for (let a = 0; a < data.absences.length; a++) {
                let start = parseInt((data.absences[a]['fields'].start).split('-')[2])
                let finish = parseInt((data.absences[a]['fields'].finish).split('-')[2])

                while (start <= finish) {
                    absence_days.push(start)
                    start++
                }
            }

            //** Recorremos todos los slots que llegan */
            if (data.slots.length == 0) {
                for (day_count; day_count <= this_days; day_count++) {
                    let dis = ''
                    if ((new Date(new_year, new_month, day_count).getDay() == 0) || (new Date(new_year, new_month, day_count).getDay() == 6)) {
                        dis = 'disabled'
                    }

                    if (absence_days.indexOf(day_count) != -1) {
                        dis = 'disabled'
                        $('#slot_list').append(
                            '<li class="row check-in-row" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                '<div class="col-md-2 check-in-day">'+
                                    '<h4>'+day_count+' '+month_list[this_month]+'</h4>'+
                                    '<h6 style="margin-top: -2%; font-size: 12px;">'+week_list[new Date(new_year, new_month, day_count).getDay()]+'</h6>'+
                                '</div>'+
                                '<div class="col-md-6 check-in-slots" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                    '<div check_id="none">'+
                                        '<i class="fas fa-umbrella-beach edited-modal" style="float:left; margin-right: 1.3%; font-size: 22px; margin-top: 1%;" title="Vacaciones"></i>'+
                                        '<input type="time" class="form-control col-md-2 input-required check-in-element" order ="1" day="'+day_count+'" month="'+this_month+'" style="float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " '+dis+' required>'+
                                        '<input type="time" class="form-control col-md-2 input-required check-out-element" order ="1" day="'+day_count+'" month="'+this_month+'" style="margin-left:2%; float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " '+dis+' required>'+
                                        '<button type="button" style="margin-left: 2%; border-radius: 26px; font-weight: bold; display:none;" check_id="0" order ="1" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'" class="edit_check_in btn btn-primary btn-md remove-element">Modificar</button>'+
                                        '<button type="button" style="margin-left: 1%; border-radius: 26px; font-weight: bold; display:none;" order ="1" day="'+day_count+'" class="btn btn-danger btn-md remove-element cancel_edit_check_in"><i class="fas fa-close"></i></button>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="col-md-2 check-in-total" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                    '<h4>0h 0m</h4>'+
                                '</div>'+
                                '<div class="col-md-2 check-in-balance" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                    '<h4>0h 0m</h4>'+
                                '</div>'+
                            '</li>'+
                            '<hr>'
                        )
                    } else {
                        $('#slot_list').append(
                            '<li class="row check-in-row" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                '<div class="col-md-2 check-in-day">'+
                                    '<h4>'+day_count+' '+month_list[this_month]+'</h4>'+
                                    '<h6 style="margin-top: -2%; font-size: 12px;">'+week_list[new Date(new_year, new_month, day_count).getDay()]+'</h6>'+
                                '</div>'+
                                '<div class="col-md-6 check-in-slots" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                    '<div check_id="none">'+
                                        '<i class="fas fa-info-circle edited-modal" style="float:left; margin-right: 2%; font-size: 22px; margin-top: 1%; visibility:hidden; cursor:pointer;" data-toggle="modal" data-target="#edited_traceability"></i>'+
                                        '<input type="time" class="form-control col-md-2 input-required check-in-element" order ="1" day="'+day_count+'" month="'+this_month+'" style="float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " '+dis+' required>'+
                                        '<input type="time" class="form-control col-md-2 input-required check-out-element" order ="1" day="'+day_count+'" month="'+this_month+'" style="margin-left:2%; float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " '+dis+' required>'+
                                        '<button type="button" style="margin-left: 2%; border-radius: 26px; font-weight: bold; display:none;" check_id="0" order ="1" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'" class="edit_check_in btn btn-primary btn-md remove-element">Modificar</button>'+
                                        '<button type="button" style="margin-left: 1%; border-radius: 26px; font-weight: bold; display:none;" order ="1" day="'+day_count+'" class="btn btn-danger btn-md remove-element cancel_edit_check_in"><i class="fas fa-close"></i></button>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="col-md-2 check-in-total" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                    '<h4>0h 0m</h4>'+
                                '</div>'+
                                '<div class="col-md-2 check-in-balance" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                    '<h4>0h 0m</h4>'+
                                '</div>'+
                            '</li>'+
                            '<hr>'
                        )
                    }
                }
            } else {
                let order = 0
                for (let i = 0; i < data.slots.length; i++) {

                    //** Si hay horario editado se muestra ese. Por el contrario se muestra el original */
                    let td
                    td = data.slots[i]['fields'].check_in
                    td = td.split('-')[2]
                    td = td.split('T')[0]

                    ci = data.slots[i]['fields'].check_in
                    ci = ci.split('T')[1]
                    cih = parseInt(ci.split(':')[0])+parseInt(utc)
                    cim = ci.split(':')[1]

                    try {
                        co = data.slots[i]['fields'].check_out
                        co = co.split('T')[1]
                        coh = parseInt(co.split(':')[0])+parseInt(utc)
                        com = co.split(':')[1]
                    }
                    catch {
                        check_now = 1
                        coh = cih
                        com = cim
                    }

                    if (cih < 10) {
                        cih = '0'+cih
                    }

                    if (coh < 10) {
                        coh = '0'+coh
                    }
                    
                    //** Comparamos cada slot con el día que toca del mes */
                    for (day_count; day_count <= this_month_days; day_count++) {
                        if (td == day_count) {
                            if (continue_slot == 0) { //** SI ES EL PRIMER FICHAJE DE ESE DIA */
                                if (check_now == 0) {
                                    //** PINTA UN SLOT COMPLETADO */
                                    let visibility = ''
                                    if (data.slots[i]['fields'].manually == false) {
                                        visibility = 'hidden'
                                    } else if (data.slots[i]['fields'].manually == true) {
                                        visibility = 'visible'
                                    }

                                    order = 1
                                    $('#slot_list').append(
                                        '<li class="row check-in-row" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                            '<div class="col-md-2 check-in-day">'+
                                                '<h4>'+day_count+' '+month_list[this_month]+'</h4>'+
                                                '<h6 style="margin-top: -2%; font-size: 12px;">'+week_list[new Date(new_year, new_month, day_count).getDay()]+'</h6>'+
                                            '</div>'+
                                            '<div class="col-md-6 check-in-slots" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                                '<div check_id="'+data.slots[i]['pk']+'">'+
                                                    '<i class="fas fa-info-circle edited-modal" style="float:left; margin-right: 2%; font-size: 22px; margin-top: 1%; visibility:'+visibility+'; cursor:pointer;" check_id="'+data.slots[i]['pk']+'" data-toggle="modal" data-target="#edited_traceability"></i>'+
                                                    '<input type="time" class="form-control col-md-2 input-required check-in-element" order="'+order+'" day="'+day_count+'" month="'+this_month+'" style="float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " value="'+cih+':'+cim+'" required>'+
                                                    '<input type="time" class="form-control col-md-2 input-required check-out-element" order="'+order+'" day="'+day_count+'" month="'+this_month+'" style="margin-left:2%; float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " value="'+coh+':'+com+'" required>'+
                                                    '<i class="fa fa-plus-circle add-slot" style="float:left; margin-left: 2%; font-size: 22px; margin-top: 1%; visibility:visible; cursor:pointer;" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'"></i>'+
                                                    '<button type="button" style="margin-left: 2%; border-radius: 26px; font-weight: bold; display:none;" order="'+order+'" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'" check_id="'+data.slots[i]['pk']+'" class="edit_check_in btn btn-primary btn-md remove-element">Modificar</button>'+
                                                    '<button type="button" style="margin-left: 1%; border-radius: 26px; font-weight: bold; display:none;" order="'+order+'" day="'+day_count+'" class="btn btn-danger btn-md remove-element cancel_edit_check_in"><i class="fas fa-close"></i></button>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="col-md-2 check-in-total" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                                '<h4>0h 0m</h4>'+
                                            '</div>'+
                                            '<div class="col-md-2 check-in-balance" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                                '<h4>0h 0m</h4>'+
                                            '</div>'+
                                        '</li>'+
                                        '<hr>'
                                    )
                                    th = (coh-cih)*60
                                    tm = com-cim
                                    day_total = th+tm
                                    bag = bag+day_total
                                } else {
                                    //** PINTA UN SLOT QUE ESTÁ EN CURSO */
                                    let visibility = ''
                                    if (data.slots[i]['fields'].manually == false) {
                                        visibility = 'hidden'
                                    } else if (data.slots[i]['fields'].manually == true) {
                                        visibility = 'visible'
                                    }

                                    order = 1
                                    $('#slot_list').append(
                                        '<li class="row check-in-row" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                            '<div class="col-md-2 check-in-day">'+
                                                '<h4>'+day_count+' '+month_list[this_month]+'</h4>'+
                                                '<h6 style="margin-top: -2%; font-size: 12px;">'+week_list[new Date(new_year, new_month, day_count).getDay()]+'</h6>'+
                                            '</div>'+
                                            '<div class="col-md-6 check-in-slots" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                                '<div check_id="'+data.slots[i]['pk']+'">'+
                                                    '<i class="fas fa-info-circle edited-modal" style="float:left; margin-right: 2%; font-size: 22px; margin-top: 1%; visibility:'+visibility+'; cursor:pointer;" check_id="'+data.slots[i]['pk']+'" data-toggle="modal" data-target="#edited_traceability"></i>'+
                                                    '<input type="time" class="form-control col-md-2 input-required check-in-element now" order="'+order+'" day="'+day_count+'" month="'+this_month+'" style="float:left;border-radius: 10px;font-size: 20px; text-align: center; padding-top: 0.8%; " value="'+cih+':'+cim+'" required disabled>'+
                                                    '<div style="width: 122px;display: flex;background-color: #eceff1;padding: 0px 2%; align-items: center;margin-left: 23.8%;border-radius: 10px;max-height: 40px;">'+    
                                                        '<div class="green-point" style="visibility: visible;margin-left: 5% !important;margin-top: -15%;"></div>'+ 
                                                        '<p style="text-align: center;margin-left: 15%;font-size: 20px; margin-top: 13%;font-family: Montserrat, Georgia, Times New Roman, Times, serif;font-weight: 500;">Ahora</p>'+
                                                    '</div>'+
                                                    '<button type="button" style="margin-left: 2%; border-radius: 26px; font-weight: bold; display:none;" order="'+order+'" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'" check_id="'+data.slots[i]['pk']+'" class="edit_check_in btn btn-primary btn-md remove-element">Modificar</button>'+
                                                    '<button type="button" style="margin-left: 1%; border-radius: 26px; font-weight: bold; display:none;" order="'+order+'" day="'+day_count+'" class="btn btn-danger btn-md remove-element cancel_edit_check_in"><i class="fas fa-close"></i></button>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="col-md-2 check-in-total" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                                '<h4>0h 0m</h4>'+
                                            '</div>'+
                                            '<div class="col-md-2 check-in-balance" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                                '<h4>0h 0m</h4>'+
                                            '</div>'+
                                        '</li>'+
                                        '<hr>'
                                    )
                                    th = (coh-cih)*60
                                    tm = com-cim
                                    day_total = th+tm
                                    bag = bag+day_total
                                }
                                
                                continue_slot = 1
                                break
                            } else { //** SI NO ES EL PRIMER FICHAJE DE ESE DIA */
                                if (check_now == 0) {
                                    $('.check-in-slots').each(function(){
                                        if (($(this).attr('year') == this_year) && ($(this).attr('month') == this_month) && ($(this).attr('day') == day_count)) {
                                            let visibility = ''
                                            if (data.slots[i]['fields'].manually == false) {
                                                visibility = 'hidden'
                                            } else if (data.slots[i]['fields'].manually == true) {
                                                visibility = 'visible'
                                            }

                                            order++
                                            $(this).append(
                                                '<br><br>'+
                                                '<div check_id="'+data.slots[i]['pk']+'">'+
                                                    '<i class="fas fa-info-circle edited-modal" style="float:left; margin-right: 2%; font-size: 22px; margin-top: 1%; visibility:'+visibility+'; cursor:pointer;" check_id="'+data.slots[i]['pk']+'" data-toggle="modal" data-target="#edited_traceability"></i>'+
                                                    '<input type="time" class="form-control col-md-2 input-required check-in-element" order="'+order+'" month="'+this_month+'" day="'+day_count+'" style="float:left;border-radius: 10px; font-size: 15px; text-align: center; padding-top: 0.8%; " value="'+cih+':'+cim+'" required>'+
                                                    '<input type="time" class="form-control col-md-2 input-required check-out-element" order="'+order+'" month="'+this_month+'" day="'+day_count+'" style="margin-left:2%; float:left;border-radius: 10px; font-size: 15px; text-align: center; padding-top: 0.8%; " value="'+coh+':'+com+'" required>'+
                                                    '<button type="button" style="margin-left: 2%; border-radius: 26px; font-weight: bold; display:none;" order="'+order+'" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'" check_id="'+data.slots[i]['pk']+'" class="edit_check_in btn btn-primary btn-md remove-element">Modificar</button>'+
                                                    '<button type="button" style="margin-left: 1%; border-radius: 26px; font-weight: bold; display:none;" order="'+order+'" day="'+day_count+'" class="btn btn-danger btn-md remove-element cancel_edit_check_in"><i class="fas fa-close"></i></button>'+
                                                '</div>'
                                            )
                                            th = (coh-cih)*60
                                            tm = com-cim
                                            day_total = th+tm
                                            bag = bag+day_total
                                        }
                                    })
                                } else {
                                    $('.check-in-slots').each(function(){
                                        if (($(this).attr('year') == this_year) && ($(this).attr('month') == this_month) && ($(this).attr('day') == day_count)) {
                                            let visibility = ''
                                            if (data.slots[i]['fields'].manually == false) {
                                                visibility = 'hidden'
                                            } else if (data.slots[i]['fields'].manually == true) {
                                                visibility = 'visible'
                                            }

                                            order++
                                            $(this).append(
                                                '<br><br>'+
                                                '<div check_id="'+data.slots[i]['pk']+'">'+
                                                    '<i class="fas fa-info-circle edited-modal" style="float:left; margin-right: 2%; font-size: 22px; margin-top: 1%; visibility:'+visibility+'; cursor:pointer;" check_id="'+data.slots[i]['pk']+'" data-toggle="modal" data-target="#edited_traceability"></i>'+
                                                    '<input type="time" class="form-control col-md-2 input-required check-in-element now" order="'+order+'" month="'+this_month+'" day="'+day_count+'" style="float:left;border-radius: 10px; font-size: 20px; text-align: center; padding-top: 0.8%; " value="'+cih+':'+cim+'" required disabled>'+
                                                    '<div style="width: 122px;display: flex;background-color: #eceff1;padding: 0px 2%; align-items: center;margin-left: 23.8%;border-radius: 10px;max-height: 40px;">'+
                                                        '<div class="green-point" style="visibility: visible;margin-left: 5% !important;margin-top: -15%;"></div>'+    
                                                        '<p style="text-align: center;margin-left: 15%;font-size: 20px; margin-top: 13%;font-family: Montserrat, Georgia, Times New Roman, Times, serif;font-weight: 500;">Ahora</p>'+
                                                    '</div>'+
                                                    '<button type="button" style="margin-left: 2%; border-radius: 26px; font-weight: bold; display:none;" order="'+order+'" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'" check_id="'+data.slots[i]['pk']+'" class="edit_check_in btn btn-primary btn-md remove-element">Modificar</button>'+
                                                    '<button type="button" style="margin-left: 1%; border-radius: 26px; font-weight: bold; display:none;" order="'+order+'" day="'+day_count+'" class="btn btn-danger btn-md remove-element cancel_edit_check_in"><i class="fas fa-close"></i></button>'+
                                                '</div>'
                                            )
                                            th = (coh-cih)*60
                                            tm = com-cim
                                            day_total = th+tm
                                            bag = bag+day_total
                                        }
                                    })
                                }
                                break
                            }
                        } else {
                            let dis = ''
                            //** Sábados y domingos no se pueden rellenar */
                            if ((new Date(new_year, new_month, day_count).getDay() == 0) || (new Date(new_year, new_month, day_count).getDay() == 6)) {
                                dis = 'disabled'
                                add = ''
                            } else {
                                add = '<i class="fa fa-plus-circle add-slot" style="cursor:pointer; float:left; margin-left: 2%; font-size: 22px; margin-top: 1%; visibility:visible;" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'"></i><button year="'+this_year+'" month="'+this_month+'" day="'+day_count+'" type="button" style="margin-left: 2%; border-radius: 26px; font-weight: bold; display:none;" check_id="'+data.slots[i]['pk']+'" class="edit_check_in btn btn-primary btn-md remove-element">Modificar</button><button type="button" style="margin-left: 1%; border-radius: 26px; font-weight: bold; display:none;" day="'+day_count+'" class="btn btn-danger btn-md remove-element cancel_edit_check_in"><i class="fas fa-close"></i></button>'
                            }

                            if (continue_slot == 0) {
                                order = 1
                                if (absence_days.indexOf(day_count) != -1) {
                                    dis = 'disabled'
                                    $('#slot_list').append(
                                        '<li class="row check-in-row" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                            '<div class="col-md-2 check-in-day">'+
                                                '<h4>'+day_count+' '+month_list[this_month]+'</h4>'+
                                                '<h6 style="margin-top: -2%; font-size: 12px;">'+week_list[new Date(new_year, new_month, day_count).getDay()]+'</h6>'+
                                            '</div>'+
                                            '<div class="col-md-6 check-in-slots" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                                '<div check_id="none">'+
                                                    '<i class="fas fa-umbrella-beach edited-modal" style="float:left; margin-right: 1.3%; font-size: 22px; margin-top: 1%;" title="Vacaciones"></i>'+
                                                    '<input type="time" class="form-control col-md-2 input-required check-in-element" order="'+order+'" day="'+day_count+'" month="'+this_month+'" style="float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " '+dis+' required>'+
                                                    '<input type="time" class="form-control col-md-2 input-required check-out-element" order="'+order+'" day="'+day_count+'" month="'+this_month+'" style="margin-left:2%; float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " '+dis+' required>'+
                                                    add+
                                                    '<button type="button" style="margin-left: 2%; border-radius: 26px; font-weight: bold; display:none;" order="'+order+'" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'" check_id="'+data.slots[i]['pk']+'" class="edit_check_in btn btn-primary btn-md remove-element">Modificar</button>'+
                                                    '<button type="button" style="margin-left: 1%; border-radius: 26px; font-weight: bold; display:none;" order="'+order+'" day="'+day_count+'" class="btn btn-danger btn-md remove-element cancel_edit_check_in"><i class="fas fa-close"></i></button>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="col-md-2 check-in-total" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                                '<h4>0h 0m</h4>'+
                                            '</div>'+
                                            '<div class="col-md-2 check-in-balance" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                                '<h4>0h 0m</h4>'+
                                            '</div>'+
                                        '</li>'+
                                        '<hr>'
                                    )
                                } else {
                                    $('#slot_list').append(
                                        '<li class="row check-in-row" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                            '<div class="col-md-2 check-in-day">'+
                                                '<h4>'+day_count+' '+month_list[this_month]+'</h4>'+
                                                '<h6 style="margin-top: -2%; font-size: 12px;">'+week_list[new Date(new_year, new_month, day_count).getDay()]+'</h6>'+
                                            '</div>'+
                                            '<div class="col-md-6 check-in-slots" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                                '<div check_id="none">'+
                                                    '<i class="fas fa-info-circle edited-modal" style="float:left; margin-right: 2%; font-size: 22px; margin-top: 1%; visibility:hidden; cursor:pointer;" data-toggle="modal" data-target="#edited_traceability"></i>'+
                                                    '<input type="time" class="form-control col-md-2 input-required check-in-element" order="'+order+'" day="'+day_count+'" month="'+this_month+'" style="float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " '+dis+' required>'+
                                                    '<input type="time" class="form-control col-md-2 input-required check-out-element" order="'+order+'" day="'+day_count+'" month="'+this_month+'" style="margin-left:2%; float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " '+dis+' required>'+
                                                    add+
                                                    '<button type="button" style="margin-left: 2%; border-radius: 26px; font-weight: bold; display:none;" order="'+order+'" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'" check_id="'+data.slots[i]['pk']+'" class="edit_check_in btn btn-primary btn-md remove-element">Modificar</button>'+
                                                    '<button type="button" style="margin-left: 1%; border-radius: 26px; font-weight: bold; display:none;" order="'+order+'" day="'+day_count+'" class="btn btn-danger btn-md remove-element cancel_edit_check_in"><i class="fas fa-close"></i></button>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="col-md-2 check-in-total" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                                '<h4>0h 0m</h4>'+
                                            '</div>'+
                                            '<div class="col-md-2 check-in-balance" year="'+this_year+'" month="'+this_month+'" day="'+day_count+'">'+
                                                '<h4>0h 0m</h4>'+
                                            '</div>'+
                                        '</li>'+
                                        '<hr>'
                                    )
                                }
                            } else {
                                //** Calculamos el total trabajado de ese día */
                                $('.check-in-total').each(function(){
                                    if (($(this).attr('year') == this_year) && ($(this).attr('month') == this_month) && ($(this).attr('day') == day_count)) {
                                        th = (''+bag/60+'').split('.')[0]
                                        tm = bag%60

                                        if (tm < 10) {
                                            tm = '0'+tm
                                        }

                                        $(this).html('<h4>'+th+'h '+tm+'m</h4>')
                                    }
                                })

                                //** Calculamos el balance total de ese día */
                                $('.check-in-balance').each(function(){
                                    if (($(this).attr('year') == this_year) && ($(this).attr('month') == this_month) && ($(this).attr('day') == day_count)) {
                                        day_balance = day_balance + bag
                                        th = (''+day_balance/60+'').split('.')[0]

                                        if (day_balance < 0) {
                                            tm = -day_balance%60
                                        } else {
                                            tm = day_balance%60
                                        }

                                        if ((tm >= 0) &&(tm < 10)) {
                                            tm = '0'+tm
                                        }

                                        if (th >= 0) {
                                            if (th[0] == '-') {
                                                $(this).html('<h4>-'+th.replace('-','')+'h '+tm+'m</h4>')
                                            } else {
                                                $(this).html('<h4>+'+th.replace('-','')+'h '+tm+'m</h4>')
                                            }
                                        } else {
                                            $(this).html('<h4>'+th+'h '+tm+'m</h4>')
                                        }
                                    }
                                })

                                continue_slot = 0
                            }

                            bag = 0
                            day_balance = -480
                        }
                    }
                }

                for (let w = day_count+1; w <= this_month_days; w++) {
                    let dis = ''
                    if ((new Date(new_year, new_month, w).getDay() == 0) || (new Date(new_year, new_month, w).getDay() == 6)) {
                        dis = 'disabled'
                    }

                    if (w > this_days) {
                        dis = 'disabled'
                    }

                    if (absence_days.indexOf(w) != -1) {
                        dis = 'disabled'
                        $('#slot_list').append(
                            '<li class="row check-in-row" year="'+this_year+'" month="'+this_month+'" day="'+w+'">'+
                                '<div class="col-md-2 check-in-day">'+
                                    '<h4>'+w+' '+month_list[this_month]+'</h4>'+
                                    '<h6 style="margin-top: -2%; font-size: 12px;">'+week_list[new Date(new_year, new_month, w).getDay()]+'</h6>'+
                                '</div>'+
                                '<div class="col-md-6 check-in-slots" year="'+this_year+'" month="'+this_month+'" day="'+w+'">'+
                                    '<div check_id="none">'+
                                        '<i class="fas fa-umbrella-beach edited-modal" style="float:left; margin-right: 1.3%; font-size: 22px; margin-top: 1%;" title="Vacaciones"></i>'+
                                        '<input type="time" class="form-control col-md-2 input-required check-in-element" order ="1" day="'+w+'" month="'+this_month+'" style="float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " '+dis+' required>'+
                                        '<input type="time" class="form-control col-md-2 input-required check-out-element" order ="1" day="'+w+'" month="'+this_month+'" style="margin-left:2%; float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " '+dis+' required>'+
                                        '<button type="button" style="margin-left: 2%; border-radius: 26px; font-weight: bold; display:none;" check_id="0" order ="1" year="'+this_year+'" month="'+this_month+'" day="'+w+'" class="edit_check_in btn btn-primary btn-md remove-element">Modificar</button>'+
                                        '<button type="button" style="margin-left: 1%; border-radius: 26px; font-weight: bold; display:none;" order ="1" day="'+w+'" class="btn btn-danger btn-md remove-element cancel_edit_check_in"><i class="fas fa-close"></i></button>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="col-md-2 check-in-total" year="'+this_year+'" month="'+this_month+'" day="'+w+'">'+
                                    '<h4>0h 0m</h4>'+
                                '</div>'+
                                '<div class="col-md-2 check-in-balance" year="'+this_year+'" month="'+this_month+'" day="'+w+'">'+
                                    '<h4>0h 0m</h4>'+
                                '</div>'+
                            '</li>'+
                            '<hr>'
                        )
                    } else {
                        $('#slot_list').append(
                            '<li class="row check-in-row" year="'+this_year+'" month="'+this_month+'" day="'+w+'">'+
                                '<div class="col-md-2 check-in-day">'+
                                    '<h4>'+w+' '+month_list[this_month]+'</h4>'+
                                    '<h6 style="margin-top: -2%; font-size: 12px;">'+week_list[new Date(new_year, new_month, w).getDay()]+'</h6>'+
                                '</div>'+
                                '<div class="col-md-6 check-in-slots" year="'+this_year+'" month="'+this_month+'" day="'+w+'">'+
                                    '<div check_id="none">'+
                                        '<i class="fas fa-info-circle edited-modal" style="float:left; margin-right: 2%; font-size: 22px; margin-top: 1%; visibility:hidden;" data-toggle="modal" data-target="#edited_traceability"></i>'+
                                        '<input type="time" class="form-control col-md-2 input-required check-in-element" order ="1" day="'+w+'" month="'+this_month+'" style="float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " '+dis+' required>'+
                                        '<input type="time" class="form-control col-md-2 input-required check-out-element" order ="1" day="'+w+'" month="'+this_month+'" style="margin-left:2%; float:left;border-radius: 10px;font-size: 15px; text-align: center; padding-top: 0.8%; " '+dis+' required>'+
                                        '<button type="button" style="margin-left: 2%; border-radius: 26px; font-weight: bold; display:none;" check_id="0" order ="1" year="'+this_year+'" month="'+this_month+'" day="'+w+'" class="edit_check_in btn btn-primary btn-md remove-element">Modificar</button>'+
                                        '<button type="button" style="margin-left: 1%; border-radius: 26px; font-weight: bold; display:none;" order ="1" day="'+w+'" class="btn btn-danger btn-md remove-element cancel_edit_check_in"><i class="fas fa-close"></i></button>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="col-md-2 check-in-total" year="'+this_year+'" month="'+this_month+'" day="'+w+'">'+
                                    '<h4>0h 0m</h4>'+
                                '</div>'+
                                '<div class="col-md-2 check-in-balance" year="'+this_year+'" month="'+this_month+'" day="'+w+'">'+
                                    '<h4>0h 0m</h4>'+
                                '</div>'+
                            '</li>'+
                            '<hr>'
                        )
                    }
                }
            }

            //** Calculamos el tiempo total trabajado del último fichaje */
            $('.check-in-total').each(function(){
                if (($(this).attr('year') == this_year) && ($(this).attr('month') == this_month) && ($(this).attr('day') == day_count)) {
                    th = (''+bag/60+'').split('.')[0]
                    tm = bag%60

                    if (tm < 10) {
                        tm = '0'+tm
                    }

                    $(this).html('<h4>'+th+'h '+tm+'m</h4>')
                }
            })

            //** Calculamos el balance total trabajado del último fichaje */
            $('.check-in-balance').each(function(){
                if (($(this).attr('year') == this_year) && ($(this).attr('month') == this_month) && ($(this).attr('day') == day_count)) {
                    day_balance = day_balance + bag
                    th = (''+day_balance/60+'').split('.')[0]

                    if (day_balance < 0) {
                        tm = -day_balance%60
                    } else {
                        tm = day_balance%60
                    }

                    if ((tm >= 0) &&(tm < 10)) {
                        tm = '0'+tm
                    }

                    if (th >= 0) {
                        $(this).html('<h4>+'+th+'h '+tm+'m</h4>')
                    } else {
                        $(this).html('<h4>'+th+'h '+tm+'m</h4>')
                    }
                }
            })

            if (current_month != this_month) {
                $('.add-slot').each(function() {
                    $(this).remove()
                })

                $('.input-required').each( function() {
                    $(this).attr('disabled','true')
                })
            }

            calculateMonthlyTotals()
            deleteAdd()
            $('.loading-banner').hide();
            $('#slot_list').show();
            $('.card-title').text($('.specific-name').val())
            $('.specific-year').val('')
            $('.specific-month').val('')
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

//** Recalcular el total trabajado del mes y el balance total del mes */
function calculateMonthlyTotals() {
    let h = 0
    let m = 0

    $('.check-in-total').each(function(){
        text = $(this).text()
        h = parseInt(h)+parseInt(text.split('h')[0])
        m = parseInt(m)+parseInt((text.split(' ')[1]).split('m')[0])
    })

    h = parseInt(h)+parseInt((''+m/60+'').split('.')[0])
    m = parseInt(m)-((''+m/60+'').split('.')[0])*60
    $('.check-in-total-month').text('Total horas trabajadas: '+h+'h '+m+'m')

    h = 0
    m = 0
    $('.check-in-balance').each(function(){
        text = $(this).text()
        h = parseInt(h)+parseInt(text.split('h')[0])
        if (text.indexOf('-') > -1) {
            m = parseInt(m)+parseInt(-(text.split(' ')[1]).split('m')[0])
        } else {
            m = parseInt(m)+parseInt((text.split(' ')[1]).split('m')[0])
        }
    });

    h = parseInt(h)+parseInt((''+m/60+'').split('.')[0])
    m = parseInt(m)-((''+m/60+'').split('.')[0])*60
    m = m*=-1
    if (m < 10 && m >= 0) {
        m = '0'+m
    }
    $('.check-in-balance-month').text('Total balance: '+h+'h '+m+'m')
}

//** Añadir un slot nuevo al pulsar en añadir */
let add_count = 0
$(document).on('click', '.add-slot', function () {
    let this_day = $(this).attr('day')
    let this_month = $(this).attr('month')
    let this_year = $(this).attr('year')
    $('.check-in-slots').each(function() {
        if (($(this).attr('day') == this_day) && (add_count == 0)) {
            $(this).append(
                '<br class="remove-element"><br class="remove-element">'+
                '<i class="fas fa-info-circle remove-element edited-modal" style="float:left; margin-right: 2%; font-size: 22px; margin-top: 1%; visibility:hidden;" data-toggle="modal" data-target="#edited_traceability"></i>'+
                '<input type="time" class="form-control col-md-2 remove-element check-in-element new" day="'+this_day+'" month="'+this_month+'" style="float:left;border-radius: 10px;font-size: 20px; text-align: center; padding-top: 0.8%; " required>'+
                '<input type="time" class="form-control col-md-2 remove-element check-out-element new" day="'+this_day+'" month="'+this_month+'" style="margin-left:2%; float:left;border-radius: 10px;font-size: 20px; text-align: center; padding-top: 0.8%; " required>'+
                '<button type="button" style="margin-left: 2%; border-radius: 26px; font-weight: bold;" day="'+this_day+'" month="'+this_month+'" year="'+this_year+'"class="btn btn-primary btn-md remove-element save_check_in">Guardar</button>'+
                '<button type="button" style="margin-left: 1%; border-radius: 26px; font-weight: bold;" class="btn btn-danger btn-md remove-element cancel_check_in"><i class="fas fa-close"></i></button>'
            )
            add_count = 1
        }
    })
})

//** Guardar el slot que se está añadiendo */
$(document).on('click', '.save_check_in', function () {
    let edited_day = $(this).attr('day')
    let cid = $('.check-in-element.new[day='+edited_day+']').val()
    let cod = $('.check-out-element.new[day='+edited_day+']').val()
    let cid_min = parseInt(cid.split(':')[0]*60)+parseInt(cid.split(':')[1])
    let cod_min = parseInt(cod.split(':')[0]*60)+parseInt(cod.split(':')[1])

    let date = new Date()
    if (current_day == edited_day) {
        current_hours = date.getHours()
        current_minutes = date.getMinutes()
        current_total = parseInt(current_hours)*60+parseInt(current_minutes)
    }

    let specific_user = $('.specific-user').val()

    var now = new Date();
    var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    utc = (utc.toString()).split('+')[1]
    utc = utc[1]    

    if (cid && cod) {
        if (cid == cod) {
            toastr.error('La entrada y la salida no pueden ser iguales.', 'Error al guardar el fichaje');
        } else if (cid_min > cod_min) {
            toastr.error('La hora de entrada no puede ser posterior a la hora de salida.', 'Error al guardar el fichaje');
        } else if ((current_day == edited_day) && (cod_min > current_total)) {
            toastr.error('La hora de fichaje supera la hora actual.', 'Error al guardar el fichaje');
        } else {
            let cil = []
            let col = []

            $('.check-in-element.input-required[day="'+edited_day+'"]').each(function() {
                cil.push(parseInt($(this).val().split(':')[0]*60)+parseInt($(this).val().split(':')[1]))
            })

            $('.check-out-element.input-required[day="'+edited_day+'"]').each(function() {
                col.push(parseInt($(this).val().split(':')[0]*60)+parseInt($(this).val().split(':')[1]))
            })

            let err = 0
            for (let i = 0; i < cil.length; i++) {
                if ((cid_min>=cil[i] && cid_min<col[i]) || (cod_min>cil[i] && cod_min<=col[i]) || (cid_min<=cil[i] && cod_min>=col[i])) {
                    err = 1
                }
            }

            if (err == 1) {
                toastr.error('El fichaje introducido se solapa con otro fichaje.', 'Error al guardar el fichaje');
            } else {
                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                    device = 1
                } else {
                    device = 0
                }

                let check_in_utc = parseInt(($('.check-in-element.new[day='+edited_day+']').val()).split(':')[0])-utc+':'+($('.check-in-element.new[day='+edited_day+']').val()).split(':')[1]
                let check_out_utc = parseInt(($('.check-out-element.new[day='+edited_day+']').val()).split(':')[0])-utc+':'+($('.check-out-element.new[day='+edited_day+']').val()).split(':')[1]
                $.ajax({
                    type:'POST',
                    url:'/check-in/',
                    data:{
                        day: edited_day,
                        month: parseInt($(this).attr('month'))+1,
                        year: $(this).attr('year'),
                        check_in: check_in_utc,
                        check_out: check_out_utc,
                        specific_user: specific_user,
                        device: device,
                        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
                        action: 'save_slot'
                    },
                    success:function(){
                        $('.save_check_in').remove()
                        $('.cancel_check_in').remove()
                        $('.new').each(function() {
                            $(this).removeClass('new')
                        })
                        $('#slot_list').empty()
                        date = new Date()
                        calculateSlots(current_year, current_month, date.getDate())
                        add_count = 0
                        toastr.success('El fichaje del día '+edited_day+' ha sido añadido correctamente.','Fichaje añadido')
                    },
                    error : function(xhr,errmsg,err) {
                        toastr.error('', 'Error al actualizar');
                        console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                    }
                });
            }
        }
    } else {
        toastr.error('Tanto la entrada como la salida deben estar cumplimentados', 'Error al guardar el fichaje');
    }
})

//** Eliminar el slot que se está añadiendo */
$(document).on('click', '.cancel_check_in', function () {
    $('.remove-element').each(function() {
        $(this).remove()
    })
    add_count = 0
})

//** Detectar cambios en un slot */
$(document).on('keydown', '.input-required', function (event) {
    var key_code = event.which || event.keyCode;
    let edited_day = $(this).attr('day')
    let edited_order = $(this).attr('order')
    $('.add-slot[day='+edited_day+']').hide()
    $('.edit_check_in[order='+edited_order+'][day='+edited_day+']').show()
    $('.cancel_edit_check_in[order='+edited_order+'][day='+edited_day+']').show()
})

//** Editar el slot concreto que se está modificando */
$(document).on('click', '.edit_check_in', function () {
    let edited_day = $(this).attr('day')
    let edited_order = $(this).attr('order')
    let edited_check_id = $(this).attr('check_id')
    let cid = $('.check-in-element[order='+edited_order+'][day='+edited_day+']').val()
    let cod = $('.check-out-element[order='+edited_order+'][day='+edited_day+']').val()
    let cid_min = parseInt(cid.split(':')[0]*60)+parseInt(cid.split(':')[1])
    let cod_min = parseInt(cod.split(':')[0]*60)+parseInt(cod.split(':')[1])

    let date = new Date()
    if (current_day == edited_day) {
        current_hours = date.getHours()
        current_minutes = date.getMinutes()
        current_total = parseInt(current_hours)*60+parseInt(current_minutes)
    }

    var now = new Date();
    var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    utc = (utc.toString()).split('+')[1]
    utc = utc[1]

    let specific_user = $('.specific-user').val()

    if (cid && cod) {
        if (cid == cod) {
            toastr.error('La entrada y la salida no pueden ser iguales.', 'Error al guardar el fichaje');
        } else if (cid_min > cod_min) {
            toastr.error('La hora de entrada no puede ser posterior a la hora de salida.', 'Error al guardar el fichaje');
        } else if ((current_day == edited_day) && (cod_min > current_total)) {
            toastr.error('La hora de fichaje supera la hora actual.', 'Error al guardar el fichaje');
        } else {
            let cil = []
            let col = []

            $('.check-in-element.input-required[day="'+edited_day+'"][order!="'+edited_order+'"]').each(function() {
                cil.push(parseInt($(this).val().split(':')[0]*60)+parseInt($(this).val().split(':')[1]))
            })

            $('.check-out-element.input-required[day="'+edited_day+'"][order!="'+edited_order+'"]').each(function() {
                col.push(parseInt($(this).val().split(':')[0]*60)+parseInt($(this).val().split(':')[1]))
            })

            let err = 0
            for (let i = 0; i < cil.length; i++) {
                if ((cid_min>=cil[i] && cid_min<col[i]) || (cod_min>cil[i] && cod_min<=col[i]) || (cid_min<=cil[i] && cod_min>=col[i])) {
                    err = 1
                }
            }

            if (err == 1) {
                toastr.error('El fichaje introducido se solapa con otro fichaje.', 'Error al guardar el fichaje');
            } else {
                let check_in_utc = parseInt(($('.check-in-element[order='+edited_order+'][day='+edited_day+']').val()).split(':')[0])-utc+':'+($('.check-in-element[order='+edited_order+'][day='+edited_day+']').val()).split(':')[1]
                let check_out_utc = parseInt(($('.check-out-element[order='+edited_order+'][day='+edited_day+']').val()).split(':')[0])-utc+':'+($('.check-out-element[order='+edited_order+'][day='+edited_day+']').val()).split(':')[1]
                $.ajax({
                    type:'POST',
                    url:'/check-in/',
                    data:{
                        check_id:edited_check_id,
                        day: edited_day,
                        month: parseInt($(this).attr('month'))+1,
                        year: $(this).attr('year'),
                        utc: utc,
                        check_in: check_in_utc,
                        check_out: check_out_utc,
                        specific_user: specific_user,
                        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
                        action: 'edit_slot'
                    },
                    success:function(){
                        $('.edit_check_in[order='+edited_order+'][day='+edited_day+']').hide()
                        $('.cancel_edit_check_in[order='+edited_order+'][day='+edited_day+']').hide()
                        $('.add-slot[day='+edited_day+']').show()

                        $('#slot_list').empty()
                        date = new Date()
                        calculateSlots(current_year, current_month, date.getDate())
                        add_count = 0
                        toastr.success('El fichaje del día '+edited_day+' ha sido editado correctamente.','Fichaje editado')
                    },
                    error : function(xhr,errmsg,err) {
                        toastr.error('', 'Error al actualizar');
                        console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                    }
                });
            }
        }
    } else {
        toastr.error('Tanto la entrada como la salida deben estar cumplimentados', 'Error al guardar el fichaje');
    }
})

//** Cancelar cambios en los slots */
$(document).on('click', '.cancel_edit_check_in', function () {
    let edited_day = $(this).attr('day')
    let edited_order = $(this).attr('order')
    $('.add-slot[day='+edited_day+']').show()
    $('.edit_check_in[order='+edited_order+'][day='+edited_day+']').hide()
    $('.cancel_edit_check_in[order='+edited_order+'][day='+edited_day+']').hide()
})

/** Eliminar los botones de añadir innecesarios */
function deleteAdd() {
    $('.add-slot').each(function() {
        let add_day = $(this).attr('day')
        let add_list = []
    
        $('.check-in-element.input-required[day="'+add_day+'"]').each(function() {
            if ($(this).val()) {
                add_list.push('x')
            } else {
                $(this).addClass('modified')
            }
        })
    
        if (add_list.length == 0) {
            $(this).remove()
        }
    })
}

//** Modal de los tramos editados */
$(document).on('click', '.edited-modal', function () {
    $('.traceability-container').empty()
    let check_id = $(this).attr('check_id')

    $.ajax({
        type:'POST',
        url:'/check-in/',
        data:{
            check_id:check_id,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_edited'
        },
        success:function(respuesta){
            let data = JSON.parse(respuesta)
            let cihour = ((data[0]['fields'].check_in).split('T')[1]).split(':')[0]
            let ciminutes = ((data[0]['fields'].check_in).split('T')[1]).split(':')[1]
            cihour = parseInt(cihour)+utc

            let cohour = ((data[0]['fields'].check_out).split('T')[1]).split(':')[0]
            let cominutes = ((data[0]['fields'].check_out).split('T')[1]).split(':')[1]
            cohour = parseInt(cohour)+utc

            let cihour_or = ((data[0]['fields'].check_in_edited).split('T')[1]).split(':')[0]
            let ciminutes_or = ((data[0]['fields'].check_in_edited).split('T')[1]).split(':')[1]
            cihour_or = parseInt(cihour_or)+utc

            let cohour_or = ((data[0]['fields'].check_out_edited).split('T')[1]).split(':')[0]
            let cominutes_or = ((data[0]['fields'].check_out_edited).split('T')[1]).split(':')[1]
            cohour_or = parseInt(cohour_or)+utc

            if ((data[0]['fields'].check_in == data[0]['fields'].check_in_edited) && (data[0]['fields'].check_out == data[0]['fields'].check_out_edited) && (data[0]['fields'].manually == true)) {
                $('.traceability-container').append(
                    '<fieldset class="form-group col-2">'+
                        '<label for="slot_start" style="font-weight:600;">Entrada</label>'+
                        '<p>'+cihour+':'+ciminutes+'</p>'+
                    '</fieldset>'+
                    '<fieldset class="form-group col-2">'+
                        '<label for="slot_finish" style="font-weight:600;">Salida</label>'+
                        '<p>'+cohour+':'+cominutes+'</p>'+
                    '</fieldset>'+
                    '<fieldset class="form-group col-8">'+
                        '<label for="slot_finish">Observación</label>'+
                        '<p>Este tramo ha sido introducido manualmente</p>'+
                    '</fieldset>'
                )
            } else {
                if ((data[0]['fields'].check_in != data[0]['fields'].check_in_edited) && (data[0]['fields'].check_out != data[0]['fields'].check_out_edited)) {
                    $('.traceability-container').append(
                        '<fieldset class="form-group col-6">'+
                            '<label for="slot_start" style="font-weight:600;">Entrada</label>'+
                            '<p> La entrada '+cihour_or+':'+ciminutes_or+' ha sido cambiada por '+cihour+':'+ciminutes+'</p>'+
                        '</fieldset>'+
                        '<fieldset class="form-group col-6">'+
                            '<label for="slot_finish" style="font-weight:600;">Salida</label>'+
                            '<p> La salida '+cohour_or+':'+cominutes_or+' ha sido cambiada por '+cohour+':'+cominutes+'</p>'+
                        '</fieldset>'
                    )
                } else if (data[0]['fields'].check_in != data[0]['fields'].check_in_edited) {
                    $('.traceability-container').append(
                        '<fieldset class="form-group col-6">'+
                            '<label for="slot_start" style="font-weight:600;">Entrada</label>'+
                            '<p> La entrada '+cihour_or+':'+ciminutes_or+' ha sido cambiada por '+cihour+':'+ciminutes+'</p>'+
                        '</fieldset>'
                    )
                } else if (data[0]['fields'].check_out != data[0]['fields'].check_out_edited) {
                    $('.traceability-container').append(
                        '<fieldset class="form-group col-6">'+
                            '<label for="slot_finish" style="font-weight:600;">Salida</label>'+
                            '<p> La salida '+cohour_or+':'+cominutes_or+' ha sido cambiada por '+cohour+':'+cominutes+'</p>'+
                        '</fieldset>'
                    )
                }
                
            }
        },
        error : function(xhr,errmsg,err) {
            toastr.error('', 'Error al actualizar');
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
})