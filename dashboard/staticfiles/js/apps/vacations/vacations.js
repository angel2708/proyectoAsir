// Clase para el calendario anual - PREVIEW
class Calendar {
    constructor(id, year) {
        this.cells = []
        this.year = year
        this.months = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        this.miniCalendar = document.getElementById(id)
        this.showTemplate()
        this.generateDates()
        this.gridBody = this.miniCalendar.querySelector('.grid-body');
        this.monthName = this.miniCalendar.querySelector('.month-name');
        this.showCells()
    }

    getMonth() {
        let month = this.miniCalendar.getAttribute('month')
        return month;
    }

    showTemplate() {
        this.miniCalendar.innerHTML = this.getTemplate();
    }

    getTemplate() {
        let template = `
        <div class="calendar-header" style="margin-bottom: 10px; margin-top: 5px;">
            <span class="month-name"></span><i class="feather icon-info more-info" month="${this.getMonth()}" year="${this.year}" style="color: #008385; margin-top: 2px; margin-right: 17px; font-size: 15px;"></i>
        </div>
        <div class="calendar-body">
            <div class="grid-main" month="${this.getMonth()}">
                <div class="grid-header" style="margin-bottom: 10px;">
                    <span class="grid-cell-gh">L</span>
                    <span class="grid-cell-gh">M</span>
                    <span class="grid-cell-gh">X</span>
                    <span class="grid-cell-gh">J</span>
                    <span class="grid-cell-gh">V</span>
                    <span class="grid-cell-gh">S</span>
                    <span class="grid-cell-gh">D</span>
                </div>
                <div class="grid-body">
                    
                </div>
                    </span>
                </div>
            </div>
        </div>
        `
        return template;
    }

    generateDates() {
        let month = this.getMonth();
        let cells = []

        if (month < 10) {
            month = '0' + month
        }

        let date = moment(this.year + '-' + month)

        let dateStart = moment(date).startOf('month')
        let dateEnd = moment(date).endOf('month')

        while (dateStart.isoWeekday() !== 1) {
            dateStart.subtract(1, 'days');
        }

        while (dateEnd.isoWeekday() !== 7) {
            dateEnd.add(1, 'days');
        }

        do {
            cells.push({
                date: moment(dateStart),
                isInCurrentMonth: dateStart.month() === date.month()
            })
            dateStart.add(1, 'days');
        } while (dateStart.isSameOrBefore(dateEnd));

        return cells;
    }

    showCells() {
        this.getMonth()
        this.cells = this.generateDates()

        this.gridBody.innerHTML = '';
        let templateCells = '';

        let month = this.getMonth()
        if (month < 10) {
            month = '0' + month
        }

        for (let i = 0; i < this.cells.length; i++) {
            let day = this.cells[i].date.date()
            if (day < 10) {
                day = '0' + day
            }

            if (this.cells[i].isInCurrentMonth) {
                templateCells += `
                    <span class="grid-cell grid-cell-gb ok" date="${this.year}-${month}-${day}" user="" dept="" data-toggle="modal" data-target="#">${this.cells[i].date.date()}</span>
                `;
            } else {
                templateCells += `
                    <span class="grid-cell grid-cell-gb grid-cell-disable">${this.cells[i].date.date()}</span>
                `;
            }
        }

        this.monthName.innerHTML = this.months[this.getMonth() - 1]
        this.gridBody.innerHTML = templateCells;
    }
}

// Clase para el calendario mensual - PREVIEW
class Month {
    constructor(id, year) {
        this.cells = []
        this.year = year
        this.months = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        this.miniCalendar = document.getElementById(id)
        this.showTemplate()
        this.generateDates()
        this.gridBody = this.miniCalendar.querySelector('.grid-body-month');
        this.monthName = this.miniCalendar.querySelector('.month-name');
        this.showCells()
    }

    // Obtener el mes actual
    getMonth() {
        let month = this.miniCalendar.getAttribute('month')
        return month;
    }

    // Mostrar la tabla del calendario
    showTemplate() {
        this.miniCalendar.innerHTML = this.getTemplate();
        this.addEventListenerToControls()
    }

    // Generar la tabla donde va a estar el calendario
    getTemplate() {
        let template = `
        <i class="feather icon-x back-calendar" month="${this.getMonth()}" year="${this.year}" style="color: #008385; font-size: 30px; margin-right:33px; float:right;"></i>
        <div class="calendar-header" style="margin-bottom: 40px; margin-top: 10px; width: 14%;">
            <i class="feather icon-arrow-left-circle control subtract-month" style="font-size: 20px; color:#008385; margin-top: 6%;"></i><span class="month-name" style="font-size: 24px;"></span> <i class="feather icon-arrow-right-circle control add-month" style="font-size: 20px; color:#008385; margin-top: 6%;"></i>
        </div>
        <div class="calendar-body" style="400px;">
            <div class="grid-main" month="${this.getMonth()}">
                <div class="grid-header" style="margin-bottom: 10px;">
                    <span class="grid-cell-gh">Lunes</span>
                    <span class="grid-cell-gh">Martes</span>
                    <span class="grid-cell-gh">Miércoles</span>
                    <span class="grid-cell-gh">Jueves</span>
                    <span class="grid-cell-gh">Viernes</span>
                    <span class="grid-cell-gh">Sábado</span>
                    <span class="grid-cell-gh">Domingo</span>
                </div>
                <div class="grid-body-month" style="grid-auto-rows: 125px !important;">
                    
                </div>
                    </span>
                </div>
            </div>
        </div>
        `
        return template;
    }

    // Generar los días que van a ir en el grid
    generateDates() {
        let month = this.getMonth();
        let cells = []

        if (month < 10) {
            month = '0' + month
        }

        let date = moment(this.year + '-' + month)

        let dateStart = moment(date).startOf('month')
        let dateEnd = moment(date).endOf('month')

        while (dateStart.isoWeekday() !== 1) {
            dateStart.subtract(1, 'days');
        }

        while (dateEnd.isoWeekday() !== 7) {
            dateEnd.add(1, 'days');
        }

        do {
            cells.push({
                date: moment(dateStart),
                isInCurrentMonth: dateStart.month() === date.month()
            })
            dateStart.add(1, 'days');
        } while (dateStart.isSameOrBefore(dateEnd));

        return cells;
    }

    // Llamar al evento de los botones
    addEventListenerToControls() {
        let controls = this.miniCalendar.querySelectorAll('.control')
        controls.forEach(control => {
            control.addEventListener('click', e => {
                let target = e.target;
                if (target.classList.contains('subtract-month')) {
                    selected_month--;

                    if (selected_month == 0) {
                        $('.subtract-year').click()
                        selected_month = 12
                        selected_year--
                    }
                    $('.more-info[month="' + selected_month + '"][year="' + selected_year + '"]').click();

                } else if (target.classList.contains('add-month')) {
                    selected_month++;

                    if (selected_month == 13) {
                        $('.add-year').click()
                        selected_month = 1
                        selected_year++;
                    }
                    $('.more-info[month="' + selected_month + '"][year="' + selected_year + '"]').click();

                }
                this.showCells()
            })
        })
    }

    // Meter días en el grid del calendario
    showCells() {
        this.getMonth()
        this.cells = this.generateDates()

        this.gridBody.innerHTML = '';
        let templateCells = '';

        let month = this.getMonth()
        if (month < 10) {
            month = '0' + month
        }

        for (let i = 0; i < this.cells.length; i++) {
            let day = this.cells[i].date.date()
            if (day < 10) {
                day = '0' + day
            }

            if (this.cells[i].isInCurrentMonth) {
                templateCells += `
                    <div class="grid-cell-gb-month okm" date="${this.year}-${month}-${day}" day="` + day + `" user="" dept="" data-toggle="modal" data-target="#">${this.cells[i].date.date()}
                        <div style="height: 15%;" class="abs-user" date="${this.year}-${month}-${day}" position="1"></div>
                        <div style="height: 15%;" class="abs-user" date="${this.year}-${month}-${day}" position="2"></div>
                        <div style="height: 15%;" class="abs-user" date="${this.year}-${month}-${day}" position="3"></div>
                        <div style="height: 15%;" class="abs-user" date="${this.year}-${month}-${day}" position="4"></div>
                        <div style="height: 15%;" class="abs-user" date="${this.year}-${month}-${day}" position="5"></div>
                    </div>
                `;
            } else {
                templateCells += `
                    <div class="grid-cell-gb-month grid-cell-disable">${this.cells[i].date.date()}</div>
                `;
            }
        }

        this.monthName.innerHTML = this.months[this.getMonth() - 1]
        this.gridBody.innerHTML = templateCells;
    }
}

// Función que valide que un campo no este vacío. Los campos de Título y descripción(task) no pueden estar vacíos.
function validateEmpty(string) {
    if (string != '') {
        return true;
    }
    return false;
}

//// Datatables
// Deshabilitar los warning de DataTables
$.fn.dataTable.ext.errMode = 'none';

