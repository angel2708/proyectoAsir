dataTable = $('#users-table').DataTable({ 'order': [[1, 'desc']] });
$('#users-table').parent().css('overflow-x', 'scroll')
$('.table-responsive').css('overflow-x', 'hidden')
dataTable.draw();

var currentRow;
var user_id;
var departament_id;
var profile_id;
var departament;
var admin;
var manager_id;

getPaidDays();
/* calendarReload(); */

// Función que valide el campo email
function validateEmail(email) {
    let arr = email.split('@');
    if (arr[0].length <1) {
        return false;
    } else if (arr.length == 2){
        arr = arr[1].split('.');
        if (arr[0].length <1) {
            return false;
        } else if (arr.length == 2){
            if (arr[1].length >= 2){
                return true;
            }
            return false;
        }
        return false;
    }
    return false;
}

// Función que valide que un campo no este vacío
function validateEmpty(string) {
    if (string != '') {
        return true;
    }
    return false;
}

// Función para sacar datos de paidVacations
function getPaidDays() {
    user_id = $('.cal-id_u').val();
    $.ajax({
        type: 'POST',
        url: '/get-paid/',
        data: {
            user_id: user_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'get_paid'
        },
        success: function (respuesta) {
            let paid = JSON.parse(respuesta);
            paid_days = 0;
            for (let i = 0; i < paid.length; i++) {
                paid_days = paid_days + (paid[i]['fields'].amount)
            }
            $('.mcd-paid_days').val(paid_days+" días")
            getTotalDays();
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

// Función para sacar datos de companies
function getTotalDays() {
    company_id = $('.cal-company_id_u').val();
    $.ajax({
        type: 'POST',
        url: '/get-company/',
        data: {
            company_id: company_id,
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
            
            $('.mcd-total_days').text(company_vacations_days+" días");
            user_vacation_days = $('.mcd-enjoyed_days').text().split(' ');
            user_pending_days = $('.mcd-pending_days').text().split(' ')
            vacation_days = user_vacation_days[0]
            pending_days = user_pending_days[0]
            $('.mcd-remaining_days').text(parseInt(company_vacations_days)+parseInt(user_pending_days[0])-parseInt(user_vacation_days[0])+" días")

            if (vacations_range == false) {
                $('.hd-date2_u').prop("disabled", true);
            } else {
                $('.hd-date2_u').prop("disabled", false);
            }
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

// Función para Select anidados | Sacar el Perfil en función del valor del Departamento
$(".dependentSelect").click(function () {
    departament_id = $('.cd-departament_id').val();

    $.ajax({
        type: 'POST',
        url: '/select-departament/',
        data: {
            departament_id: departament_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (respuesta) {
            let profiles = JSON.parse(respuesta);
            number = 0;
            for (let i = 0; i < profiles.length; i++) {
                if (number == 0) {
                    $(".cd-user_profile").empty().append('<option value="'+profiles[i]["pk"]+'">'+ profiles[i]["fields"].name +'</option>');
                    number += 1;
                } else if (number < profiles.length){
                    $(".cd-user_profile").append('<option value="'+profiles[i]["pk"]+'">'+ profiles[i]["fields"].name +'</option>');
                    number += 1;
                } 
            }
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
});

// Función para actualizar los datos de los usuarios.
$(".updateUser").click(function () {
    company_user_id = $('.cd-company_user_id').val();
    let last_name = $('.cd-last_name').val(); 
    let first_name = $('.cd-first_name').val();
    let email = $('.cd-email').val();
    departament_id = $('.cd-departament_id').val();
    let new_name_avatar = $('.cd-first_name').val()[0].toUpperCase() + $('.cd-last_name').val()[0].toUpperCase();
    // Dependiendo del company_user_id el usuario ve solo el departamento o además el perfil. (company_user_id = 1 solo tiene Departamento)
    if (company_user_id == 1){
        user_profile = 0
    } else {
        user_profile = $('.cd-user_profile').val();
    }
    user_id = $('.cd-id').val();
    
    // Llamada AJAX
    if (validateEmpty(first_name) && validateEmpty(last_name)) {
        if (validateEmail(email)){
            $.ajax({
                type: 'POST',
                url: '/users-management/'+user_id,
                data: {
                    last_name: last_name,
                    first_name: first_name,
                    email: email,
                    departament_id: departament_id,
                    user_profile: user_profile,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'update_user'
                },
                success: function () {
                    toastr.success('Los datos del usuario han sido actualizados.', 'Operación realizada con éxito', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                    $('.users-view-name').html(first_name + " " + last_name + " | ");
                    $('.users-view-username').html(email);
                    $('.text-avatar').html(new_name_avatar);

                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        } else {
            toastr.error('El email introducido no es valido.', 'Error');
        }
    } else {
        toastr.error('No se pueden dejar campos vacíos.', 'Error');
    }  
});

////// MODAL DE VACACIONES DENTRO DE LA FICHA DE USUARIO //////
// Day Off - Holidays
function showContentHolidaysU() {
    element = document.getElementById("content_day_off_u");
    check = document.getElementById("day_off_u");
    if (check.checked) {
        element.style.display='none';
    }
    else {
        element.style.display='block';
    }
}

// Fecha actual
var fecha = new Date();
var day = fecha.getDate();
var month = fecha.getMonth();
var months = new Array ("01","02","03","04","05","06","07","08","09","10","11","12");
var year = fecha.getFullYear();
var diasMes = new Date(year, months[month], 0).getDate();

// Función que saca los días laborables
function workingDaysU(dateFrom, dateTo) {
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
function calculateDaysU(dateFrom) {
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

// Damos valor a algunos input con la fecha actual
date = (year+"-"+months[month]+"-"+day);
$('.hd-date1_u').val(date)

////HOLIDAYS
// Si es sólamente un día libre, el valor del segun input date debe ser igual al valor del primero.
function dayOffU() {
    if (document.getElementById('day_off_u').checked) {
        $('.hd-date2_u').val($('#date_now2_u').val())
    } else {
        new_date = $('.hd-date1_u').val();
        after_date = new Date(new_date);
        var after_day = after_date.getDate();
        var after_month = after_date.getMonth();
        var after_year = after_date.getFullYear();
        var after_diasMes = new Date(after_year, months[after_month], 0).getDate();
        vac_days = calculateDaysU(new_date);
        var finish_day = (vac_days+(after_day+(max_vacations-min_vacations)));
        if (finish_day <10){
            finish_day = '0'+finish_day;
        }
        if (finish_day > after_diasMes) {
            result = finish_day - after_diasMes;
            finish_day = '0'+result;
            after_month = after_month+1;
            if (after_month > 11) {
                after_month = 0;
                after_year = after_year+1;
            }
        }
        finish_date = (after_year+"-"+months[after_month]+"-"+finish_day);
        $('.hd-date2_u').val(finish_date)
    }
}

// Función que calcule automáticamente el último dia de vacaciones en función del primer día.
$(".hd-date1_u").change(function () {
    dayOffU();
});

// Función que guarda las vacaciones en la base de datos.
$(".saveHolidays_u").click(function () {
    user_id = $('.cal-id_u').val();
    company_id = $('.cal-company_id_u').val();
    departament_id = $('.cal-departament_id_u').val();
    enjoyed = $('.mcd-enjoyed_days').text().split(' ');
    vacations_days = enjoyed[0]
    title = $('.cal-title_u').val();
    start_date = $('.hd-date1_u').val();
    finish_date = $('.hd-date2_u').val();
    vacations_range = vacations_range;
    
    //Validamos si las vacaciones son o no correctas en función de los días que se cogen y los que quedan.
    if (vacations_range == false) {
        startDate = moment(start_date);
        finishDate = moment(finish_date);
        work_days = workingDaysU(startDate, finishDate);
        if (validateEmpty(title)) {
            if (work_days == min_vacations) {
                if (startDate.isoWeekday() >=start_day && startDate.isoWeekday() <=end_day) {
                    vacation_days = vacation_days +++ work_days;
                    if (vacation_days >= company_vacations_days) {
                        return toastr.error('No dispones de días de vacaciones.', 'Error');
                    } else {
                        $('.hd-vacation_days_u').val(vacation_days)
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
                        $('.hd-vacation_days_u').val(vacation_days)
                    }
                } else {
                    return toastr.error('Los días seleccionados no son válidos.', 'Error');
                }
            } else {
                return toastr.error('No te puedes coger días libres en un fin de semana', 'Error');
            }
        } else {
            return toastr.error('No se puede dejar el título vacío.', 'Error');
        }
    } else {
        startDate = moment(start_date);
        finishDate = moment(finish_date);
        work_days = workingDaysU(startDate, finishDate);
        if (validateEmpty(title)) {
            if ((work_days >= min_vacations) && (work_days <= max_vacations)) {
                vacation_days = vacation_days +++ work_days;
                if (vacation_days >= company_vacations_days) {
                    return toastr.error('No dispones de días de vacaciones suficientes.', 'Error');
                } else {
                    $('.hd-vacation_days_u').val(vacation_days)
                }
            }
            else {
                return toastr.error('Sólo se permiten rangos de días entre '+min_vacations+' y '+max_vacations, 'Error');
            }
        } else {
            return toastr.error('No se puede dejar el título vacío.', 'Error');
        }
    }

    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/save-holidays/',
        data: {
            title: title,
            user_id: user_id,
            company_id: company_id,
            departament_id: departament_id,
            vacation_days: vacation_days,
            start_date: start_date,
            finish_date: finish_date,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'save_holidays'
        },
        success: function() {
            $(".hd-vacation_days_u").val(vacation_days)
            $('.mcd-enjoyed_days').text(vacation_days+" días")
            $('.mcd-remaining_days').text(company_vacations_days - vacation_days+" días")
            calendarReload();
            toastr.success('Quedan '+(company_vacations_days-vacation_days)+' días de vacaciones.', 'Las vacaciones han sido añadidas.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
});

// Mini Calendario
/* function calendarReload() {
    departament_id = $('.cal-departament_id_u').val();
    $.ajax({
        type: 'POST',
        url: '/get-vacations/',
        data: {
            user_id: user_id,
            departament_id: departament_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'get_vacations'
        },
        success: function (respuesta) {
            console.log(respuesta);
            let miniCalendar = new Calendar('calendar', JSON.parse(respuesta));
            miniCalendar.getElement().addEventListener('click', e => {
                select = miniCalendar.value().format('YYYY-MM-DD');
                $('.hd-date1_u').val(select)
                dayOffU();
    });
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
} */


//Función para calcular el total de días de vacaciones que se han pagado.
$(".payDays").click(function () {
    user_id = $('.cal-id_u').val();
    company_id = $('.cal-company_id_u').val();
    enjoyed = $('.mcd-enjoyed_days').text().split(' ');
    vacations_days = enjoyed[0]
    amount = $('.to_pay').val();
    pending = $('.mcd-pending_days').text().split(' ')
    total_paid = Number(paid_days) + Number(amount)

    if ((total_paid) > pending[0]) {
        if (paid_days > pending[0]) {
            diff = amount
        } else {
            diff = total_paid - pending[0]
        }

        let total = company_vacations_days-vacation_days-diff

        if (total < 0) {
            toastr.error('No dispones de tantos días de vacaciones', 'Error');
            return
        }

        $('.mcd-remaining_days').text(total+" días")
        console.log("vacation days antes de la actualizacion: "+vacation_days);
        vacation_days = vacation_days +++ Number(diff)
        console.log("vacation days después de la actualizacion: "+vacation_days);
        console.log("----------------------------------------------------------");
    }
    
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/pay-days/',
        data: {
            user_id: user_id,
            company_id: company_id,
            vacation_days: vacation_days,
            amount: amount,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'pay_days'
        },
        success: function() {
            $('.mcd-paid_days').val(Number(paid_days) + Number(amount)+" días")
            toastr.success('Operación realizada con éxito', 'Días registrados como pagados.', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            $('.mcd-enjoyed_days').text(vacation_days+" días")
            getPaidDays();
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
});

//Buscar contenedor de llamadas
if($('#calls-count').length){
    $.ajax({
        type: 'POST',
        url: '/users-management/'+$('.hidden-client').val(),
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action:'get_calls'
        },
        success: function (response) {
            json = JSON.parse(response);

            $('#calls-count').html(json['call_count']);
            $('#calls-answered').html(json['answered']);
            $('#calls-not-answered').html(json['not_answered']);
            $('#calls-total-min').html(json['total_min']);
            $('#calls-avg-min').html(json['avg_min']);
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
}