//Datatables en Español
t = $('#vacations-table').DataTable({
    'order': [[5, 'desc']],
    "language": {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ registros",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla",
        "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    }
});

$('#vacations-table').parent().css('overflow', 'auto')
$('.table-responsive').css('overflow-x', 'hidden')

// OLDD
// Que a la hora de abrir el modal del calendario se vea siempre el calendario anual.
$(document).on('click', '.preview', function () {
    $('.month-preview').hide()
    $(".calendar-row").each(function () {
        $(this).show()
    })
})

// Barra de búsqueda de usuarios MIRARR
$('.user-search').keyup(function () {
    let search = $(this).val()
    let count = 0;
    $(".info-user-text").each(function () {
        if ($(this).text().search(new RegExp(search, "i")) < 0) {
            let item = $(this).closest('.user-item')
            item.fadeOut();
        } else {
            let item = $(this).closest('.user-item')
            item.show();
            count++;
        }
    });
});

// // Barra de búsqueda de departamentos MIRARR
$('.dept-search').keyup(function () {
    let search = $(this).val()
    let count = 0;
    $(".info-dept-text").each(function () {
        if ($(this).text().search(new RegExp(search, "i")) < 0) {
            $(this).fadeOut();
        } else {
            $(this).show();
            count++;
        }
    });
});

// Mostrar usuarios ANUAL
function showUsers(user_id) {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/show-vacations/',
        data: {
            user_id: user_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_user'
        },
        success: function (respuesta) {
            let vacations = JSON.parse(respuesta);
            for (let v = 0; v < vacations.length; v++) {
                if (vacations[v]['fields'].deleted == false) {
                    let start = vacations[v]['fields'].start
                    let finish = vacations[v]['fields'].finish
                    let start_radius = vacations[v]['fields'].start
                    let finish_radius = vacations[v]['fields'].finish
                    $(".grid-cell-gb.ok").each(function () {
                        if (($(this).attr('date') == start) || ($(this).attr('date') == finish)) {

                            // Formatos y recorrido de fechas
                            if ($(this).attr('date') == start_radius) {
                                $(this).css('border-top-left-radius', '5px')
                                $(this).css('border-bottom-left-radius', '5px')
                                if (start_radius == finish_radius) {
                                    $(this).css('border-top-right-radius', '5px')
                                    $(this).css('border-bottom-right-radius', '5px')
                                }
                            } else if ($(this).attr('date') == finish_radius) {
                                $(this).css('border-top-right-radius', '5px')
                                $(this).css('border-bottom-right-radius', '5px')
                            }

                            let m_start = moment(start)
                            let m_finish = moment(finish)
                            m_start.add(1, 'days');

                            if (m_start < m_finish) {
                                let start_d = m_start.date()
                                if (start_d < 10) {
                                    start_d = '0' + start_d
                                }

                                let start_m = m_start.month() + 1
                                if (start_m < 10) {
                                    start_m = '0' + start_m
                                }

                                let start_y = m_start.year()

                                start = start_y + '-' + start_m + '-' + start_d
                            }

                            // Coloreamos en el calendario en función de los usuarios
                            let users = $(this).attr('user')
                            let states = $(this).attr('absence')
                            let types = $(this).attr('type')
                            let quantity = users.split(',')

                            if (users == '') {
                                users = user_id
                                states = vacations[v]['fields'].state
                                types = vacations[v]['fields'].absence_type
                                $(this).attr('user', users)
                                $(this).attr('absence', states)
                                $(this).attr('type', types)
                                $(this).attr('dept', vacations[v]['fields'].departament)

                                if (vacations[v]['fields'].absence_type == 1) {
                                    if (vacations[v]['fields'].state == 1) {
                                        $(this).addClass('showing-accepted')
                                        $(this).css('background-color', '#B4E6A1')
                                    } else if (vacations[v]['fields'].state == 0) {
                                        $(this).addClass('showing-pending')
                                        $(this).css('background-color', '#FFB852')
                                    }
                                } else if (vacations[v]['fields'].absence_type == 6) {
                                    $(this).addClass('showing-lastyear')
                                    $(this).css('background-color', '#e69ae3')
                                } else {
                                    $(this).addClass('showing-other')
                                    $(this).css('background-color', '#9e9e9e')
                                }
                            } else if (quantity.length >= 1) {
                                users = users + ',' + user_id
                                $(this).attr('user', users)
                                states = states + ',' + vacations[v]['fields'].state
                                $(this).attr('absence', states)
                                types = types + ',' + vacations[v]['fields'].absence_type
                                $(this).attr('type', types)

                                let state = vacations[v]['fields'].state
                                if (vacations[v]['fields'].absence_type == 1) {
                                    if (state == 1) {
                                        if ($(this).hasClass('showing-accepted')) {
                                            $(this).css('background-color', '#FF5858')
                                        } else {
                                            $(this).addClass('showing-accepted')
                                            $(this).css('background-color', '#FF5858')
                                        }
                                    } else if (state == 0) {
                                        if ($(this).hasClass('showing-pending')) {
                                            $(this).css('background-color', '#FF5858')
                                        } else {
                                            $(this).addClass('showing-pending')
                                            $(this).css('background-color', '#FF5858')
                                        }
                                    }
                                } else if (vacations[v]['fields'].absence_type == 6) {
                                    if ($(this).hasClass('showing-lastyear')) {
                                        $(this).css('background-color', '#FF5858')
                                    } else {
                                        $(this).addClass('showing-lastyear')
                                        $(this).css('background-color', '#FF5858')
                                    }
                                } else {
                                    if ($(this).hasClass('showing-other')) {
                                        $(this).css('background-color', '#FF5858')
                                    } else {
                                        $(this).addClass('showing-other')
                                        $(this).css('background-color', '#FF5858')
                                    }
                                }
                            }
                        }
                    })
                }
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}
// Mostrar usuarios MENSUAL
function showUsersMonth(user_id) {
    // Llamada AJAX
    if (user_id != '') {
        $.ajax({
            type: 'POST',
            url: '/vacations-management/',
            data: {
                user_id: user_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'show_user_month'
            },
            success: function (respuesta) {
                let data = JSON.parse(respuesta);
                for (let j = 0; j < data.length; j++) {
                    let start = moment(data[j].start)
                    let finish = moment(data[j].finish)
                    let start_radius = start.format('YYYY-MM-DD')
                    let finish_radius = finish.format('YYYY-MM-DD')
                    let user_name = data[j].first_name.toUpperCase() + ' ' + data[j].last_name.toUpperCase()
                    let diff = finish.diff(start, 'days')
                    for (let pos = 1; pos < 6; pos++) {
                        let days = []
                        let count = -1
                        let m_start = start
                        while (finish.diff(m_start, 'days') >= 0) {
                            let cell = $('.okm[date=' + m_start.format('YYYY-MM-DD') + ']')
                            let childDiv = cell.children('.abs-user[position=' + pos + ']')
                            if (childDiv.html() == '' || childDiv.html() == null) {
                                count++
                                days.push(childDiv)
                                m_start.add(1, 'days')
                            } else {
                                break
                            }
                            for (let k = 0; k < days.length; k++) {
                                if (diff >= count) {
                                    if (data[j].absence_type == 1) {
                                        days[k].html(user_name)
                                        if (data[j].state == 1) {
                                            days[k].addClass('showing-accepted')
                                            days[k].removeClass('showing-other')
                                            days[k].removeClass('showing-pending')
                                            days[k].removeClass('showing-lastyear')
                                            days[k].css('background-color', '#B4E6A1')
                                            days[k].css('font-weight', 'bold')
                                            days[k].css('text-align', 'center')
                                        } else {
                                            days[k].addClass('showing-pending')
                                            days[k].removeClass('showing-accepted')
                                            days[k].removeClass('showing-other')
                                            days[k].removeClass('showing-lastyear')
                                            days[k].css('background-color', '#FFB852')
                                            days[k].css('font-weight', 'bold')
                                            days[k].css('text-align', 'center')
                                        }
                                    } else if (data[j].absence_type == 6) {
                                        if (data[j].state == 1) {
                                            days[k].html(user_name)
                                            days[k].css('background-color', '#e69ae3')
                                            days[k].css('font-weight', 'bold')
                                            days[k].css('text-align', 'center')
                                            days[k].addClass('showing-lastyear')
                                            days[k].removeClass('showing-other')
                                            days[k].removeClass('showing-pending')
                                            days[k].removeClass('showing-accepted')
                                        } else {
                                            days[k].addClass('showing-pending')
                                            days[k].removeClass('showing-accepted')
                                            days[k].removeClass('showing-other')
                                            days[k].removeClass('showing-lastyear')
                                            days[k].css('background-color', '#FFB852')
                                            days[k].css('font-weight', 'bold')
                                            days[k].css('text-align', 'center')
                                        }
                                    } else {
                                        days[k].html(user_name)
                                        days[k].css('background-color', '#9e9e9e')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                        days[k].addClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-lastyear')
                                    }
                                    if ((days[k].attr('date') == data[j].start) || (days[k].attr('date') == data[j].finish)) {
                                        // Formatos y recorrido de fechas
                                        if (days[k].attr('date') == start_radius) {
                                            days[k].css('border-top-left-radius', '5px')
                                            days[k].css('border-bottom-left-radius', '5px')
                                            days[k].css('margin-left', '5px')
                                            if (start_radius == finish_radius) {
                                                days[k].css('border-top-right-radius', '5px')
                                                days[k].css('border-bottom-right-radius', '5px')
                                                days[k].css('margin-right', '5px')
                                            }
                                        } else if (days[k].attr('date') == finish_radius) {
                                            days[k].css('border-top-right-radius', '5px')
                                            days[k].css('border-bottom-right-radius', '5px')
                                            days[k].css('margin-right', '5px')
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
                festivos()
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }
}

// Mostrar departamento ANUAL
function showDept(departament_id) {
    $(".grid-cell-gb.ok").each(function () {
        $(this).css('background-color', '#f7f7f7')
        $(this).attr('user', '')
        $(this).attr('dept', '')
        $(this).attr('absence', '')
        $(this).removeClass('showing-accepted')
        $(this).removeClass('showing-pending')
        $(this).removeClass('showing-repeated')
        $(this).removeClass('ko')
    })
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/show-vacations/',
        data: {
            departament_id: departament_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_dept'
        },
        success: function (respuesta) {
            let vacations = JSON.parse(respuesta);
            for (let v = 0; v < vacations.length; v++) {
                let start = vacations[v]['fields'].start
                let finish = vacations[v]['fields'].finish
                let start_radius = vacations[v]['fields'].start
                let finish_radius = vacations[v]['fields'].finish
                $(".grid-cell-gb.ok").each(function () {
                    if (($(this).attr('date') == start) || ($(this).attr('date') == finish)) {

                        // Formatos y recorrido de fechas
                        if ($(this).attr('date') == start_radius) {
                            $(this).css('border-top-left-radius', '5px')
                            $(this).css('border-bottom-left-radius', '5px')
                            if (start_radius == finish_radius) {
                                $(this).css('border-top-right-radius', '5px')
                                $(this).css('border-bottom-right-radius', '5px')
                            }
                        } else if ($(this).attr('date') == finish_radius) {
                            $(this).css('border-top-right-radius', '5px')
                            $(this).css('border-bottom-right-radius', '5px')
                        }

                        let m_start = moment(start)
                        let m_finish = moment(finish)
                        m_start.add(1, 'days');

                        if (m_start < m_finish) {
                            let start_d = m_start.date()
                            if (start_d < 10) {
                                start_d = '0' + start_d
                            }

                            let start_m = m_start.month() + 1
                            if (start_m < 10) {
                                start_m = '0' + start_m
                            }

                            let start_y = m_start.year()

                            start = start_y + '-' + start_m + '-' + start_d
                        }

                        // Coloreamos en el calendario en función de los usuarios
                        let users = $(this).attr('user')
                        let states = $(this).attr('absence')
                        let types = $(this).attr('type')
                        let quantity = users.split(',')

                        if (users == '') {
                            users = vacations[v]['fields'].user
                            states = vacations[v]['fields'].state
                            types = vacations[v]['fields'].absence_type
                            $(this).attr('user', users)
                            $(this).attr('absence', states)
                            $(this).attr('type', types)
                            $(this).attr('dept', vacations[v]['fields'].departament)

                            if (vacations[v]['fields'].state == 1) {
                                $(this).addClass('showing-accepted')
                                $(this).css('background-color', '#B4E6A1')
                            } else if (vacations[v]['fields'].state == 0) {
                                $(this).addClass('showing-pending')
                                $(this).css('background-color', '#FFB852')
                            }
                        } else if (quantity.length >= 1) {
                            users = users + ',' + vacations[v]['fields'].user
                            $(this).attr('user', users)
                            states = states + ',' + vacations[v]['fields'].state
                            $(this).attr('absence', states)
                            types = types + ',' + vacations[v]['fields'].absence_type
                            $(this).attr('type', types)

                            let state = vacations[v]['fields'].state
                            if (state == 1) {
                                if ($(this).hasClass('showing-accepted')) {
                                    $(this).css('background-color', '#FF5858')
                                } else {
                                    $(this).addClass('showing-accepted')
                                    $(this).css('background-color', '#FF5858')
                                }
                            } else if (state == 0) {
                                if ($(this).hasClass('showing-pending')) {
                                    $(this).css('background-color', '#FF5858')
                                } else {
                                    $(this).addClass('showing-pending')
                                    $(this).css('background-color', '#FF5858')
                                }
                            }
                        }
                    }
                })
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}
// Mostrar departamento MENSUAL
function showDeptMonth(dept_id) {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/vacations-management/',
        data: {
            dept_id: dept_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_dept_month'
        },
        success: function (respuesta) {
            let data = JSON.parse(respuesta);
            for (let j = 0; j < data.length; j++) {
                let start = moment(data[j].start)
                let finish = moment(data[j].finish)
                let start_radius = start.format('YYYY-MM-DD')
                let finish_radius = finish.format('YYYY-MM-DD')
                let user_name = data[j].first_name.toUpperCase() + ' ' + data[j].last_name.toUpperCase()
                let diff = finish.diff(start, 'days')
                for (let pos = 1; pos < 6; pos++) {
                    let days = []
                    let count = -1
                    let m_start = start
                    while (finish.diff(m_start, 'days') >= 0) {
                        let cell = $('.okm[date=' + m_start.format('YYYY-MM-DD') + ']')
                        let childDiv = cell.children('.abs-user[position=' + pos + ']')
                        if (childDiv.html() == '' || childDiv.html() == null) {
                            count++
                            days.push(childDiv)
                            m_start.add(1, 'days')
                        } else {
                            break
                        }
                        for (let k = 0; k < days.length; k++) {
                            if (diff >= count) {
                                if (data[j].absence_type == 1) {
                                    days[k].html(user_name)
                                    if (data[j].state == 1) {
                                        days[k].addClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#B4E6A1')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    } else {
                                        days[k].addClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#FFB852')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    }
                                } else if (data[j].absence_type == 6) {
                                    if (data[j].state == 1) {
                                        days[k].html(user_name)
                                        days[k].css('background-color', '#e69ae3')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                        days[k].addClass('showing-lastyear')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                    } else {
                                        days[k].addClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#FFB852')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    }
                                } else {
                                    days[k].html(user_name)
                                    days[k].css('background-color', '#9e9e9e')
                                    days[k].css('font-weight', 'bold')
                                    days[k].css('text-align', 'center')
                                    days[k].addClass('showing-other')
                                    days[k].removeClass('showing-pending')
                                    days[k].removeClass('showing-accepted')
                                    days[k].removeClass('showing-lastyear')
                                }
                                if ((days[k].attr('date') == data[j].start) || (days[k].attr('date') == data[j].finish)) {
                                    // Formatos y recorrido de fechas
                                    if (days[k].attr('date') == start_radius) {
                                        days[k].css('border-top-left-radius', '5px')
                                        days[k].css('border-bottom-left-radius', '5px')
                                        days[k].css('margin-left', '5px')
                                        if (start_radius == finish_radius) {
                                            days[k].css('border-top-right-radius', '5px')
                                            days[k].css('border-bottom-right-radius', '5px')
                                            days[k].css('margin-right', '5px')
                                        }
                                    } else if (days[k].attr('date') == finish_radius) {
                                        days[k].css('border-top-right-radius', '5px')
                                        days[k].css('border-bottom-right-radius', '5px')
                                        days[k].css('margin-right', '5px')
                                    }
                                }
                            }

                        }
                    }
                }
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

// Mostrar aceptadas ANUAL
function showAccepted(departament_id) {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/show-vacations/',
        data: {
            departament_id: departament_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_accepted'
        },
        success: function (respuesta) {
            let vacations = JSON.parse(respuesta);
            for (let v = 0; v < vacations.length; v++) {
                if (vacations[v]['fields'].deleted == false) {
                    let start = vacations[v]['fields'].start
                    let finish = vacations[v]['fields'].finish
                    let start_radius = vacations[v]['fields'].start
                    let finish_radius = vacations[v]['fields'].finish

                    $(".grid-cell-gb.ok").each(function () {
                        if (($(this).attr('date') == start) || ($(this).attr('date') == finish)) {

                            // Formatos y recorrido de fechas
                            if ($(this).attr('date') == start_radius) {
                                $(this).css('border-top-left-radius', '5px')
                                $(this).css('border-bottom-left-radius', '5px')
                                if (start_radius == finish_radius) {
                                    $(this).css('border-top-right-radius', '5px')
                                    $(this).css('border-bottom-right-radius', '5px')
                                }
                            } else if ($(this).attr('date') == finish_radius) {
                                $(this).css('border-top-right-radius', '5px')
                                $(this).css('border-bottom-right-radius', '5px')
                            } else {
                                $(this).css('border-top-left-radius', '')
                                $(this).css('border-top-right-radius', '')
                                $(this).css('border-bottom-left-radius', '')
                                $(this).css('border-bottom-right-radius', '')
                            }

                            let m_start = moment(start)
                            let m_finish = moment(finish)
                            m_start.add(1, 'days');

                            if (m_start < m_finish) {
                                let start_d = m_start.date()
                                if (start_d < 10) {
                                    start_d = '0' + start_d
                                }

                                let start_m = m_start.month() + 1
                                if (start_m < 10) {
                                    start_m = '0' + start_m
                                }

                                let start_y = m_start.year()

                                start = start_y + '-' + start_m + '-' + start_d
                            }

                            // Coloreamos en el calendario en función de los usuarios
                            let users = $(this).attr('user')
                            let states = $(this).attr('absence')
                            let quantity = users.split(',')
                            let types = $(this).attr('type')

                            if (users == '') {
                                users = vacations[v]['fields'].user
                                states = vacations[v]['fields'].state
                                types = vacations[v]['fields'].absence_type
                                $(this).attr('user', users)
                                $(this).attr('absence', states)
                                $(this).attr('type', types)
                                $(this).css('background-color', '#B4E6A1')
                                $(this).addClass('showing-accepted')
                                $(this).attr('dept', departament_id)

                            } else if (quantity.length == 1) {
                                users = users + ',' + vacations[v]['fields'].user
                                $(this).attr('user', users)
                                states = states + ',' + vacations[v]['fields'].state
                                $(this).attr('absence', states)
                                types = types + ',' + vacations[v]['fields'].absence_type
                                $(this).attr('type', types)

                                if ($(this).hasClass('showing-accepted')) {
                                    $(this).css('background-color', '#ff5858')
                                } else if ($(this).hasClass('showing-pending')) {
                                    $(this).css('background-color', '#ff5858')
                                    $(this).addClass('showing-accepted')
                                } else if ($(this).hasClass('showing-other')) {
                                    $(this).css('background-color', '#ff5858')
                                    $(this).addClass('showing-accepted')
                                } else if ($(this).hasClass('showing-lastyear')) {
                                    $(this).css('background-color', '#ff5858')
                                    $(this).addClass('showing-accepted')
                                }

                            } else if (quantity.length >= 2) {
                                let result = users.split(',')
                                let contador = 0
                                for (let r = 0; r < result.length; r++) {
                                    if (result[r] == vacations[v]['fields'].user) {
                                        contador++
                                    }
                                }

                                if (contador == 0) {
                                    users = users + ',' + vacations[v]['fields'].user
                                    $(this).attr('user', users)
                                    states = states + ',' + vacations[v]['fields'].state
                                    $(this).attr('absence', states)
                                    types = types + ',' + vacations[v]['fields'].absence_type
                                    $(this).attr('type', types)
                                }

                                if ($(this).hasClass('showing-accepted')) {

                                } else {
                                    $(this).addClass('showing-accepted')
                                }
                            }
                        }
                    })
                }
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}
// Mostrar aceptadas Mensual
function showAcceptedMonth(dept_id) {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/show-vacations/',
        data: {
            dept_id: dept_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_accepted_month'
        },
        success: function (respuesta) {
            let data = JSON.parse(respuesta);
            for (let j = 0; j < data.length; j++) {
                let start = moment(data[j].start)
                let finish = moment(data[j].finish)
                let start_radius = start.format('YYYY-MM-DD')
                let finish_radius = finish.format('YYYY-MM-DD')
                let user_name = data[j].first_name.toUpperCase() + ' ' + data[j].last_name.toUpperCase()
                let diff = finish.diff(start, 'days')
                for (let pos = 1; pos < 6; pos++) {
                    let days = []
                    let count = -1
                    let m_start = start
                    while (finish.diff(m_start, 'days') >= 0) {
                        let cell = $('.okm[date=' + m_start.format('YYYY-MM-DD') + ']')
                        let childDiv = cell.children('.abs-user[position=' + pos + ']')
                        if (childDiv.html() == '' || childDiv.html() == null) {
                            count++
                            days.push(childDiv)
                            m_start.add(1, 'days')
                        } else {
                            break
                        }
                        for (let k = 0; k < days.length; k++) {
                            if (diff >= count) {
                                if (data[j].absence_type == 1) {
                                    days[k].html(user_name)
                                    if (data[j].state == 1) {
                                        days[k].addClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#B4E6A1')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    } else {
                                        days[k].addClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#FFB852')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    }
                                } else if (data[j].absence_type == 6) {
                                    if (data[j].state == 1) {
                                        days[k].html(user_name)
                                        days[k].css('background-color', '#e69ae3')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                        days[k].addClass('showing-lastyear')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                    } else {
                                        days[k].addClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#FFB852')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    }
                                } else {
                                    days[k].html(user_name)
                                    days[k].css('background-color', '#9e9e9e')
                                    days[k].css('font-weight', 'bold')
                                    days[k].css('text-align', 'center')
                                    days[k].addClass('showing-other')
                                    days[k].removeClass('showing-pending')
                                    days[k].removeClass('showing-accepted')
                                    days[k].removeClass('showing-lastyear')
                                }
                                if ((days[k].attr('date') == data[j].start) || (days[k].attr('date') == data[j].finish)) {
                                    // Formatos y recorrido de fechas
                                    if (days[k].attr('date') == start_radius) {
                                        days[k].css('border-top-left-radius', '5px')
                                        days[k].css('border-bottom-left-radius', '5px')
                                        days[k].css('margin-left', '5px')
                                        if (start_radius == finish_radius) {
                                            days[k].css('border-top-right-radius', '5px')
                                            days[k].css('border-bottom-right-radius', '5px')
                                            days[k].css('margin-right', '5px')
                                        }
                                    } else if (days[k].attr('date') == finish_radius) {
                                        days[k].css('border-top-right-radius', '5px')
                                        days[k].css('border-bottom-right-radius', '5px')
                                        days[k].css('margin-right', '5px')
                                    }
                                }
                            }

                        }
                    }
                }
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

// Mostrar enfermedades ANUAL
function showOther(departament_id) {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/show-vacations/',
        data: {
            departament_id: departament_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_other'
        },
        success: function (respuesta) {
            let vacations = JSON.parse(respuesta);
            for (let v = 0; v < vacations.length; v++) {
                if (vacations[v]['fields'].deleted == 0) {
                    let start = vacations[v]['fields'].start
                    let finish = vacations[v]['fields'].finish
                    let start_radius = vacations[v]['fields'].start
                    let finish_radius = vacations[v]['fields'].finish

                    $(".grid-cell-gb.ok").each(function () {
                        if (($(this).attr('date') == start) || ($(this).attr('date') == finish)) {

                            // Formatos y recorrido de fechas
                            if ($(this).attr('date') == start_radius) {
                                $(this).css('border-top-left-radius', '5px')
                                $(this).css('border-bottom-left-radius', '5px')
                                if (start_radius == finish_radius) {
                                    $(this).css('border-top-right-radius', '5px')
                                    $(this).css('border-bottom-right-radius', '5px')
                                }
                            } else if ($(this).attr('date') == finish_radius) {
                                $(this).css('border-top-right-radius', '5px')
                                $(this).css('border-bottom-right-radius', '5px')
                            } else {
                                $(this).css('border-top-left-radius', '')
                                $(this).css('border-top-right-radius', '')
                                $(this).css('border-bottom-left-radius', '')
                                $(this).css('border-bottom-right-radius', '')
                            }

                            let m_start = moment(start)
                            let m_finish = moment(finish)
                            m_start.add(1, 'days');

                            if (m_start < m_finish) {
                                let start_d = m_start.date()
                                if (start_d < 10) {
                                    start_d = '0' + start_d
                                }

                                let start_m = m_start.month() + 1
                                if (start_m < 10) {
                                    start_m = '0' + start_m
                                }

                                let start_y = m_start.year()

                                start = start_y + '-' + start_m + '-' + start_d
                            }

                            // Coloreamos en el calendario en función de los usuarios
                            let users = $(this).attr('user')
                            let states = $(this).attr('absence')
                            let types = $(this).attr('type')
                            let quantity = users.split(',')

                            if (users == '') {
                                users = vacations[v]['fields'].user
                                states = vacations[v]['fields'].state
                                types = vacations[v]['fields'].absence_type
                                $(this).attr('user', users)
                                $(this).attr('absence', states)
                                $(this).attr('type', types)
                                $(this).css('background-color', '#9e9e9e')
                                $(this).addClass('showing-other')
                                $(this).attr('dept', departament_id)

                            } else if (quantity.length == 1) {
                                users = users + ',' + vacations[v]['fields'].user
                                $(this).attr('user', users)
                                states = states + ',' + vacations[v]['fields'].state
                                $(this).attr('absence', states)
                                types = types + ',' + vacations[v]['fields'].absence_type
                                $(this).attr('type', types)

                                if ($(this).hasClass('showing-other')) {
                                    $(this).css('background-color', '#ff5858')
                                } else if ($(this).hasClass('showing-pending')) {
                                    $(this).css('background-color', '#ff5858')
                                    $(this).addClass('showing-other')
                                } else if ($(this).hasClass('showing-accepted')) {
                                    $(this).css('background-color', '#ff5858')
                                    $(this).addClass('showing-other')
                                } else if ($(this).hasClass('showing-lastyear')) {
                                    $(this).css('background-color', '#ff5858')
                                    $(this).addClass('showing-other')
                                }

                            } else if (quantity.length >= 2) {
                                let result = users.split(',')
                                let contador = 0
                                for (let r = 0; r < result.length; r++) {
                                    if (result[r] == vacations[v]['fields'].user) {
                                        contador++
                                    }
                                }

                                if (contador == 0) {
                                    users = users + ',' + vacations[v]['fields'].user
                                    $(this).attr('user', users)
                                    states = states + ',' + vacations[v]['fields'].state
                                    $(this).attr('absence', states)
                                    types = types + ',' + vacations[v]['fields'].absence_type
                                    $(this).attr('type', types)
                                }

                                if ($(this).hasClass('showing-other')) {

                                } else {
                                    $(this).addClass('showing-other')
                                }
                            }
                        }
                    })
                }
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}
// Mostrar enfermedades MENUSAL
function showOtherMonth(dept_id) {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/show-vacations/',
        data: {
            dept_id: dept_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_other_month'
        },
        success: function (respuesta) {
            let data = JSON.parse(respuesta);
            for (let j = 0; j < data.length; j++) {
                let start = moment(data[j].start)
                let finish = moment(data[j].finish)
                let start_radius = start.format('YYYY-MM-DD')
                let finish_radius = finish.format('YYYY-MM-DD')
                let user_name = data[j].first_name.toUpperCase() + ' ' + data[j].last_name.toUpperCase()
                let diff = finish.diff(start, 'days')
                for (let pos = 1; pos < 6; pos++) {
                    let days = []
                    let count = -1
                    let m_start = start
                    while (finish.diff(m_start, 'days') >= 0) {
                        let cell = $('.okm[date=' + m_start.format('YYYY-MM-DD') + ']')
                        let childDiv = cell.children('.abs-user[position=' + pos + ']')
                        if (childDiv.html() == '' || childDiv.html() == null) {
                            count++
                            days.push(childDiv)
                            m_start.add(1, 'days')
                        } else {
                            break
                        }
                        for (let k = 0; k < days.length; k++) {
                            if (diff >= count) {
                                if (data[j].absence_type == 1) {
                                    days[k].html(user_name)
                                    if (data[j].state == 1) {
                                        days[k].addClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#B4E6A1')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    } else {
                                        days[k].addClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#FFB852')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    }
                                } else if (data[j].absence_type == 6) {
                                    if (data[j].state == 1) {
                                        days[k].html(user_name)
                                        days[k].css('background-color', '#e69ae3')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                        days[k].addClass('showing-lastyear')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                    } else {
                                        days[k].addClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#FFB852')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    }
                                } else {
                                    days[k].html(user_name)
                                    days[k].css('background-color', '#9e9e9e')
                                    days[k].css('font-weight', 'bold')
                                    days[k].css('text-align', 'center')
                                    days[k].addClass('showing-other')
                                    days[k].removeClass('showing-pending')
                                    days[k].removeClass('showing-accepted')
                                    days[k].removeClass('showing-lastyear')
                                }
                                if ((days[k].attr('date') == data[j].start) || (days[k].attr('date') == data[j].finish)) {
                                    // Formatos y recorrido de fechas
                                    if (days[k].attr('date') == start_radius) {
                                        days[k].css('border-top-left-radius', '5px')
                                        days[k].css('border-bottom-left-radius', '5px')
                                        days[k].css('margin-left', '5px')
                                        if (start_radius == finish_radius) {
                                            days[k].css('border-top-right-radius', '5px')
                                            days[k].css('border-bottom-right-radius', '5px')
                                            days[k].css('margin-right', '5px')
                                        }
                                    } else if (days[k].attr('date') == finish_radius) {
                                        days[k].css('border-top-right-radius', '5px')
                                        days[k].css('border-bottom-right-radius', '5px')
                                        days[k].css('margin-right', '5px')
                                    }
                                }
                            }

                        }
                    }
                }
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

// Mostrar pendientes ANUAL
function showPending(departament_id) {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/show-vacations/',
        data: {
            departament_id: departament_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_pending'
        },
        success: function (respuesta) {
            let vacations = JSON.parse(respuesta);
            for (let v = 0; v < vacations.length; v++) {
                if (vacations[v]['fields'].deleted == false) {
                    let start = vacations[v]['fields'].start
                    let finish = vacations[v]['fields'].finish
                    let start_radius = vacations[v]['fields'].start
                    let finish_radius = vacations[v]['fields'].finish

                    $(".grid-cell-gb.ok").each(function () {
                        if (($(this).attr('date') == start) || ($(this).attr('date') == finish)) {

                            // Formato y recorrido de fechas
                            if ($(this).attr('date') == start_radius) {
                                $(this).css('border-top-left-radius', '5px')
                                $(this).css('border-bottom-left-radius', '5px')
                                if (start_radius == finish_radius) {
                                    $(this).css('border-top-right-radius', '5px')
                                    $(this).css('border-bottom-right-radius', '5px')
                                }
                            } else if ($(this).attr('date') == finish_radius) {
                                $(this).css('border-top-right-radius', '5px')
                                $(this).css('border-bottom-right-radius', '5px')
                            } else {
                                $(this).css('border-top-left-radius', '')
                                $(this).css('border-top-right-radius', '')
                                $(this).css('border-bottom-left-radius', '')
                                $(this).css('border-bottom-right-radius', '')
                            }

                            let m_start = moment(start)
                            let m_finish = moment(finish)
                            m_start.add(1, 'days');

                            if (m_start < m_finish) {
                                let start_d = m_start.date()
                                if (start_d < 10) {
                                    start_d = '0' + start_d
                                }

                                let start_m = m_start.month() + 1
                                if (start_m < 10) {
                                    start_m = '0' + start_m
                                }

                                let start_y = m_start.year()

                                start = start_y + '-' + start_m + '-' + start_d
                            }

                            // Coloreamos en el calendario en función de los usuarios
                            let users = $(this).attr('user')
                            let states = $(this).attr('absence')
                            let types = $(this).attr('type')
                            let quantity = users.split(',')

                            if (users == '') {
                                users = vacations[v]['fields'].user
                                states = vacations[v]['fields'].state
                                types = vacations[v]['fields'].absence_type
                                $(this).attr('user', users)
                                $(this).attr('absence', states)
                                $(this).attr('type', types)
                                $(this).css('background-color', '#FFB852')
                                $(this).addClass('showing-pending')
                                $(this).attr('dept', departament_id)

                            } else if (quantity.length == 1) {
                                users = users + ',' + vacations[v]['fields'].user
                                $(this).attr('user', users)
                                states = states + ',' + vacations[v]['fields'].state
                                $(this).attr('absence', states)
                                types = types + ',' + vacations[v]['fields'].absence_type
                                $(this).attr('type', types)

                                if ($(this).hasClass('showing-pending')) {
                                    $(this).css('background-color', '#ff5858')
                                } else if ($(this).hasClass('showing-accepted')) {
                                    $(this).css('background-color', '#ff5858')
                                    $(this).addClass('showing-pending')
                                } else if ($(this).hasClass('showing-other')) {
                                    $(this).css('background-color', '#ff5858')
                                    $(this).addClass('showing-pending')
                                } else if ($(this).hasClass('showing-lastyear')) {
                                    $(this).css('background-color', '#ff5858')
                                    $(this).addClass('showing-pending')
                                }

                            } else if (quantity.length >= 2) {
                                let result = users.split(',')
                                let contador = 0
                                for (let r = 0; r < result.length; r++) {
                                    if (result[r] == vacations[v]['fields'].user) {

                                        contador++
                                    }
                                }

                                if (contador == 0) {
                                    users = users + ',' + vacations[v]['fields'].user
                                    $(this).attr('user', users)
                                    states = states + ',' + vacations[v]['fields'].state
                                    $(this).attr('absence', states)
                                    types = types + ',' + vacations[v]['fields'].absence_type
                                    $(this).attr('type', types)
                                }

                                if ($(this).hasClass('showing-pending')) {

                                } else {
                                    $(this).addClass('showing-pending')
                                }
                            }
                        }
                    })
                }
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}
// Mostrar pendientes MENSUAL
function showPendingMonth(dept_id) {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/show-vacations/',
        data: {
            dept_id: dept_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_pending_month'
        },
        success: function (respuesta) {
            let data = JSON.parse(respuesta);
            for (let j = 0; j < data.length; j++) {
                let start = moment(data[j].start)
                let finish = moment(data[j].finish)
                let start_radius = start.format('YYYY-MM-DD')
                let finish_radius = finish.format('YYYY-MM-DD')
                let user_name = data[j].first_name.toUpperCase() + ' ' + data[j].last_name.toUpperCase()
                let diff = finish.diff(start, 'days')
                for (let pos = 1; pos < 6; pos++) {
                    let days = []
                    let count = -1
                    let m_start = start
                    while (finish.diff(m_start, 'days') >= 0) {
                        let cell = $('.okm[date=' + m_start.format('YYYY-MM-DD') + ']')
                        let childDiv = cell.children('.abs-user[position=' + pos + ']')
                        if (childDiv.html() == '' || childDiv.html() == null) {
                            count++
                            days.push(childDiv)
                            m_start.add(1, 'days')
                        } else {
                            break
                        }
                        for (let k = 0; k < days.length; k++) {
                            if (diff >= count) {
                                if (data[j].absence_type == 1) {
                                    days[k].html(user_name)
                                    if (data[j].state == 1) {
                                        days[k].addClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#B4E6A1')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    } else {
                                        days[k].addClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#FFB852')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    }
                                } else if (data[j].absence_type == 6) {
                                    if (data[j].state == 1) {
                                        days[k].html(user_name)
                                        days[k].css('background-color', '#e69ae3')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                        days[k].addClass('showing-lastyear')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                    } else {
                                        days[k].addClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#FFB852')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    }
                                } else {
                                    days[k].html(user_name)
                                    days[k].css('background-color', '#9e9e9e')
                                    days[k].css('font-weight', 'bold')
                                    days[k].css('text-align', 'center')
                                    days[k].addClass('showing-other')
                                    days[k].removeClass('showing-pending')
                                    days[k].removeClass('showing-accepted')
                                    days[k].removeClass('showing-lastyear')
                                }
                                if ((days[k].attr('date') == data[j].start) || (days[k].attr('date') == data[j].finish)) {
                                    // Formatos y recorrido de fechas
                                    if (days[k].attr('date') == start_radius) {
                                        days[k].css('border-top-left-radius', '5px')
                                        days[k].css('border-bottom-left-radius', '5px')
                                        days[k].css('margin-left', '5px')
                                        if (start_radius == finish_radius) {
                                            days[k].css('border-top-right-radius', '5px')
                                            days[k].css('border-bottom-right-radius', '5px')
                                            days[k].css('margin-right', '5px')
                                        }
                                    } else if (days[k].attr('date') == finish_radius) {
                                        days[k].css('border-top-right-radius', '5px')
                                        days[k].css('border-bottom-right-radius', '5px')
                                        days[k].css('margin-right', '5px')
                                    }
                                }
                            }

                        }
                    }
                }
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

// Mostrar atrasadas ANUAL
function showLastyear(departament_id) {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/show-vacations/',
        data: {
            departament_id: departament_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_lastyear'
        },
        success: function (respuesta) {
            let vacations = JSON.parse(respuesta);
            for (let v = 0; v < vacations.length; v++) {
                if (vacations[v]['fields'].deleted == false) {
                    let start = vacations[v]['fields'].start
                    let finish = vacations[v]['fields'].finish
                    let start_radius = vacations[v]['fields'].start
                    let finish_radius = vacations[v]['fields'].finish

                    $(".grid-cell-gb.ok").each(function () {
                        if (($(this).attr('date') == start) || ($(this).attr('date') == finish)) {

                            // Formato y recorrido de fechas
                            if ($(this).attr('date') == start_radius) {
                                $(this).css('border-top-left-radius', '5px')
                                $(this).css('border-bottom-left-radius', '5px')
                                if (start_radius == finish_radius) {
                                    $(this).css('border-top-right-radius', '5px')
                                    $(this).css('border-bottom-right-radius', '5px')
                                }
                            } else if ($(this).attr('date') == finish_radius) {
                                $(this).css('border-top-right-radius', '5px')
                                $(this).css('border-bottom-right-radius', '5px')
                            } else {
                                $(this).css('border-top-left-radius', '')
                                $(this).css('border-top-right-radius', '')
                                $(this).css('border-bottom-left-radius', '')
                                $(this).css('border-bottom-right-radius', '')
                            }

                            let m_start = moment(start)
                            let m_finish = moment(finish)
                            m_start.add(1, 'days');

                            if (m_start < m_finish) {
                                let start_d = m_start.date()
                                if (start_d < 10) {
                                    start_d = '0' + start_d
                                }

                                let start_m = m_start.month() + 1
                                if (start_m < 10) {
                                    start_m = '0' + start_m
                                }

                                let start_y = m_start.year()

                                start = start_y + '-' + start_m + '-' + start_d
                            }

                            // Coloreamos en el calendario en función de los usuarios
                            let users = $(this).attr('user')
                            let states = $(this).attr('absence')
                            let quantity = users.split(',')
                            let types = $(this).attr('type')

                            if (users == '') {
                                users = vacations[v]['fields'].user
                                states = vacations[v]['fields'].state
                                types = vacations[v]['fields'].absence_type
                                $(this).attr('user', users)
                                $(this).attr('absence', states)
                                $(this).attr('type', types)
                                $(this).css('background-color', '#e69ae3')
                                $(this).addClass('showing-lastyear')
                                $(this).attr('dept', departament_id)

                            } else if (quantity.length == 1) {
                                users = users + ',' + vacations[v]['fields'].user
                                $(this).attr('user', users)
                                states = states + ',' + vacations[v]['fields'].state
                                $(this).attr('absence', states)
                                types = types + ',' + vacations[v]['fields'].absence_type
                                $(this).attr('type', types)

                                if ($(this).hasClass('showing-lastyear')) {
                                    $(this).css('background-color', '#ff5858')
                                } else if ($(this).hasClass('showing-accepted')) {
                                    $(this).css('background-color', '#ff5858')
                                    $(this).addClass('showing-lastyear')
                                } else if ($(this).hasClass('showing-other')) {
                                    $(this).css('background-color', '#ff5858')
                                    $(this).addClass('showing-lastyear')
                                } else if ($(this).hasClass('showing-pending')) {
                                    $(this).css('background-color', '#ff5858')
                                    $(this).addClass('showing-lastyear')
                                }

                            } else if (quantity.length >= 2) {
                                let result = users.split(',')
                                let contador = 0
                                for (let r = 0; r < result.length; r++) {
                                    if (result[r] == vacations[v]['fields'].user) {
                                        contador++
                                    }
                                }

                                if (contador == 0) {
                                    users = users + ',' + vacations[v]['fields'].user
                                    $(this).attr('user', users)
                                    states = states + ',' + vacations[v]['fields'].state
                                    $(this).attr('absence', states)
                                    types = types + ',' + vacations[v]['fields'].absence_type
                                    $(this).attr('type', types)
                                }

                                if ($(this).hasClass('showing-lastyear')) {

                                } else {
                                    $(this).addClass('showing-lastyear')
                                }
                            }
                        }
                    })
                }
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}
// Mostrar atrasadas MENSUAL
function showLastyearMonth(dept_id) {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/show-vacations/',
        data: {
            dept_id: dept_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_lastyear_month'
        },
        success: function (respuesta) {
            let data = JSON.parse(respuesta);
            for (let j = 0; j < data.length; j++) {
                let start = moment(data[j].start)
                let finish = moment(data[j].finish)
                let start_radius = start.format('YYYY-MM-DD')
                let finish_radius = finish.format('YYYY-MM-DD')
                let user_name = data[j].first_name.toUpperCase() + ' ' + data[j].last_name.toUpperCase()
                let diff = finish.diff(start, 'days')
                for (let pos = 1; pos < 6; pos++) {
                    let days = []
                    let count = -1
                    let m_start = start
                    while (finish.diff(m_start, 'days') >= 0) {
                        let cell = $('.okm[date=' + m_start.format('YYYY-MM-DD') + ']')
                        let childDiv = cell.children('.abs-user[position=' + pos + ']')
                        if (childDiv.html() == '' || childDiv.html() == null) {
                            count++
                            days.push(childDiv)
                            m_start.add(1, 'days')
                        } else {
                            break
                        }
                        for (let k = 0; k < days.length; k++) {
                            if (diff >= count) {
                                if (data[j].absence_type == 1) {
                                    days[k].html(user_name)
                                    if (data[j].state == 1) {
                                        days[k].addClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#B4E6A1')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    } else {
                                        days[k].addClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#FFB852')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    }
                                } else if (data[j].absence_type == 6) {
                                    if (data[j].state == 1) {
                                        days[k].html(user_name)
                                        days[k].css('background-color', '#e69ae3')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                        days[k].addClass('showing-lastyear')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                    } else {
                                        days[k].addClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#FFB852')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    }
                                } else {
                                    days[k].html(user_name)
                                    days[k].css('background-color', '#9e9e9e')
                                    days[k].css('font-weight', 'bold')
                                    days[k].css('text-align', 'center')
                                    days[k].addClass('showing-other')
                                    days[k].removeClass('showing-pending')
                                    days[k].removeClass('showing-accepted')
                                    days[k].removeClass('showing-lastyear')
                                }
                                if ((days[k].attr('date') == data[j].start) || (days[k].attr('date') == data[j].finish)) {
                                    // Formatos y recorrido de fechas
                                    if (days[k].attr('date') == start_radius) {
                                        days[k].css('border-top-left-radius', '5px')
                                        days[k].css('border-bottom-left-radius', '5px')
                                        days[k].css('margin-left', '5px')
                                        if (start_radius == finish_radius) {
                                            days[k].css('border-top-right-radius', '5px')
                                            days[k].css('border-bottom-right-radius', '5px')
                                            days[k].css('margin-right', '5px')
                                        }
                                    } else if (days[k].attr('date') == finish_radius) {
                                        days[k].css('border-top-right-radius', '5px')
                                        days[k].css('border-bottom-right-radius', '5px')
                                        days[k].css('margin-right', '5px')
                                    }
                                }
                            }

                        }
                    }
                }
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

// Mostrar solapadas ANUAL
function showRepeated(departament_id) {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/show-vacations/',
        data: {
            departament_id: departament_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'show_repeated'
        },
        success: function (respuesta) {
            let vacations = JSON.parse(respuesta);
            for (let v = 0; v < vacations.length; v++) {
                if (vacations[v]['fields'].deleted == 0) {
                    let start = vacations[v]['fields'].start
                    let finish = vacations[v]['fields'].finish
                    let start_radius = vacations[v]['fields'].start
                    let finish_radius = vacations[v]['fields'].finish

                    $(".grid-cell-gb.ok").each(function () {
                        if (($(this).attr('date') == start) || ($(this).attr('date') == finish)) {

                            // Formato y recorrido de fechas
                            if ($(this).attr('date') == start_radius) {
                                $(this).css('border-top-left-radius', '5px')
                                $(this).css('border-bottom-left-radius', '5px')
                                if (start_radius == finish_radius) {
                                    $(this).css('border-top-right-radius', '5px')
                                    $(this).css('border-bottom-right-radius', '5px')
                                }
                            } else if ($(this).attr('date') == finish_radius) {
                                $(this).css('border-top-right-radius', '5px')
                                $(this).css('border-bottom-right-radius', '5px')
                            } else {
                                $(this).css('border-top-left-radius', '')
                                $(this).css('border-top-right-radius', '')
                                $(this).css('border-bottom-left-radius', '')
                                $(this).css('border-bottom-right-radius', '')
                            }

                            let m_start = moment(start)
                            let m_finish = moment(finish)
                            m_start.add(1, 'days');

                            if (m_start < m_finish) {
                                let start_d = m_start.date()
                                if (start_d < 10) {
                                    start_d = '0' + start_d
                                }

                                let start_m = m_start.month() + 1
                                if (start_m < 10) {
                                    start_m = '0' + start_m
                                }

                                let start_y = m_start.year()

                                start = start_y + '-' + start_m + '-' + start_d
                            }

                            // Coloreamos en el calendario en función de los usuarios
                            let user = vacations[v]['fields'].user
                            let absence = vacations[v]['fields'].state
                            if ($(this).hasClass('ko')) {
                                $(this).addClass('showing-repeated')
                                $(this).css('background-color', '#FF5858')

                                let before = $(this).attr('user')
                                $(this).attr('user', before + ',' + user)
                                let before2 = $(this).attr('absence')
                                $(this).attr('absence', before2 + ',' + absence)
                            } else {
                                $(this).addClass('ko')
                                $(this).attr('user', user)
                                $(this).attr('absence', vacations[v]['fields'].state)
                            }
                        }
                    })
                }
            }
            $(".ko").each(function () {
                if ($(this).css('background-color') !== 'rgb(255, 88, 88)') {
                    if (($(this).hasClass('showing-accepted')) || ($(this).hasClass('showing-pending'))) {

                    } else {
                        $(this).attr('user', '')
                    }
                }
            })
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

// Cargar los calendarios en el preview
function getCalendar() {
    let fin = 13
    let current_year = $('.current-year').text()
    for (let x = 1; x < fin; x++) {
        let preview = 'preview' + x
        let calendar = new Calendar(preview, current_year);
    }
}

// Calcular el año del calendario en el preview
getCurrentYear()
function getCurrentYear() {
    let now = new Date()
    let current_year = now.getFullYear()
    $('.current-year').text(current_year)
    getCalendar()
}

var selected_month;
var selected_year;

// Ir un año hacia atrás en el calendario preview
$(document).on('click', '.subtract-year', function () {
    let current_year = $(".current-year").text()
    current_year = current_year - 1
    $('.current-year').text(current_year)
    $('.info-user').attr('is_checked', 'false')
    $('.user-item').css('background-color', '#f7f7f7')
    $('.info-dept').attr('is_checked', 'false')
    $('.dept-item').css('background-color', '#f7f7f7')
    $('.filter-accepted').attr('is_checked', 'false')
    $('.filter-accepted').css('background-color', '#f7f7f7')
    $('.filter-other').attr('is_checked', 'false')
    $('.filter-other').css('background-color', '#f7f7f7')
    $('.filter-pending').attr('is_checked', 'false')
    $('.filter-pending').css('background-color', '#f7f7f7')
    $('.filter-repeated').attr('is_checked', 'false')
    $('.filter-repeated').css('background-color', '#f7f7f7')
    $('.filter-lastyear').attr('is_checked', 'false')
    $('.filter-lastyear').css('background-color', '#f7f7f7')
    getCalendar()
    moreInfo()
    fullCalendar()
})

// Avanzar un año en el calendario preview
$(document).on('click', '.add-year', function () {
    let current_year = $(".current-year").text()
    current_year = parseInt(current_year) + 1
    $('.current-year').text(current_year)
    $('.info-user').attr('is_checked', 'false')
    $('.user-item').css('background-color', '#f7f7f7')
    $('.info-dept').attr('is_checked', 'false')
    $('.dept-item').css('background-color', '#f7f7f7')
    $('.filter-accepted').attr('is_checked', 'false')
    $('.filter-accepted').css('background-color', '#f7f7f7')
    $('.filter-other').attr('is_checked', 'false')
    $('.filter-other').css('background-color', '#f7f7f7')
    $('.filter-pending').attr('is_checked', 'false')
    $('.filter-pending').css('background-color', '#f7f7f7')
    $('.filter-repeated').attr('is_checked', 'false')
    $('.filter-repeated').css('background-color', '#f7f7f7')
    $('.filter-lastyear').attr('is_checked', 'false')
    $('.filter-lastyear').css('background-color', '#f7f7f7')
    getCalendar()
    moreInfo()
    fullCalendar()
})

// Cargar datos preview de un calendario en concreto
function getCalendarMonth(preview) {
    let current_year = $('.current-year').text()
    let calendar = new Month(preview, current_year);
}

// Tooltip para la info de las vacaciones
$(document).on('click', '.modal-dialog.modal-xl', function (e) {
    let container = $(this)
    if ($(e.target).hasClass('ok')) {
        let cell = $(e.target)
        let top = container.offset().top
        showCoords(e, top)
        if (cell.attr('user') !== '') {
            $('.tooltip-users').empty();
            let users = cell.attr('user')
            let absences = cell.attr('absence')
            let type = cell.attr('type')
            let result = users.split(',')
            absences = absences.split(',')
            type = type.split(',')
            for (let r = 0; r < result.length; r++) {
                let user = result[r]
                // Llamada AJAX
                $.ajax({
                    type: 'POST',
                    url: '/get-avatars/',
                    data: {
                        user: user,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        action: 'get_avatars'
                    },
                    success: function (respuesta) {
                        let avatar = JSON.parse(respuesta);

                        let icon_color
                        if (type[r] == 1) {
                            if (absences[r] == 0) {
                                icon_color = '#ffa87d'
                            } else if (absences[r] == 1) {
                                icon_color = '#A8E6A1'
                            }
                        } else if (type[r] == 6) {
                            if (absences[r] == 1) {
                                icon_color = '#e69ae3'
                            } else if (absences[r] == 0) {
                                icon_color = '#ffa87d'
                            }
                        } else {
                            icon_color = '#9e9e9e'
                        }


                        if ($(e.target).hasClass('showing-accepted') && $(e.target).hasClass('showing-pending') && $(e.target).hasClass('showing-other') && $(e.target).hasClass('showing-lastyear')) {
                            $('.tooltip-users').append(
                                '<li class="user-item" style="border-radius:9px;">' +
                                '<div class="todo-title-wrapper d-flex justify-content-between align-items-center">' +
                                '<div class="todo-title-area d-flex" style="margin-top: 1%; width: 100%; margin-left:15px;">' +
                                '<div class="avatar avatar_user editing-avatar" style="margin-left:1px; margin-top:3px; cursor:default;" user=' + user + '><img src="/dashboard/staticfiles/images/portrait/small/' + avatar[0]['fields'].avatar + '"></div>' +
                                '<p style="margin-top:6px; margin-left:8%; margin-bottom:0%;">' + avatar[0]['fields'].first_name + ' ' + avatar[0]['fields'].last_name + '</p>' +
                                '<i class="fas fa-circle" style="font-size: 14px; margin-left:8px; margin-top:12px; color:' + icon_color + ';"></i>' +
                                '</div>' +
                                '</div>' +
                                '</li>'
                            )
                        } else if ($(e.target).hasClass('showing-repeated')) {
                            $('.tooltip-users').append(
                                '<li class="user-item" style="border-radius:9px;">' +
                                '<div class="todo-title-wrapper d-flex justify-content-between align-items-center">' +
                                '<div class="todo-title-area d-flex" style="margin-top: 1%; width: 100%; margin-left:15px;">' +
                                '<div class="avatar avatar_user editing-avatar" style="margin-left:1px; margin-top:3px; cursor:default;" user=' + user + '><img src="/dashboard/staticfiles/images/portrait/small/' + avatar[0]['fields'].avatar + '"></div>' +
                                '<p style="margin-top:6px; margin-left:8%; margin-bottom:0%;">' + avatar[0]['fields'].first_name + ' ' + avatar[0]['fields'].last_name + '</p>' +
                                '<i class="fas fa-circle" style="font-size: 14px; margin-left:8px; margin-top:12px; color:' + icon_color + ';"></i>' +
                                '</div>' +
                                '</div>' +
                                '</li>'
                            )
                        } else {
                            $('.tooltip-users').append(
                                '<li class="user-item" style="border-radius:9px;">' +
                                '<div class="todo-title-wrapper d-flex justify-content-between align-items-center">' +
                                '<div class="todo-title-area d-flex" style="margin-top: 1%; width: 100%; margin-left:15px;">' +
                                '<div class="avatar avatar_user editing-avatar" style="margin-left:1px; margin-top:3px; cursor:default;" user=' + user + '><img src="/dashboard/staticfiles/images/portrait/small/' + avatar[0]['fields'].avatar + '"></div>' +
                                '<p style="margin-top:6px; margin-left:8%; margin-bottom:0%;">' + avatar[0]['fields'].first_name + ' ' + avatar[0]['fields'].last_name + '</p>' +
                                '<i class="fas fa-circle" style="font-size: 14px; margin-left:8px; margin-top:12px; color:' + icon_color + ';"></i>' +
                                '</div>' +
                                '</div>' +
                                '</li>'
                            )
                        }

                    },
                    error: function (xhr, errmsg, err) {
                        console.log(xhr.status + ": " + xhr.responseText);
                    }
                });
            }
            $('.tooltip-data').show();
        } else {
            $('.tooltip-users').empty();
            $('.tooltip-data').hide();
        }
    } else {
        $('.tooltip-users').empty();
        $('.tooltip-data').hide();
    }
})

// Coordenadas del tooltip
function showCoords(event, top) {
    var cX = event.clientX;
    var cY = event.clientY;
    $('.tooltip-data').css('top', cY - top - 35)
    $('.tooltip-data').css('left', cX - 60)
}

// NEWW
//** Autocompletamos la fecha1 con la fecha de hoy */
let today = new Date();

var day = today.getDate();
if (day < 10) {
    day = "0" + day
}
var month = today.getMonth();
var months = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
var year = today.getFullYear();
today = (year + "-" + months[month] + "-" + day);

$('#date_now2').val(today)
$('#date_after').val(today)

//** Comportamiento del check "Sólo es un día libre" */
$(document).on('click', '.hd-day_off', function () {
    $('.content_day_off').toggle()
})

//** Vaciar el formulario para no ver datos anteriores */
$(document).on('click', '.empty-form', function () {
    $('.absence_type').val(0)
    $('.absence_description').val('')
    $('.abs_image').val('')
    $('#date_now2').val(today)
    $('#date_after').val(today)
    $('.input-description').show()
})

//** Ocultamos el cuadro de descripción cuando no es necesario */
$(document).on('change', '.absence_type', function () {
    if ($(this).val() == 1 || $(this).val() == 6) {
        $('.input-description').hide()
        $('.input-img').hide()
    } else {
        $('.input-description').show()
        $('.input-img').show()
    }
})

$(document).on('change', '.hd-date1', function () {
    let start = moment($(this).val())
    let start_date = $(this).val()
    $('.hd-date2').val(start_date)
})

//** Vacaciones año anterior */
if ((moment().format('MM') != 01 && moment().format('MM') != 02) || $('.pending_days').val() == 0) {
    $('.pending-vac').remove()
}

//** Creamos ausencias nuevas */
$(document).on('click', '.addAbsence', function () {
    // $(this).prop("disabled", true);
    let start = $('.hd-date1').val()
    let finish = $('.hd-date2').val()

    let startDate = moment(start)
    let finishDate = moment(finish)

    let start_date = new Date(start).getTime();
    let finish_date = new Date(finish).getTime();
    let today = new Date()

    let this_user
    if ($('.user_id').val() == 18 || $('.user_id').val() == 64 || $('.user_id').val() == 45 || $('.user_id').val() == 51) {
        this_user = parseInt($('.user_list').val())
    } else if ($('.this-manager').val() == $('.user_id').val()) {
        this_user = parseInt($('.user_list').val())
    } else {
        this_user = $('.user_id').val()
    }

    var formData = new FormData()

    let diff = workingDays(start, finish).toString()
    let years = diff.split(',')
    let diff_act = parseInt(years[0])
    let diff_next = parseInt(years[1])
    let totaldiff = diff_act + diff_next

    let files = $('.abs_image').prop('files')
    let rcount = 0

    formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
    formData.append('action', 'add_absence');

    formData.append('user', this_user);
    formData.append('departament', $('.departament_id').val());
    formData.append('description', $('.absence_description').val());
    formData.append('absence_type', $('.absence_type').val());
    formData.append('start', start);
    formData.append('finish', finish);
    formData.append('diff', totaldiff);
    formData.append('diff_act', diff_act);
    formData.append('diff_next', diff_next);
    formData.append('manager', $('.this-manager').val());

    for (i in files) {
        formData.append('r' + rcount, files[i]);
        rcount++
    }
    formData.append('count', rcount)

    if ((start_date - today) >= -8, 64e+7) {
        if ((finish_date - start_date) >= 0) {
            if ($('.absence_type').val() != 0 && $('.hd-date1').val() && $('.hd-date2').val() && $('.user_list').val() != 0) {
                if ((($('.absence_type').val() != 1 && $('.absence_type').val() != 6) || (($('.absence_type').val() == 1 || $('.absence_type').val() == 6) && (totaldiff == 7))) || ((totaldiff == 1 && startDate.isoWeekday() != 6 && finishDate.isoWeekday() != 6) && (totaldiff == 1 && startDate.isoWeekday() != 7 && finishDate.isoWeekday() != 7))) {
                    // Llamada AJAX
                    $.ajax({
                        type: 'POST',
                        url: '/vacations-management/',
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (respuesta) {
                            if (respuesta != 'error' && respuesta != 'error2') {
                                if (respuesta.split('/*/*')[0] != 'overlapping') {
                                    if (respuesta != 'pendientes') {
                                        let data = JSON.parse(respuesta)
                                        absence_type_text = ''
                                        if (data['abs'][0]['fields'].absence_type == 1) {
                                            absence_type_text = 'Vacaciones'
                                        } else if (data['abs'][0]['fields'].absence_type == 2) {
                                            absence_type_text = 'Enfermedad'
                                        } else if (data['abs'][0]['fields'].absence_type == 3) {
                                            absence_type_text = 'Enfermedad de un familiar'
                                        } else if (data['abs'][0]['fields'].absence_type == 4) {
                                            absence_type_text = 'Maternidad/Paternidad'
                                        } else if (data['abs'][0]['fields'].absence_type == 5) {
                                            absence_type_text = 'Otro'
                                        } else if (data['abs'][0]['fields'].absence_type == 6) {
                                            absence_type_text = 'Vacaciones Pendientes'
                                        }

                                        state_text = ''
                                        if (data['abs'][0]['fields'].state == 0) {
                                            state_text = 'Pendiente'
                                        } else {
                                            state_text = 'Aceptada'
                                        }

                                        let start_year = (data['abs'][0]['fields'].start).split('-')[0]

                                        let actions = ''
                                        let user_link

                                        if ($('.this-manager').val() == $('.user_id').val() || $('.user_id').val() == 18 || $('.user_id').val() == 43 || $('.user_id').val() == 36 || $('.user_id').val() == 25) {
                                            user_link = '<a class="vacations-data vacations-names" href=""http://gestion.esmovil.es/users-management/' + data['abs_user'][0]['pk'] + '" target="_blank">' + data['abs_user'][0]['fields'].first_name + ' ' + data['abs_user'][0]['fields'].last_name + '</a>'
                                        } else {
                                            user_link = '<p class="vacations-data vacations-names">' + data['abs_user'][0]['fields'].first_name + ' ' + data['abs_user'][0]['fields'].last_name + '</p>'
                                        }

                                        if ($('.this-manager').val() == data['abs'][0]['fields'].user) {
                                            if (data['abs'][0]['fields'].state == 0) {
                                                actions = '<i class="fas fa-check accept-absence" style="color:#77D797; cursor: pointer; font-size: 22px; padding: 5px;" ida="' + data['abs'][0]['pk'] + '" absence_user="' + data['abs'][0]['fields'].user + '"></i><i class="fas fa-close cancel-absence" style="color:#F55F5F; cursor: pointer; font-size: 24px; padding: 5px;" ida="' + data['abs'][0]['pk'] + '" absence_user="' + data['abs'][0]['fields'].user + '"></i>'
                                            } else if (data['abs'][0]['fields'].state == 1) {
                                                actions = '<i class="fas fa-trash-alt delete-absence" style="color:#00b5b8; cursor: pointer; font-size: 22px; padding: 5px;" ida="' + data['abs'][0]['pk'] + '" absence_user="' + data['abs'][0]['fields'].user + '"></i>'
                                            }
                                        } else {
                                            if (data['abs'][0]['fields'].state == 0) {
                                                actions = '<i class="fas fa-close cancel-absence" style="color:#F55F5F; cursor: pointer; font-size: 24px; padding: 5px;" ida="' + data['abs'][0]['pk'] + '" absence_user="' + data['abs'][0]['fields'].user + '"></i>'
                                            }
                                        }

                                        if (data['abs'][0]['fields'].absence_type != 1 && data['abs'][0]['fields'].absence_type != 6) {
                                            if (data['abs_media'][0] != null) {
                                                let file = data['abs_media'][0]['fields'].file

                                                let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                                                let start_day = (data['abs'][0]['fields'].start).split('-')[2]
                                                let start_month = ((data['abs'][0]['fields'].start).split('-')[1]) - 1
                                                start_month = months[start_month]
                                                let start_year = (data['abs'][0]['fields'].start).split('-')[0]
                                                let start = start_day + ' de ' + start_month + ' de ' + start_year

                                                let finish_day = (data['abs'][0]['fields'].finish).split('-')[2]
                                                let finish_month = ((data['abs'][0]['fields'].finish).split('-')[1]) - 1
                                                finish_month = months[finish_month]
                                                let finish_year = (data['abs'][0]['fields'].finish).split('-')[0]
                                                let finish = finish_day + ' de ' + finish_month + ' de ' + finish_year

                                                t.row.add([
                                                    '<td class="text-center">' +
                                                    '<input type="hidden" class="vacations-data vacations-id" value="' + data['abs'][0]['pk'] + '">' +
                                                    '<input type="hidden" class="vacations-data user-id" value="' + data['abs'][0]['fields'].user + '">' +
                                                    user_link +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-type">' + absence_type_text + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-description">' + data['abs'][0]['fields'].description + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-start_date" start_date="' + start + '" ida="' + data['abs'][0]['pk'] + '">' + start + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-finish_date" finish_date="' + finish + '" ida="' + data['abs'][0]['pk'] + '">' + finish + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-state">' + state_text + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<a href="../../../dashboard/media/' + file + '" target="_blank">' +
                                                    '<i class= "fas fa-file-pdf" style="color: #77D797;"></i></a>' +
                                                    '</td>',
                                                    '<td class="text-center vacations-actions">' + actions + '</td>'
                                                ]).draw(false);
                                            } else {
                                                let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                                                let start_day = (data['abs'][0]['fields'].start).split('-')[2]
                                                let start_month = ((data['abs'][0]['fields'].start).split('-')[1]) - 1
                                                start_month = months[start_month]
                                                let start_year = (data['abs'][0]['fields'].start).split('-')[0]
                                                let start = start_day + ' de ' + start_month + ' de ' + start_year

                                                let finish_day = (data['abs'][0]['fields'].finish).split('-')[2]
                                                let finish_month = ((data['abs'][0]['fields'].finish).split('-')[1]) - 1
                                                finish_month = months[finish_month]
                                                let finish_year = (data['abs'][0]['fields'].finish).split('-')[0]
                                                let finish = finish_day + ' de ' + finish_month + ' de ' + finish_year

                                                t.row.add([
                                                    '<td class="text-center">' +
                                                    '<input type="hidden" class="vacations-data vacations-id" value="' + data['abs'][0]['pk'] + '">' +
                                                    '<input type="hidden" class="vacations-data user-id" value="' + data['abs'][0]['fields'].user + '">' +
                                                    user_link +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-type">' + absence_type_text + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-description">' + data['abs'][0]['fields'].description + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-start_date" start_date="' + start + '" ida="' + data['abs'][0]['pk'] + '">' + start + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-finish_date" finish_date="' + finish + '" ida="' + data['abs'][0]['pk'] + '">' + finish + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-state">' + state_text + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<i class= "fas fa-file-pdf" style="color: red;"></i>' +
                                                    '</td>',
                                                    '<td class="text-center vacations-actions">' + actions + '</td>'
                                                ]).draw(false);
                                            }
                                        } else {
                                            let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                                            let start_day = (data['abs'][0]['fields'].start).split('-')[2]
                                            let start_month = ((data['abs'][0]['fields'].start).split('-')[1]) - 1
                                            start_month = months[start_month]
                                            let start_year = (data['abs'][0]['fields'].start).split('-')[0]
                                            let start = start_day + ' de ' + start_month + ' de ' + start_year

                                            let finish_day = (data['abs'][0]['fields'].finish).split('-')[2]
                                            let finish_month = ((data['abs'][0]['fields'].finish).split('-')[1]) - 1
                                            finish_month = months[finish_month]
                                            let finish_year = (data['abs'][0]['fields'].finish).split('-')[0]
                                            let finish = finish_day + ' de ' + finish_month + ' de ' + finish_year

                                            if ($('.this-manager').val() == data['abs'][0]['fields'].user) {
                                                t.row.add([
                                                    '<td class="text-center">' +
                                                    '<input type="hidden" class="vacations-data vacations-id" value="' + data['abs'][0]['pk'] + '">' +
                                                    '<input type="hidden" class="vacations-data user-id" value="' + data['abs'][0]['fields'].user + '">' +
                                                    user_link +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-type">' + absence_type_text + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-description">' + data['abs'][0]['fields'].description + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-start_date" start_date="' + start + '" ida="' + data['abs'][0]['pk'] + '">' + start + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-finish_date" finish_date="' + finish + '" ida="' + data['abs'][0]['pk'] + '">' + finish + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-state">' + state_text + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center"></td>',
                                                    '<td class="text-center vacations-actions">' + actions + '</td>',
                                                ]).draw(false);
                                            } else {
                                                t.row.add([
                                                    '<td class="text-center">' +
                                                    '<input type="hidden" class="vacations-data vacations-id" value="' + data['abs'][0]['pk'] + '">' +
                                                    '<input type="hidden" class="vacations-data user-id" value="' + data['abs'][0]['fields'].user + '">' +
                                                    user_link +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-type">' + absence_type_text + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-description">' + data['abs'][0]['fields'].description + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-start_date" start_date="' + start + '" ida="' + data['abs'][0]['pk'] + '">' + start + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-finish_date" finish_date="' + finish + '" ida="' + data['abs'][0]['pk'] + '">' + finish + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center">' +
                                                    '<p class="vacations-data vacations-state">' + state_text + '</p>' +
                                                    '</td>',
                                                    '<td class="text-center vacations-actions">' + actions + '</td>'
                                                ]).draw(false);
                                            }

                                        }

                                        $('tr').each(function () {
                                            if (!$(this).attr('ida')) {
                                                $(this).attr('ida', data['abs'][0]['pk'])
                                                $(this).addClass('vacations-data')
                                                $(this).addClass('even')
                                            }
                                        })

                                        if ($('.user_id').val() == data['abs'][0]['fields'].user) {
                                            if ($('.this-manager').val() == $('.user_id').val()) {
                                                if (data['abs'][0]['fields'].absence_type == 1) {
                                                    if (start_year.toString() == moment().format('YYYY').toString()) {
                                                        let used_days = $('.used-days').text()
                                                        used_days = parseInt(used_days) + diff_act
                                                        $('.used-days').text(used_days)

                                                        let free_days = $('.free-days').text()
                                                        free_days = parseInt(free_days) - diff_act
                                                        $('.free-days').text(free_days)

                                                        let used_days_next = $('.used-days-next').text()
                                                        used_days_next = parseInt(used_days_next) + diff_next
                                                        $('.used-days-next').text(used_days_next)
                                                    } else {
                                                        let used_days_next = $('.used-days-next').text()
                                                        used_days_next = parseInt(used_days_next) + diff_next
                                                        $('.used-days-next').text(used_days_next)
                                                    }
                                                } else if (data['abs'][0]['fields'].absence_type == 6) {
                                                    let total_free_days = $('.total-free-days').text()
                                                    total_free_days = parseInt(total_free_days) - diff
                                                    $('.total-free-days').text(total_free_days)

                                                    let pending_days = $('.pending-days').text()
                                                    pending_days = parseInt(pending_days) - diff
                                                    $('.pending-days').text(pending_days)
                                                }
                                            }
                                        }

                                        toastr.success('', 'Ausencia creada con éxito.');
                                        $('#addHolidays').modal('hide');
                                        $('.addAbsence').prop("disabled", false);
                                    } else {
                                        $('.addAbsence').prop("disabled", false);
                                        toastr.error('', 'Las vacaciones pendientes solo se pueden coger en Enero y Febrero.');
                                    }
                                } else {
                                    $('.addAbsence').prop("disabled", false);
                                    toastr.error('', 'Esta semana no está disponible (Solicitada por: ' + respuesta.split('/*/*')[1] + ')');
                                }
                            } else if (respuesta == 'error2') {
                                $('.addAbsence').prop("disabled", false);
                                toastr.error('', 'No dispones de tantos días de vacaciones para el año que viene.');
                            } else {
                                $('.addAbsence').prop("disabled", false);
                                toastr.error('', 'No dispones de tantos días de vacaciones para este año.');
                            }
                        },
                        error: function (xhr, errmsg, err) {
                            $('.addAbsence').prop("disabled", false);
                            console.log(xhr.status + ": " + xhr.responseText);
                        }
                    });
                } else {
                    $('.addAbsence').prop("disabled", false);
                    toastr.error('', 'Solo puedes coger vacaciones 1 semana completa (7 días) o días sueltos (NI SÁBADO NI DOMINGO).');
                }
            } else {
                $('.addAbsence').prop("disabled", false);
                toastr.error('', 'Hay que cumplimentar todos los datos.');
            }
        } else {
            $('.addAbsence').prop("disabled", false);
            toastr.error('', 'La fecha de inicio no puede ser superior a la fecha de fin');
        }
    } else {
        $('.addAbsence').prop("disabled", false);
        toastr.error('', 'La fecha de inicio no puede ser inferior a la fecha de hoy');
    }
})

//** Aceptamos ausencias pendientes */
$(document).on('click', '.accept-absence', function () {
    let ida = $(this).attr('ida')
    let absence_user = $(this).attr('absence_user')
    let start = $('.vacations-start_date[ida="' + ida + '"]').attr('start_date').toUpperCase()
    let finish = $('.vacations-finish_date[ida="' + ida + '"]').attr('finish_date').toUpperCase()

    let month_dict = { 'ENERO': '01', 'FEBRERO': '02', 'MARZO': '03', 'ABRIL': '04', 'MAYO': '05', 'JUNIO': '06', 'JULIO': '07', 'AGOSTO': '08', 'SEPTIEMBRE': '09', 'OCTUBRE': '10', 'NOVIEMBRE': '11', 'DICIEMBRE': '12' }
    let start_year = start.split(' ')[4]
    let start_month = month_dict[start.split(' ')[2]]
    let start_day = start.split(' ')[0]
    let finish_year = finish.split(' ')[4]
    let finish_month = month_dict[finish.split(' ')[2]]
    let finish_day = finish.split(' ')[0]

    start = start_year + '-' + start_month + '-' + start_day
    finish = finish_year + '-' + finish_month + '-' + finish_day

    let diff = workingDays(start, finish).toString()
    let years = diff.split(',')
    diff_act = parseInt(years[0])
    diff_next = parseInt(years[1])
    let totaldiff = diff_act + diff_next

    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/vacations-management/',
        data: {
            ida: ida,
            diff: totaldiff,
            diff_act: diff_act,
            diff_next: diff_next,
            user: absence_user,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'accept_absence'
        },
        success: function (respuesta) {
            if (respuesta != 'error') {
                $("tr.vacations-data").each(function () {
                    if ($(this).attr('ida') == ida) {
                        $(this).find('.vacations-state').text("Aceptada")
                        $(this).find('.accept-absence').remove()
                        $(this).find('.cancel-absence').remove()
                        $(this).find('.vacations-actions').html('<i class="fas fa-trash-alt delete-absence" style="color:#00b5b8; cursor: pointer; font-size: 22px; padding: 5px;" ida="' + ida + '" absence_user="' + respuesta + '"></i>')
                    }
                })

                toastr.success('', 'La ausencia ha sido aceptada correctamente.');
            } else {
                toastr.error('', 'No dispones de tantos días de vacaciones.');
            }

        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
})

//** Rechazamos ausencias pendientes */
$(document).on('click', '.cancel-absence', function () {
    let ida = $(this).attr('ida')
    let absence_user = $(this).attr('absence_user')
    let start = $('.vacations-start_date[ida="' + ida + '"]').attr('start_date').toUpperCase()
    let finish = $('.vacations-finish_date[ida="' + ida + '"]').attr('finish_date').toUpperCase()

    let month_dict = { 'ENERO': '01', 'FEBRERO': '02', 'MARZO': '03', 'ABRIL': '04', 'MAYO': '05', 'JUNIO': '06', 'JULIO': '07', 'AGOSTO': '08', 'SEPTIEMBRE': '09', 'OCTUBRE': '10', 'NOVIEMBRE': '11', 'DICIEMBRE': '12' }

    let start_year = start.split(' ')[4]
    let start_month = month_dict[start.split(' ')[2]]
    let start_day = start.split(' ')[0]
    let finish_year = finish.split(' ')[4]
    let finish_month = month_dict[finish.split(' ')[2]]
    let finish_day = finish.split(' ')[0]

    start = start_year + '-' + start_month + '-' + start_day
    finish = finish_year + '-' + finish_month + '-' + finish_day

    let diff = workingDays(start, finish).toString()
    let years = diff.split(',')
    diff_act = parseInt(years[0])
    diff_next = parseInt(years[1])
    let totaldiff = diff_act + diff_next

    swal.fire({
        title: '¿Deseas rechazar esta ausencia?',
        text: 'La ausencia desaparecerá de la tabla',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SI'
    }).then(function (resp) {
        if (resp['value'] == true) {
            // Llamada AJAX
            $.ajax({
                type: 'POST',
                url: '/vacations-management/',
                data: {
                    ida: ida,
                    diff: totaldiff,
                    user: $('.user_id').val(),
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'cancel_absence'
                },
                success: function (respuesta) {
                    $("tr.vacations-data").each(function () {
                        if ($(this).attr('ida') == ida) {
                            $(this).remove()
                        }
                    })

                    toastr.success('Si ha sido un error, contacte con el Dept. de Desarrollo.', 'La ausencia ha sido cancelada correctamente.');
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
    })
})

//** Borramos ausencias verificadas */
$(document).on('click', '.delete-absence', function () {
    let ida = $(this).attr('ida')
    let absence_user = $(this).attr('absence_user')
    let start = $('.vacations-start_date[ida="' + ida + '"]').attr('start_date').toUpperCase()
    let finish = $('.vacations-finish_date[ida="' + ida + '"]').attr('finish_date').toUpperCase()

    let month_dict = { 'ENERO': '01', 'FEBRERO': '02', 'MARZO': '03', 'ABRIL': '04', 'MAYO': '05', 'JUNIO': '06', 'JULIO': '07', 'AGOSTO': '08', 'SEPTIEMBRE': '09', 'OCTUBRE': '10', 'NOVIEMBRE': '11', 'DICIEMBRE': '12' }

    let start_year = start.split(' ')[4]
    let start_month = month_dict[start.split(' ')[2]]
    let start_day = start.split(' ')[0]
    let finish_year = finish.split(' ')[4]
    let finish_month = month_dict[finish.split(' ')[2]]
    let finish_day = finish.split(' ')[0]

    start = start_year + '-' + start_month + '-' + start_day
    finish = finish_year + '-' + finish_month + '-' + finish_day

    let diff = workingDays(start, finish).toString()
    let years = diff.split(',')
    let diff_act = parseInt(years[0])
    let diff_next = parseInt(years[1])
    let totaldiff = diff_act + diff_next

    swal.fire({
        title: '¿Deseas eliminar esta ausencia?',
        text: 'La ausencia desaparecerá de la tabla y se le sumarán los días pedidos al usuario.',
        type: 'question',
        showCancelButton: true,
        cancelButtonText: 'NO',
        confirmButtonText: 'SI'
    }).then(function (resp) {
        if (resp['value'] == true) {
            // Llamada AJAX
            $.ajax({
                type: 'POST',
                url: '/vacations-management/',
                data: {
                    ida: ida,
                    diff: totaldiff,
                    diff_act: diff_act,
                    diff_next: diff_next,
                    user: $('.user_id').val(),
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    action: 'delete_absence'
                },
                success: function (respuesta) {
                    $("tr.vacations-data").each(function () {
                        if ($(this).attr('ida') == ida) {
                            $(this).remove()
                        }
                    })

                    if ($('.user_id').val() == absence_user) {
                        if (respuesta == 1) {
                            if (start_year.toString() == moment().format('YYYY').toString()) {
                                let used_days = $('.used-days').text()
                                used_days = parseInt(used_days) - diff_act
                                $('.used-days').text(used_days)

                                let free_days = $('.free-days').text()
                                free_days = parseInt(free_days) + diff_act
                                $('.free-days').text(free_days)

                                let used_days_next = $('.used-days-next').text()
                                used_days_next = parseInt(used_days_next) - diff_next
                                $('.used-days-next').text(used_days_next)
                            }
                        }
                    }

                    toastr.success('Si ha sido un error, contacte con el Dept. de Desarrollo.', 'La ausencia ha sido eliminada correctamente.');
                },
                error: function (xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                }
            });
        }
    })
})

// Función que saca los días laborables
// ------------------------------------------ //
// CAMBIO DE DIAS LABORABLES A DIAS NATURALES
function workingDays(dateFrom, dateTo) {
    var startDate = moment(dateFrom, 'YYYY-MM-DD');
    var finishDate = moment(dateTo, 'YYYY-MM-DD');
    var year = moment().format('YYYY')
    // var fest1 = ((moment('2022-01-01', 'YYYY-MM-DD')).toDate()).toString()
    // var fest2 = ((moment('2022-01-06', 'YYYY-MM-DD')).toDate()).toString()
    // var fest3 = ((moment('2022-02-28', 'YYYY-MM-DD')).toDate()).toString()
    // var fest4 = ((moment('2022-04-14', 'YYYY-MM-DD')).toDate()).toString()
    // var fest5 = ((moment('2022-04-15', 'YYYY-MM-DD')).toDate()).toString()
    // var fest6 = ((moment('2022-05-01', 'YYYY-MM-DD')).toDate()).toString()
    // var fest7 = ((moment('2022-05-02', 'YYYY-MM-DD')).toDate()).toString()
    // var fest8 = ((moment('2022-08-15', 'YYYY-MM-DD')).toDate()).toString()
    // var fest9 = ((moment('2022-10-12', 'YYYY-MM-DD')).toDate()).toString()
    // var fest10 = ((moment('2022-11-01', 'YYYY-MM-DD')).toDate()).toString()
    // var fest11 = ((moment('2022-12-06', 'YYYY-MM-DD')).toDate()).toString()
    // var fest12 = ((moment('2022-12-08', 'YYYY-MM-DD')).toDate()).toString()
    // var fest13 = ((moment('2022-12-25', 'YYYY-MM-DD')).toDate()).toString()
    // var fest14 = ((moment('2022-12-26', 'YYYY-MM-DD')).toDate()).toString()

    // var fest15 = ((moment('2023-01-01', 'YYYY-MM-DD')).toDate()).toString()
    // var fest16 = ((moment('2023-01-06', 'YYYY-MM-DD')).toDate()).toString()
    // var fest17 = ((moment('2023-02-28', 'YYYY-MM-DD')).toDate()).toString()
    // var fest18 = ((moment('2023-04-14', 'YYYY-MM-DD')).toDate()).toString()
    // var fest19 = ((moment('2023-04-15', 'YYYY-MM-DD')).toDate()).toString()
    // var fest20 = ((moment('2023-05-01', 'YYYY-MM-DD')).toDate()).toString()
    // var fest21 = ((moment('2023-05-02', 'YYYY-MM-DD')).toDate()).toString()
    // var fest22 = ((moment('2023-08-15', 'YYYY-MM-DD')).toDate()).toString()
    // var fest23 = ((moment('2023-10-12', 'YYYY-MM-DD')).toDate()).toString()
    // var fest24 = ((moment('2023-11-01', 'YYYY-MM-DD')).toDate()).toString()
    // var fest25 = ((moment('2023-12-06', 'YYYY-MM-DD')).toDate()).toString()
    // var fest26 = ((moment('2023-12-08', 'YYYY-MM-DD')).toDate()).toString()
    // var fest27 = ((moment('2023-12-25', 'YYYY-MM-DD')).toDate()).toString()
    // var fest28 = ((moment('2023-12-26', 'YYYY-MM-DD')).toDate()).toString()
    var days_act = 0;
    var days_next = 0;

    while (!startDate.isAfter(finishDate)) {
        // Si no es sabado ni domingo
        // if (((startDate.toDate()).toString() != fest1) && ((startDate.toDate()).toString() != fest2) && ((startDate.toDate()).toString() != fest3) && ((startDate.toDate()).toString() != fest4) && ((startDate.toDate()).toString() != fest5) && ((startDate.toDate()).toString() != fest6) && ((startDate.toDate()).toString() != fest7) && ((startDate.toDate()).toString() != fest8) && ((startDate.toDate()).toString() != fest9) && ((startDate.toDate()).toString() != fest10) && ((startDate.toDate()).toString() != fest11) && ((startDate.toDate()).toString() != fest12) && ((startDate.toDate()).toString() != fest13) && ((startDate.toDate()).toString() != fest14) && ((startDate.toDate()).toString() != fest15) && ((startDate.toDate()).toString() != fest16) && ((startDate.toDate()).toString() != fest17) && ((startDate.toDate()).toString() != fest18) && ((startDate.toDate()).toString() != fest19) && ((startDate.toDate()).toString() != fest20) && ((startDate.toDate()).toString() != fest21) && ((startDate.toDate()).toString() != fest22) && ((startDate.toDate()).toString() != fest23) && ((startDate.toDate()).toString() != fest24) && ((startDate.toDate()).toString() != fest25) && ((startDate.toDate()).toString() != fest26) && ((startDate.toDate()).toString() != fest27) && ((startDate.toDate()).toString() != fest28)) {
        //     if (startDate.isoWeekday() !== 6 && startDate.isoWeekday() !== 7) {
        if (startDate.format('YYYY') == year) {
            days_act++
        } else {
            days_next++
        }
        //     }
        // }

        startDate.add(1, 'days');
    }
    return (days_act + ',' + days_next);
}

//** Mostrar en el calendario todos los usuarios al abrirlo */
function fullCalendar() {
    $('.filter-repeated').addClass('d-flex')
    $(".filter-repeated").css('display', 'block')
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/vacations-management/',
        data: {
            master_dept: $('.master-dept').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'full_calendar'
        },
        success: function (respuesta) {
            let data = JSON.parse(respuesta);
            let users_list = []

            for (let i = 0; i < data['users'].length; i++) {
                users_list.push(data['users'][i]['pk'])
            }

            for (let j = 0; j < data['absences'].length; j++) {
                if ($.inArray(data['absences'][j]['fields'].user, users_list) != -1) {
                    let start = data['absences'][j]['fields'].start
                    let finish = data['absences'][j]['fields'].finish
                    let start_radius = data['absences'][j]['fields'].start
                    let finish_radius = data['absences'][j]['fields'].finish
                    $(".grid-cell-gb.ok").each(function () {
                        if (($(this).attr('date') == start) || ($(this).attr('date') == finish)) {

                            // Formatos y recorrido de fechas
                            if ($(this).attr('date') == start_radius) {
                                $(this).css('border-top-left-radius', '5px')
                                $(this).css('border-bottom-left-radius', '5px')
                                if (start_radius == finish_radius) {
                                    $(this).css('border-top-right-radius', '5px')
                                    $(this).css('border-bottom-right-radius', '5px')
                                }
                            } else if ($(this).attr('date') == finish_radius) {
                                $(this).css('border-top-right-radius', '5px')
                                $(this).css('border-bottom-right-radius', '5px')
                            }
                            let m_start = moment(start)
                            let m_finish = moment(finish)
                            m_start.add(1, 'days');
                            // m_finish.subtract(1, 'days');

                            if (m_start < m_finish) {
                                start = m_start.format('YYYY-MM-DD').toString()
                                finish = m_finish.format('YYYY-MM-DD')
                            }

                            // Coloreamos en el calendario en función de los usuarios
                            let users = $(this).attr('user')
                            let states = $(this).attr('absence')
                            let type = $(this).attr('type')
                            let quantity = users.split(',')

                            if (users == '') {
                                users = data['absences'][j]['fields'].user
                                $(this).attr('user', users)
                                states = data['absences'][j]['fields'].state
                                $(this).attr('absence', states)
                                type = data['absences'][j]['fields'].absence_type
                                $(this).attr('type', type)
                                $(this).attr('dept', data['absences'][j]['fields'].departament)

                                if (data['absences'][j]['fields'].absence_type == 1) {
                                    if (data['absences'][j]['fields'].state == 1) {
                                        $(this).addClass('showing-accepted')
                                        $(this).css('background-color', '#B4E6A1')
                                    } else if (data['absences'][j]['fields'].state == 0) {
                                        $(this).addClass('showing-pending')
                                        $(this).css('background-color', '#FFB852')
                                    }
                                } else if (data['absences'][j]['fields'].absence_type == 6) {
                                    if (data['absences'][j]['fields'].state == 1) {
                                        $(this).addClass('showing-lastyear')
                                        $(this).css('background-color', '#e69ae3')
                                    } else if (data['absences'][j]['fields'].state == 0) {
                                        $(this).addClass('showing-pending')
                                        $(this).css('background-color', '#FFB852')
                                    }
                                } else {
                                    $(this).addClass('showing-other')
                                    $(this).css('background-color', '#9e9e9e')
                                }
                            } else if (quantity.length >= 1) {
                                users = users + ',' + data['absences'][j]['fields'].user
                                $(this).attr('user', users)
                                states = states + ',' + data['absences'][j]['fields'].state
                                $(this).attr('absence', states)
                                type = type + ',' + data['absences'][j]['fields'].absence_type
                                $(this).attr('type', type)

                                let state = data['absences'][j]['fields'].state
                                if (state == 1) {
                                    if ($(this).hasClass('showing-accepted')) {
                                        $(this).css('background-color', '#FF5858')
                                    } else {
                                        $(this).addClass('showing-accepted')
                                        $(this).css('background-color', '#FF5858')
                                    }
                                } else if (state == 0) {
                                    if ($(this).hasClass('showing-pending')) {
                                        $(this).css('background-color', '#FF5858')
                                    } else {
                                        $(this).addClass('showing-pending')
                                        $(this).css('background-color', '#FF5858')
                                    }
                                }
                            }
                        }
                    })
                }
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

function fullCalendarMonth() {
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/vacations-management/',
        data: {
            master_dept: $('.master-dept').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'full_calendar_month'
        },
        success: function (respuesta) {
            let data = JSON.parse(respuesta);
            for (let j = 0; j < data.length; j++) {
                let start = moment(data[j].start)
                let finish = moment(data[j].finish)
                let start_radius = start.format('YYYY-MM-DD')
                let finish_radius = finish.format('YYYY-MM-DD')
                let user_name = data[j].first_name.toUpperCase() + ' ' + data[j].last_name.toUpperCase()
                let diff = finish.diff(start, 'days')
                for (let pos = 1; pos < 6; pos++) {
                    let days = []
                    let count = -1
                    let m_start = start
                    while (finish.diff(m_start, 'days') >= 0) {
                        let cell = $('.okm[date=' + m_start.format('YYYY-MM-DD') + ']')
                        let childDiv = cell.children('.abs-user[position=' + pos + ']')
                        if (childDiv.html() == '' || childDiv.html() == null) {
                            count = count + 1
                            days.push(childDiv)
                            m_start.add(1, 'days')
                        } else {
                            break
                        }
                        for (let k = 0; k < days.length; k++) {
                            if (diff >= count) {
                                if (data[j].absence_type == 1) {
                                    days[k].html(user_name)
                                    if (data[j].state == 1) {
                                        days[k].addClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#B4E6A1')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    } else {
                                        days[k].addClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#FFB852')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    }
                                } else if (data[j].absence_type == 6) {
                                    days[k].html(user_name)
                                    if (data[j].state == 1) {
                                        days[k].css('background-color', '#e69ae3')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                        days[k].addClass('showing-lastyear')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                    } else {
                                        days[k].addClass('showing-pending')
                                        days[k].removeClass('showing-accepted')
                                        days[k].removeClass('showing-other')
                                        days[k].removeClass('showing-lastyear')
                                        days[k].css('background-color', '#FFB852')
                                        days[k].css('font-weight', 'bold')
                                        days[k].css('text-align', 'center')
                                    }
                                } else {
                                    days[k].html(user_name)
                                    days[k].css('background-color', '#9e9e9e')
                                    days[k].css('font-weight', 'bold')
                                    days[k].css('text-align', 'center')
                                    days[k].addClass('showing-other')
                                    days[k].removeClass('showing-pending')
                                    days[k].removeClass('showing-accepted')
                                    days[k].removeClass('showing-lastyear')
                                }
                                if ((days[k].attr('date') == data[j].start) || (days[k].attr('date') == data[j].finish)) {
                                    // Formatos y recorrido de fechas
                                    if (days[k].attr('date') == start_radius) {
                                        days[k].css('border-top-left-radius', '5px')
                                        days[k].css('border-bottom-left-radius', '5px')
                                        days[k].css('margin-left', '5px')
                                        if (start_radius == finish_radius) {
                                            days[k].css('border-top-right-radius', '5px')
                                            days[k].css('border-bottom-right-radius', '5px')
                                            days[k].css('margin-right', '5px')
                                        }
                                    } else if (days[k].attr('date') == finish_radius) {
                                        days[k].css('border-top-right-radius', '5px')
                                        days[k].css('border-bottom-right-radius', '5px')
                                        days[k].css('margin-right', '5px')
                                    }
                                }
                            }
                        }
                    }
                }
            }
            festivos()
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

$(document).on('click', '.open_calendar', function () {
    $(".grid-cell-gb.ok").each(function () {
        $(this).css('background-color', '#f7f7f7')
        $(this).attr('user', '')
        $(this).attr('dept', '')
        $(this).attr('absence', '')
        $(this).removeClass('showing-accepted')
        $(this).removeClass('showing-pending')
        $(this).removeClass('showing-repeated')
        $(this).removeClass('ko')
        $('.filter-accepted-m').removeClass('filter-accepted-m').addClass('filter-accepted')
        $('.filter-pending-m').removeClass('filter-pending-m').addClass('filter-pending')
        $('.filter-repeated-m').removeClass('filter-repeated-m').addClass('filter-repeated')
        $('.filter-other-m').removeClass('filter-other-m').addClass('filter-other')
        $('.filter-lastyear-m').removeClass('filter-lastyear-m').addClass('filter-lastyear')
        $('.filter-repeated').removeClass('d-flex').addClass('d-flex')
        $('.info-user-m').removeClass('info-user-m').addClass('info-user')
        $('.info-dept-m').removeClass('info-dept-m').addClass('info-dept')
        $('.add-year').css('visibility', 'visible')
        $('.subtract-year').css('visibility', 'visible')
    })
    $(".filter-accepted").attr('is_checked', 'false')
    $(".filter-accepted").css('background-color', '#f7f7f7')
    $(".filter-pending").attr('is_checked', 'false')
    $(".filter-pending").css('background-color', '#f7f7f7')
    $(".filter-repeated").attr('is_checked', 'false')
    $(".filter-repeated").css('background-color', '#f7f7f7')
    $(".filter-other").attr('is_checked', 'false')
    $(".filter-other").css('background-color', '#f7f7f7')
    $(".filter-lastyear").attr('is_checked', 'false')
    $(".filter-lastyear").css('background-color', '#f7f7f7')
    $('.filter-repeated').addClass('d-flex')
    $(".filter-repeated").css('display', 'block')
    $('.info-user').attr('is_checked', 'false')
    $('.user-item').css('background-color', '#f7f7f7')
    $('.info-dept').attr('is_checked', 'false')
    $('.dept-item').css('background-color', '#f7f7f7')
    fullCalendar()
})

$(document).on('click', '.more-info', function () {

    $(".grid-cell-gb-month.okm").each(function () {
        $(this).css('background-color', '#f7f7f7')
        $(this).attr('user', '')
        $(this).attr('dept', '')
        $(this).attr('absence', '')
        $(this).removeClass('showing-accepted')
        $(this).removeClass('showing-pending')
        $(this).removeClass('showing-repeated')
        $(this).removeClass('ko')
        $('.filter-accepted').removeClass('filter-accepted').addClass('filter-accepted-m')
        $('.filter-pending').removeClass('filter-pending').addClass('filter-pending-m')
        $('.filter-repeated').removeClass('filter-repeated').addClass('filter-repeated-m')
        $('.filter-other').removeClass('filter-other').addClass('filter-other-m')
        $('.filter-lastyear').removeClass('filter-lastyear').addClass('filter-lastyear-m')
        $('.filter-repeated-m').css('display', 'none')
        $('.filter-repeated-m').removeClass('d-flex')
        $('.add-year').css('visibility', 'hidden')
        $('.subtract-year').css('visibility', 'hidden')
        $('.info-user').removeClass('info-user').addClass('info-user-m')
        $('.info-dept').removeClass('info-dept').addClass('info-dept-m')
    })

    $('.filter-accepted-m').attr('is_checked', 'false')
    $('.filter-accepted-m').css('background-color', '#f7f7f7')
    $('.filter-pending-m').attr('is_checked', 'false')
    $('.filter-pending-m').css('background-color', '#f7f7f7')
    $('.filter-other-m').attr('is_checked', 'false')
    $('.filter-other-m').css('background-color', '#f7f7f7')
    $('.filter-lastyear-m').attr('is_checked', 'false')
    $('.filter-lastyear-m').css('background-color', '#f7f7f7')
    $('.info-user-m').attr('is_checked', 'false')
    $('.user-item').css('background-color', '#f7f7f7')

    fullCalendarMonth()
})

//** Comportamiento del filtro por trabajador */
$(document).on('click', '.info-user', function () {
    $('.filter-accepted').css('background-color', '#f7f7f7')
    $('.filter-accepted').attr('is_checked', 'false')
    $('.filter-pending').css('background-color', '#f7f7f7')
    $('.filter-pending').attr('is_checked', 'false')
    $('.filter-repeated').css('background-color', '#f7f7f7')
    $('.filter-repeated').attr('is_checked', 'false')

    let menu_li = $(this)
    let menu_user = $(this).attr('user')
    let count_checked = 0

    $('.info-user').each(function () {
        if ($(this).attr('is_checked') == 'true') {
            count_checked++
        }
    })

    if (count_checked == 0) {
        let item = $(this).closest('.user-item')
        item.css('background-color', '#E0FFD4')
        $(".grid-cell-gb.ok").each(function () {
            $(this).css('background-color', '#f7f7f7')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('showing-other')
            $(this).removeClass('ko')
        })
        showUsers(menu_user)
        menu_li.attr('is_checked', 'true')
    } else if (count_checked == 1) {
        if (menu_li.attr('is_checked') == 'true') {
            let item = $(this).closest('.user-item')
            item.css('background-color', '#F7F7F7')
            $(".grid-cell-gb.ok").each(function () {
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('ko')
            })
            fullCalendar()
            menu_li.attr('is_checked', 'false')
        } else {
            let item = $(this).closest('.user-item')
            item.css('background-color', '#E0FFD4')
            showUsers(menu_user)
            menu_li.attr('is_checked', 'true')
        }
    } else {
        if (menu_li.attr('is_checked') == 'true') {
            let item = $(this).closest('.user-item')
            item.css('background-color', '#F7F7F7')
            menu_li.attr('is_checked', 'false')

            let father = $(this).closest('.list-users')
            let child = father.find('.info-user')
            $(".grid-cell-gb.ok").each(function () {
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('ko')
            })

            for (let c = 0; c < child.length; c++) {
                if ($(child[c]).attr('is_checked') == 'true') {
                    showUsers($(child[c]).attr('user'))
                }
            }
        } else {
            let item = $(this).closest('.user-item')
            item.css('background-color', '#E0FFD4')
            showUsers(menu_user)
            menu_li.attr('is_checked', 'true')
        }
    }
})
$(document).on('click', '.info-user-m', function () {
    $('.filter-accepted-m').css('background-color', '#f7f7f7')
    $('.filter-accepted-m').attr('is_checked', 'false')
    $('.filter-pending-m').css('background-color', '#f7f7f7')
    $('.filter-pending-m').attr('is_checked', 'false')
    $('.filter-other-m').css('background-color', '#f7f7f7')
    $('.filter-other-m').attr('is_checked', 'false')

    let menu_user = $(this).attr('user')
    let count_checked = 0
    let menu_li = $(this)
    let list_users = []
    let father = $(this).closest('.list-users')
    let child = father.find('.info-user-m')

    $('.info-user-m').each(function () {
        if ($(this).attr('is_checked') == 'true') {
            count_checked++
        }
    })

    if (count_checked == 0) {
        let item = $(this).closest('.user-item')
        item.css('background-color', '#E0FFD4')
        $(".abs-user").each(function () {
            $(this).html('')
            $(this).css('background-color', '#f7f7f7')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('showing-other')
            $(this).removeClass('ko')
        })
        menu_li.attr('is_checked', 'true')
    } else if (count_checked == 1) {
        if (menu_li.attr('is_checked') == 'true') {
            let item = $(this).closest('.user-item')
            item.css('background-color', '#F7F7F7')
            $('.abs-user').each(function () {
                $(this).html('')
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('ko')
            })
            fullCalendarMonth()
            menu_li.attr('is_checked', 'false')
        } else {
            let item = $(this).closest('.user-item')
            item.css('background-color', '#E0FFD4')
            menu_li.attr('is_checked', 'true')
        }
    } else {
        if (menu_li.attr('is_checked') == 'true') {
            let item = $(this).closest('.user-item')
            item.css('background-color', '#F7F7F7')
            menu_li.attr('is_checked', 'false')
            $(".abs-user").each(function () {
                $(this).html('')
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('ko')
            })
        } else {
            let item = $(this).closest('.user-item')
            item.css('background-color', '#E0FFD4')
            menu_li.attr('is_checked', 'true')
        }
    }
    $('.abs-user').html('')
    $('.abs-user').css('background-color', '#f7f7f7')
    $('.abs-user').css('border-radius', '0px')
    $('.abs-user').css('margin', '0px')
    if (count_checked >= 0) {
        for (let c = 0; c < child.length; c++) {
            if ($(child[c]).attr('is_checked') == 'true') {
                list_users.push($(child[c]).attr('user'))
            }
        }
    }
    let text = list_users.toString()
    showUsersMonth(text)
})

//** Comportamiento del filtro por departamento */
$(document).on('click', '.info-dept', function () {
    let departament_id = $(this).attr('dept')

    if ($(this).attr('is_checked') == 'false') {
        $('.info-dept').each(function () {
            if ($(this).attr('is_checked') == 'true') {
                $(this).attr('is_checked', 'false')
                let item = $(this).closest('.dept-item')
                item.css('background-color', '#F7F7F7')
            }
        })
        $('.master-dept').val(departament_id)

        $(this).attr('is_checked', 'true')
        let item = $(this).closest('.dept-item')
        item.css('background-color', '#D4F1FF')

        $('.list-users').empty()
        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/show-vacations/',
            data: {
                departament_id: departament_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'get_user_list'
            },
            success: function (respuesta) {
                let users = JSON.parse(respuesta);

                if (users.length > 0) {
                    for (let i = 0; i < users.length; i++) {
                        $('.list-users').append(
                            '<li class="user-item" style="cursor:pointer; border-radius: 9px;">' +
                            '<div class="todo-title-wrapper d-flex justify-content-between align-items-center">' +
                            '<div class="todo-title-area d-flex info-user" style="margin-top: 1%; margin-left:15px;" is_checked="false" user=' + users[i]['pk'] + '>' +
                            '<div class="avatar avatar_user info-user-avatar"><img src="/dashboard/staticfiles/images/portrait/small/' + users[i]['fields'].avatar + '"></div>' +
                            '<p class="mx-50 m-0 truncate info-user-text" style="width:160px; padding-left:8%;">' + users[i]['fields'].first_name + ' ' + users[i]['fields'].last_name + '</p>' +
                            '</div>' +
                            '</div>' +
                            '</li>'
                        )
                    }
                }
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });

        showDept(departament_id)
    } else {
        $(this).attr('is_checked', 'false')
        let item = $(this).closest('.dept-item')
        item.css('background-color', '#F7F7F7')

        $(".grid-cell-gb.ok").each(function () {
            $(this).css('background-color', '#f7f7f7')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('showing-other')
            $(this).removeClass('ko')
        })

        $('.master-dept').val(0)
        fullCalendar()
    }

    let dept_count = 0
    $('.info-dept').each(function () {
        if ($(this).attr('is_checked') == 'true') {
            dept_count++
        }
    })

    if (dept_count == 0) {
        $('.filter-preview-user').hide()
        $('.main-user').hide()
        $('.filter-state').hide()
        $('.filter-hr').hide()
    } else {
        $('.filter-preview-user').show()
        $('.main-user').show()
        $('.filter-state').show()
        $('.filter-hr').show()
    }
})
$(document).on('click', '.info-dept-m', function () {
    let departament_id = $(this).attr('dept')
    $('.abs-user').html('')
    $('.abs-user').css('background-color', '#f7f7f7')
    $('.abs-user').css('margin', '0px')
    $('.abs-user').css('border', '0px')

    if ($(this).attr('is_checked') == 'false') {
        $('.info-dept-m').each(function () {
            if ($(this).attr('is_checked') == 'true') {
                $(this).attr('is_checked', 'false')
                let item = $(this).closest('.dept-item')
                item.css('background-color', '#F7F7F7')
            }
        })
        $('.master-dept').val(departament_id)

        $(this).attr('is_checked', 'true')
        let item = $(this).closest('.dept-item')
        item.css('background-color', '#D4F1FF')

        $('.list-users').empty()
        // Llamada AJAX
        $.ajax({
            type: 'POST',
            url: '/show-vacations/',
            data: {
                departament_id: departament_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                action: 'get_user_list'
            },
            success: function (respuesta) {
                let users = JSON.parse(respuesta);

                if (users.length > 0) {
                    for (let i = 0; i < users.length; i++) {
                        $('.list-users').append(
                            '<li class="user-item" style="cursor:pointer; border-radius: 9px;">' +
                            '<div class="todo-title-wrapper d-flex justify-content-between align-items-center">' +
                            '<div class="todo-title-area d-flex info-user-m" style="margin-top: 1%; margin-left:15px;" is_checked="false" user=' + users[i]['pk'] + '>' +
                            '<div class="avatar avatar_user info-user-avatar"><img src="/dashboard/staticfiles/images/portrait/small/' + users[i]['fields'].avatar + '"></div>' +
                            '<p class="mx-50 m-0 truncate info-user-text" style="width:160px; padding-left:8%;">' + users[i]['fields'].first_name + ' ' + users[i]['fields'].last_name + '</p>' +
                            '</div>' +
                            '</div>' +
                            '</li>'
                        )
                    }
                }
            },
            error: function (xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
        showDeptMonth(departament_id)
    } else {
        $(this).attr('is_checked', 'false')
        let item = $(this).closest('.dept-item')
        item.css('background-color', '#F7F7F7')

        $(".abs-user").each(function () {
            $(this).html('')
            $(this).css('background-color', '#f7f7f7')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('ko')
        })

        $('.master-dept').val(0)
        fullCalendarMonth()
    }

    let dept_count = 0
    $('.info-dept-m').each(function () {
        if ($(this).attr('is_checked') == 'true') {
            dept_count++
        }
    })

    if (dept_count == 0) {
        $('.filter-preview-user').hide()
        $('.main-user').hide()
        $('.filter-state').hide()
        $('.filter-hr').hide()
    } else {
        $('.filter-preview-user').show()
        $('.main-user').show()
        $('.filter-state').show()
        $('.filter-hr').show()
    }
})

// Que se vean las vacaciones que están aceptadas ANUAL
$(document).on('click', '.filter-accepted', function () {
    $('.user-item').each(function () {
        $(this).css('background-color', '#f7f7f7')
    })
    $('.info-user').each(function () {
        $(this).attr('is_checked', 'false')
    })

    $(this).removeClass('active')
    let this_state = $(this)
    let count_checked = 0
    let departament_id = $('.master-dept').val()


    if ($('.filter-accepted').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-repeated').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-pending').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-other').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-lastyear').attr('is_checked') == 'true') {
        count_checked++
    }

    if (count_checked == 0) {
        $(".grid-cell-gb.ok").each(function () {
            $(this).css('background-color', '#f7f7f7')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('showing-other')
            $(this).removeClass('ko')
        })
        $(this).attr('is_checked', 'true')
        $(this).css('background-color', '#E0FFD4')
        showAccepted(departament_id)
    } else if (count_checked == 1) {
        if (this_state.attr('is_checked') == 'true') {
            $(".grid-cell-gb.ok").each(function () {
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('ko')
            })
            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')
            fullCalendar()
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showAccepted(departament_id)
        }
    } else {
        if (this_state.attr('is_checked') == 'true') {
            $(".grid-cell-gb.ok").each(function () {
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('ko')
            })
            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')

            if ($('.filter-pending').attr('is_checked') == 'true') {
                showPending(departament_id)
            }

            if ($('.filter-repeated').attr('is_checked') == 'true') {
                showRepeated(departament_id)
            }

            if ($('.filter-other').attr('is_checked') == 'true') {
                showOther(departament_id)
            }

            if ($('.filter-lastyear').attr('is_checked') == 'true') {
                showLastyear(departament_id)
            }
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showAccepted(departament_id)
        }
    }
})
// Que se vean las vacaciones que están aceptadas MENSUAL
$(document).on('click', '.filter-accepted-m', function () {
    $('.user-item').each(function () {
        $(this).css('background-color', '#f7f7f7')
    })
    $('.info-user-m').each(function () {
        $(this).attr('is_checked', 'false')
    })

    $('.filter-pending-m').attr('is_checked', 'false')
    $('.filter-pending-m').css('background-color', '#f7f7f7')
    $('.filter-other-m').attr('is_checked', 'false')
    $('.filter-other-m').css('background-color', '#f7f7f7')
    $('.filter-lastyear-m').attr('is_checked', 'false')
    $('.filter-lastyear-m').css('background-color', '#f7f7f7')

    $(this).removeClass('active')
    let this_state = $(this)
    let count_checked = 0
    let departament_id = $('.master-dept').val()


    if ($('.filter-accepted-m').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-pending-m').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-other-m').attr('is_checked') == 'true') {
        count_checked++
    }
    if (count_checked == 0) {
        $(".grid-cell-gb-month.okm").each(function () {
            $(this).find('.abs-user').html('')
            $(this).find('.abs-user').css('background-color', '#f7f7f7')
            $(this).css('background-color', '#f7f7f7')
            $(this).find('.abs-user').css('border-radius', '0px')
            $(this).find('.abs-user').css('margin', '0px')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('showing-other')
            $(this).removeClass('ko')
        })
        $(this).attr('is_checked', 'true')
        $(this).css('background-color', '#E0FFD4')
        showAcceptedMonth(departament_id)
    } else if (count_checked == 1) {
        if (this_state.attr('is_checked') == 'true') {
            $(".abs-user").each(function () {
                $(this).html('')
                $(this).css('background-color', '#f7f7f7')
                $(this).css('border-radius', '0px')
                $(this).css('margin', '0px')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('ko')
            })
            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')
            fullCalendarMonth()
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showAcceptedMonth(departament_id)
        }
    }
})

// Que se vean las vacaciones que están pendientes ANUAL
$(document).on('click', '.filter-pending', function () {
    $('.user-item').each(function () {
        $(this).css('background-color', '#f7f7f7')
    })
    $('.info-user').each(function () {
        $(this).attr('is_checked', 'false')
    })

    $(this).removeClass('active')
    let this_state = $(this)
    let count_checked = 0
    let departament_id = $('.master-dept').val()

    if ($('.filter-pending').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-repeated').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-accepted').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-other').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-lastyear').attr('is_checked') == 'true') {
        count_checked++
    }

    if (count_checked == 0) {
        $(".grid-cell-gb.ok").each(function () {
            $(this).css('background-color', '#f7f7f7')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('showing-other')
            $(this).removeClass('ko')
        })
        $(this).attr('is_checked', 'true')
        $(this).css('background-color', '#E0FFD4')
        showPending(departament_id)
    } else if (count_checked == 1) {
        if (this_state.attr('is_checked') == 'true') {
            $(".grid-cell-gb.ok").each(function () {
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('ko')
            })
            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')
            fullCalendar()
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showPending(departament_id)
        }
    } else {
        if (this_state.attr('is_checked') == 'true') {
            $(".grid-cell-gb.ok").each(function () {
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('ko')
            })

            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')

            if ($('.filter-accepted').attr('is_checked') == 'true') {
                showAccepted(departament_id)
            }

            if ($('.filter-repeated').attr('is_checked') == 'true') {
                showRepeated(departament_id)
            }

            if ($('.filter-other').attr('is_checked') == 'true') {
                showOther(departament_id)
            }

            if ($('.filter-lastyear').attr('is_checked') == 'true') {
                showLastyear(departament_id)
            }
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showPending(departament_id)
        }
    }
})
// Que se vean las vacaciones que están pendientes MENSUAL
$(document).on('click', '.filter-pending-m', function () {
    $('.user-item').each(function () {
        $(this).css('background-color', '#f7f7f7')
    })
    $('.info-user-m').each(function () {
        $(this).attr('is_checked', 'false')
    })

    $('.filter-accepted-m').attr('is_checked', 'false')
    $('.filter-accepted-m').css('background-color', '#f7f7f7')
    $('.filter-other-m').attr('is_checked', 'false')
    $('.filter-other-m').css('background-color', '#f7f7f7')
    $('.filter-lastyear-m').attr('is_checked', 'false')
    $('.filter-lastyear-m').css('background-color', '#f7f7f7')

    $(this).removeClass('active')
    let this_state = $(this)
    let count_checked = 0
    let departament_id = $('.master-dept').val()

    if ($('.filter-accepted-m').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-pending-m').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-other-m').attr('is_checked') == 'true') {
        count_checked++
    }
    if (count_checked == 0) {
        $(".grid-cell-gb-month.okm").each(function () {
            $(this).find('.abs-user').html('')
            $(this).find('.abs-user').css('background-color', '#f7f7f7')
            $(this).find('.abs-user').css('border-radius', '0px')
            $(this).find('.abs-user').css('margin', '0px')
            $(this).css('background-color', '#f7f7f7')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('showing-other')
            $(this).removeClass('ko')
        })
        $(this).attr('is_checked', 'true')
        $(this).css('background-color', '#E0FFD4')
        showPendingMonth(departament_id)
    } else if (count_checked == 1) {
        if (this_state.attr('is_checked') == 'true') {
            $(".abs-user").each(function () {
                $(this).html('')
                $(this).css('background-color', '#f7f7f7')
                $(this).css('border-radius', '0px')
                $(this).css('margin', '0px')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('ko')
            })
            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')
            fullCalendarMonth()
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showPendingMonth(departament_id)
        }
    }
})

// Que se vean las vacaciones atrasadas ANUAL
$(document).on('click', '.filter-lastyear', function () {
    $('.user-item').each(function () {
        $(this).css('background-color', '#f7f7f7')
    })
    $('.info-user').each(function () {
        $(this).attr('is_checked', 'false')
    })

    $(this).removeClass('active')
    let this_state = $(this)
    let count_checked = 0
    let departament_id = $('.master-dept').val()

    if ($('.filter-pending').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-repeated').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-accepted').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-other').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-lastyear').attr('is_checked') == 'true') {
        count_checked++
    }

    if (count_checked == 0) {
        $(".grid-cell-gb.ok").each(function () {
            $(this).css('background-color', '#f7f7f7')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('showing-other')
            $(this).removeClass('showing-lastyear')
            $(this).removeClass('ko')
        })
        $(this).attr('is_checked', 'true')
        $(this).css('background-color', '#E0FFD4')
        showLastyear(departament_id)
    } else if (count_checked == 1) {
        if (this_state.attr('is_checked') == 'true') {
            $(".grid-cell-gb.ok").each(function () {
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('showing-lastyear')
                $(this).removeClass('ko')
            })
            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')
            fullCalendar()
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showLastyear(departament_id)
        }
    } else {
        if (this_state.attr('is_checked') == 'true') {
            $(".grid-cell-gb.ok").each(function () {
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('showing-lastyear')
                $(this).removeClass('ko')
            })

            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')

            if ($('.filter-accepted').attr('is_checked') == 'true') {
                showAccepted(departament_id)
            }

            if ($('.filter-repeated').attr('is_checked') == 'true') {
                showRepeated(departament_id)
            }

            if ($('.filter-other').attr('is_checked') == 'true') {
                showOther(departament_id)
            }

            if ($('.filter-pending').attr('is_checked') == 'true') {
                showPending(departament_id)
            }
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showLastyear(departament_id)
        }
    }
})

// Que se vean las vacaciones atrasadas MENSUAL
$(document).on('click', '.filter-lastyear-m', function () {
    $('.user-item').each(function () {
        $(this).css('background-color', '#f7f7f7')
    })
    $('.info-user-m').each(function () {
        $(this).attr('is_checked', 'false')
    })

    $('.filter-accepted-m').attr('is_checked', 'false')
    $('.filter-accepted-m').css('background-color', '#f7f7f7')
    $('.filter-pending-m').attr('is_checked', 'false')
    $('.filter-pending-m').css('background-color', '#f7f7f7')
    $('.filter-other-m').attr('is_checked', 'false')
    $('.filter-other-m').css('background-color', '#f7f7f7')

    $(this).removeClass('active')
    let this_state = $(this)
    let count_checked = 0
    let departament_id = $('.master-dept').val()


    if ($('.filter-accepted-m').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-pending-m').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-other-m').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-lastyear-m').attr('is_checked') == 'true') {
        count_checked++
    }

    if (count_checked == 0) {
        $(".grid-cell-gb-month.okm").each(function () {
            $(this).find('.abs-user').html('')
            $(this).find('.abs-user').css('background-color', '#f7f7f7')
            $(this).css('background-color', '#f7f7f7')
            $(this).find('.abs-user').css('border-radius', '0px')
            $(this).find('.abs-user').css('margin', '0px')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('showing-other')
            $(this).removeClass('showing-lastyear')
            $(this).removeClass('ko')
        })
        $(this).attr('is_checked', 'true')
        $(this).css('background-color', '#E0FFD4')
        showLastyearMonth(departament_id)
    } else if (count_checked == 1) {
        if (this_state.attr('is_checked') == 'true') {
            $(".abs-user").each(function () {
                $(this).html('')
                $(this).css('background-color', '#f7f7f7')
                $(this).css('border-radius', '0px')
                $(this).css('margin', '0px')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-other')
                $(this).removeClass('showing-lastyear')
                $(this).removeClass('ko')
            })
            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')
            fullCalendarMonth()
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showLastyearMonth(departament_id)
        }
    }
})

// Que se vean las vacaciones que están solapadas ANUAL
$(document).on('click', '.filter-repeated', function () {
    $('.user-item').each(function () {
        $(this).css('background-color', '#f7f7f7')
    })
    $('.info-user').each(function () {
        $(this).attr('is_checked', 'false')
    })

    let this_state = $(this)
    let count_checked = 0
    let departament_id = $('.master-dept').val()

    if ($('.filter-pending').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-repeated').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-accepted').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-other').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-lastyear').attr('is_checked') == 'true') {
        count_checked++
    }

    if (count_checked == 0) {
        $(".grid-cell-gb.ok").each(function () {
            $(this).css('background-color', '#f7f7f7')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('showing-other')
            $(this).removeClass('ko')
        })
        $(this).attr('is_checked', 'true')
        $(this).css('background-color', '#E0FFD4')
        showRepeated(departament_id)
    } else if (count_checked == 1) {
        if (this_state.attr('is_checked') == 'true') {
            $(".grid-cell-gb.ok").each(function () {
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('ko')
            })
            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')
            fullCalendar()
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showRepeated(departament_id)
        }
    } else {
        if (this_state.attr('is_checked') == 'true') {
            $(".grid-cell-gb.ok").each(function () {
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('ko')
            })

            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')

            if ($('.filter-accepted').attr('is_checked') == 'true') {
                showAccepted(departament_id)
            }

            if ($('.filter-pending').attr('is_checked') == 'true') {
                showPending(departament_id)
            }

            if ($('.filter-other').attr('is_checked') == 'true') {
                showOther(departament_id)
            }

            if ($('.filter-lastyear').attr('is_checked') == 'true') {
                showLastyear(departament_id)
            }
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showRepeated(departament_id)
        }
    }
})

// Que se vean las enfermedades/otros ANUAL
$(document).on('click', '.filter-other', function () {
    $('.user-item').each(function () {
        $(this).css('background-color', '#f7f7f7')
    })
    $('.info-user').each(function () {
        $(this).attr('is_checked', 'false')
    })

    let this_state = $(this)
    let count_checked = 0
    let departament_id = $('.master-dept').val()

    if ($('.filter-pending').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-repeated').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-accepted').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-other').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-lastyear').attr('is_checked') == 'true') {
        count_checked++
    }

    if (count_checked == 0) {
        $(".grid-cell-gb.ok").each(function () {
            $(this).css('background-color', '#f7f7f7')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).attr('type', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('showing-other')
            $(this).removeClass('ko')
        })
        $(this).attr('is_checked', 'true')
        $(this).css('background-color', '#E0FFD4')
        showOther(departament_id)
    } else if (count_checked == 1) {
        if (this_state.attr('is_checked') == 'true') {
            $(".grid-cell-gb.ok").each(function () {
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).attr('type', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('ko')
            })
            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')
            fullCalendar()
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showOther(departament_id)
        }
    } else {
        if (this_state.attr('is_checked') == 'true') {
            $(".grid-cell-gb.ok").each(function () {
                $(this).css('background-color', '#f7f7f7')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('type', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('showing-other')
                $(this).removeClass('ko')
            })

            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')

            if ($('.filter-accepted').attr('is_checked') == 'true') {
                showAccepted(departament_id)
            }

            if ($('.filter-pending').attr('is_checked') == 'true') {
                showPending(departament_id)
            }

            if ($('.filter-repeated').attr('is_checked') == 'true') {
                showRepeated(departament_id)
            }

            if ($('.filter-lastyear').attr('is_checked') == 'true') {
                showLastyear(departament_id)
            }
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showOther(departament_id)
        }
    }
})
// Que se vean las enfermedades/otros MENSUAL
$(document).on('click', '.filter-other-m', function () {
    $('.user-item').each(function () {
        $(this).css('background-color', '#f7f7f7')
    })
    $('.info-user-m').each(function () {
        $(this).attr('is_checked', 'false')
    })

    $('.filter-pending-m').attr('is_checked', 'false')
    $('.filter-pending-m').css('background-color', '#f7f7f7')
    $('.filter-accepted-m').attr('is_checked', 'false')
    $('.filter-accepted-m').css('background-color', '#f7f7f7')
    $('.filter-lastyear-m').attr('is_checked', 'false')
    $('.filter-lastyear-m').css('background-color', '#f7f7f7')

    $(this).removeClass('active')
    let this_state = $(this)
    let count_checked = 0
    let departament_id = $('.master-dept').val()

    if ($('.filter-accepted-m').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-pending-m').attr('is_checked') == 'true') {
        count_checked++
    }

    if ($('.filter-other-m').attr('is_checked') == 'true') {
        count_checked++
    }
    if (count_checked == 0) {
        $(".grid-cell-gb-month.okm").each(function () {
            $(this).find('.abs-user').html('')
            $(this).find('.abs-user').css('background-color', '#f7f7f7')
            $(this).css('border-radius', '0px')
            $(this).find('.abs-user').css('margin', '0px')
            $(this).find('.abs-user').css('background-color', '#f7f7f7')
            $(this).attr('user', '')
            $(this).attr('dept', '')
            $(this).attr('absence', '')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-pending')
            $(this).removeClass('showing-repeated')
            $(this).removeClass('showing-other')
            $(this).removeClass('ko')
        })
        $(this).attr('is_checked', 'true')
        $(this).css('background-color', '#E0FFD4')
        showOtherMonth(departament_id)
    } else if (count_checked == 1) {
        if (this_state.attr('is_checked') == 'true') {
            $(".abs-user").each(function () {
                $(this).html('')
                $(this).css('background-color', '#f7f7f7')
                $(this).css('border-radius', '0px')
                $(this).css('margin', '0px')
                $(this).attr('user', '')
                $(this).attr('dept', '')
                $(this).attr('absence', '')
                $(this).removeClass('showing-accepted')
                $(this).removeClass('showing-pending')
                $(this).removeClass('showing-repeated')
                $(this).removeClass('ko')
            })
            $(this).attr('is_checked', 'false')
            $(this).css('background-color', '#f7f7f7')
            fullCalendarMonth()
        } else {
            $(this).attr('is_checked', 'true')
            $(this).css('background-color', '#E0FFD4')
            showOtherMonth(departament_id)
        }
    }
})

// Redimensionar el select de tipo de ausencia 
if (($('.this-manager').val() == $('.user_id').val()) || ($('.user_id').val() == 18) || ($('.user_id').val() == 64) || ($('.user_id').val() == 45) || ($('.user_id').val() == 51)) {
    $('.absence_type_container').removeClass('col-12')
    $('.absence_type_container').addClass('col-6')
}

// Calendario MENSUAL
function moreInfo() {
    // Ver los detalles de un mes concreto
    $(".more-info").click(function () {
        let month = $(this).attr('month')
        selected_month = parseInt(month);
        if (month < 10) {
            var month_0 = '0' + month
        } else {
            month_0 = month
        }
        let year = $(this).attr('year')
        selected_year = parseInt(year);

        $(".calendar-row").each(function () {
            $(this).hide()
        })

        $(".month-preview").each(function () {
            $(this).show()
            $(this).attr('month', month)
            $(this).attr('year', year)
            $(this).attr('id', year + '-' + month_0)
            let preview = $(this).attr('id')
            getCalendarMonth(preview)
        })

        // Volver al calendario anual
        $(".back-calendar").click(function () {
            $(".month-preview").each(function () {
                $(this).hide()
            })

            $(".calendar-row").each(function () {
                $(this).show()
            })

            $('.filter-accepted-m').removeClass('filter-accepted-m').addClass('filter-accepted')
            $('.filter-pending-m').removeClass('filter-pending-m').addClass('filter-pending')
            $('.filter-repeated-m').removeClass('filter-repeated-m').addClass('filter-repeated')
            $('.filter-other-m').removeClass('filter-other-m').addClass('filter-other')
            $('.filter-lastyear-m').removeClass('filter-lastyear-m').addClass('filter-lastyear')
            $('.info-user-m').removeClass('info-user-m').addClass('info-user')
            $('.info-dept-m').removeClass('info-dept-m').addClass('info-dept')

            $(".filter-accepted").attr('is_checked', 'false')
            $(".filter-accepted").css('background-color', '#f7f7f7')
            $(".filter-pending").attr('is_checked', 'false')
            $(".filter-pending").css('background-color', '#f7f7f7')
            $(".filter-repeated").attr('is_checked', 'false')
            $(".filter-repeated").css('background-color', '#f7f7f7')
            $(".filter-other").attr('is_checked', 'false')
            $(".filter-other").css('background-color', '#f7f7f7')
            $(".filter-lastyear").attr('is_checked', 'false')
            $(".filter-lastyear").css('background-color', '#f7f7f7')
            $('.filter-repeated').addClass('d-flex')
            $(".filter-repeated").css('display', 'block')
            $('.info-user').attr('is_checked', 'false')
            $('.user-item').css('background-color', '#f7f7f7')
            $('.add-year').css('visibility', 'visible')
            $('.subtract-year').css('visibility', 'visible')

            getCalendar()
            moreInfo()
            fullCalendar()
        })
    })
}
moreInfo()

// Colorear festivos
function festivos() {
    var fest1 = (moment('2022-01-01', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest2 = (moment('2022-01-06', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest3 = (moment('2022-02-28', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest4 = (moment('2022-04-14', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest5 = (moment('2022-04-15', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest6 = (moment('2022-05-01', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest7 = (moment('2022-05-02', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest8 = (moment('2022-08-15', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest9 = (moment('2022-10-12', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest10 = (moment('2022-11-01', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest11 = (moment('2022-12-06', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest12 = (moment('2022-12-08', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest13 = (moment('2022-12-25', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()
    var fest14 = (moment('2022-12-26', 'YYYY-MM-DD').format('YYYY-MM-DD')).toString()

    var fest15 = ((moment('2023-01-02', 'YYYY-MM-DD')).format('YYYY-MM-DD')).toString()
    var fest16 = ((moment('2023-01-06', 'YYYY-MM-DD')).format('YYYY-MM-DD')).toString()
    var fest17 = ((moment('2023-02-28', 'YYYY-MM-DD')).format('YYYY-MM-DD')).toString()
    var fest18 = ((moment('2023-04-06', 'YYYY-MM-DD')).format('YYYY-MM-DD')).toString()
    var fest19 = ((moment('2023-04-07', 'YYYY-MM-DD')).format('YYYY-MM-DD')).toString()
    var fest20 = ((moment('2023-05-01', 'YYYY-MM-DD')).format('YYYY-MM-DD')).toString()
    var fest22 = ((moment('2023-08-15', 'YYYY-MM-DD')).format('YYYY-MM-DD')).toString()
    var fest23 = ((moment('2023-10-12', 'YYYY-MM-DD')).format('YYYY-MM-DD')).toString()
    var fest24 = ((moment('2023-11-01', 'YYYY-MM-DD')).format('YYYY-MM-DD')).toString()
    var fest25 = ((moment('2023-12-06', 'YYYY-MM-DD')).format('YYYY-MM-DD')).toString()
    var fest26 = ((moment('2023-12-08', 'YYYY-MM-DD')).format('YYYY-MM-DD')).toString()
    var fest27 = ((moment('2023-12-25', 'YYYY-MM-DD')).format('YYYY-MM-DD')).toString()

    $('.grid-cell-gb.ok').each(function () {
        var date = moment($(this).attr('date'))
        if ($(this).attr('date') == fest1 || $(this).attr('date') == fest2 || $(this).attr('date') == fest3 || $(this).attr('date') == fest4 || $(this).attr('date') == fest5 || $(this).attr('date') == fest6 || $(this).attr('date') == fest7 || $(this).attr('date') == fest8 || $(this).attr('date') == fest9 || $(this).attr('date') == fest10 || $(this).attr('date') == fest11 || $(this).attr('date') == fest12 || $(this).attr('date') == fest13 || $(this).attr('date') == fest14 || $(this).attr('date') == fest15 || $(this).attr('date') == fest16 || $(this).attr('date') == fest17 || $(this).attr('date') == fest18 || $(this).attr('date') == fest19 || $(this).attr('date') == fest20 || $(this).attr('date') == fest22 || $(this).attr('date') == fest23 || $(this).attr('date') == fest24 || $(this).attr('date') == fest25 || $(this).attr('date') == fest26 || $(this).attr('date') == fest27) {
            $(this).css('background-color', '#55d9c3')
            $(this).css('border-radius', '0px')
            $(this).removeClass('showing-accepted')
            $(this).removeClass('showing-other')
            $(this).removeClass('showing-pending')
            // $(this).attr('user', '')
        }

        // if (date.format('dddd') == 'Saturday' || date.format('dddd') == 'Sunday') {
        //     $(this).css('border-radius', '0px')
        //     $(this).css('background-color', '#f0f0f0')
        //     $(this).removeClass('showing-accepted')
        //     $(this).removeClass('showing-other')
        //     $(this).removeClass('showing-pending')
        //     $(this).attr('user', '')
        // }
    })
    $('.grid-cell-gb-month.okm').each(function () {
        var date = moment($(this).attr('date'))
        if ($(this).attr('date') == fest1 || $(this).attr('date') == fest2 || $(this).attr('date') == fest3 || $(this).attr('date') == fest4 || $(this).attr('date') == fest5 || $(this).attr('date') == fest6 || $(this).attr('date') == fest7 || $(this).attr('date') == fest8 || $(this).attr('date') == fest9 || $(this).attr('date') == fest10 || $(this).attr('date') == fest11 || $(this).attr('date') == fest12 || $(this).attr('date') == fest13 || $(this).attr('date') == fest14 || $(this).attr('date') == fest15 || $(this).attr('date') == fest16 || $(this).attr('date') == fest17 || $(this).attr('date') == fest18 || $(this).attr('date') == fest19 || $(this).attr('date') == fest20 || $(this).attr('date') == fest22 || $(this).attr('date') == fest23 || $(this).attr('date') == fest24 || $(this).attr('date') == fest25 || $(this).attr('date') == fest26 || $(this).attr('date') == fest27) {
            $(this).find('.abs-user').html('')
            $(this).find('.abs-user').removeClass('showing-accepted')
            $(this).find('.abs-user').removeClass('showing-other')
            $(this).find('.abs-user').removeClass('showing-pending')
            $(this).find('.abs-user[position=3]').html('FESTIVO')
            $(this).find('.abs-user[position=3]').css('text-align', 'center')
            $(this).find('.abs-user[position=3]').css('font-weight', 'bold')
            $(this).find('.abs-user').css('background-color', '#55d9c3')
            $(this).css('background-color', '#55d9c3')
            $(this).css('border-radius', '5px')
        }

        // if (date.format('dddd') == 'Saturday' || date.format('dddd') == 'Sunday') {
        //     $(this).find('.abs-user').html('')
        //     $(this).find('.abs-user').removeClass('showing-accepted')
        //     $(this).find('.abs-user').removeClass('showing-other')
        //     $(this).find('.abs-user').removeClass('showing-pending')
        //     $(this).find('.abs-user').css('background-color', '#f0f0f0')
        //     $(this).css('background-color', '#f0f0f0')
        // }
    })
}