////// MINI CALENDARIO //////
// Creamos una clase para el calendario. Va a contener todos los datos del calendario que se muestra.
date = new Date();
today_day = moment(date).format('DD')
today_month = moment(date).format('M')
today_year = moment(date).format('YYYY')
user_id = $('.cal-id_u').val();
first_name = $('.cd-first_name').val();
last_name = $('.cd-last_name').val();


class Calendar {
    constructor(id, numero) {
        this.cells=[];
        this.vacations = new Array(numero.length);

        for (let i = 0; i < numero.length; i++) {
            this.vacations[i]=numero[i];
        }

        this.months = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        this.selectedDate = moment();
        this.currentMonth = moment();
        this.mini_calendar = document.getElementById(id);
        this.showTemplate();
        this.gridBody = this.mini_calendar.querySelector('.grid_body');
        this.monthName = this.mini_calendar.querySelector('.month_name'); 
        this.showCells();
    }

    // Mostramos la estructura del calendario
    showTemplate() {
        this.mini_calendar.innerHTML = this.getTemplate();
        this.addEventListenerToControls();
    }

    // Genera la estructura del Mini Calendario.
    getTemplate() {
        let template = `
        <div class="calendar_header">
            <button type="button" class="control control_prev">&lt;</button>
            <span class="month_name"></span>
            <button type="button" class="control control_next">&gt;</button>
        </div>
        <div class="calendar_body">
            <div class="grid">
                <div class="grid_header">
                    <span class="grid_cell grid_cell_gh">Lun</span>
                    <span class="grid_cell grid_cell_gh">Mar</span>
                    <span class="grid_cell grid_cell_gh">Mié</span>
                    <span class="grid_cell grid_cell_gh">Jue</span>
                    <span class="grid_cell grid_cell_gh">Vie</span>
                    <span class="grid_cell grid_cell_gh">Sáb</span>
                    <span class="grid_cell grid_cell_gh">Dom</span>
                </div>
                <div class="grid_body">
                    
                </div>
            </div>
        </div>`;
        return template;
    };

    // Comprobar que botón se pulsa
    addEventListenerToControls() {
        let controls = this.mini_calendar.querySelectorAll('.control');
        controls.forEach(control => {
            control.addEventListener('click', e => {
                let target = e.target;
                if (target.classList.contains('control_next')) {
                    this.changeMonth(true);
                } else {
                    this.changeMonth(false);
                }
                this.showCells();
            });
        });
    }

    // Cambiar de mes con los botones.
    changeMonth(next = true) {
        if (next) {
            this.currentMonth.add(1, 'months');
        } else {
            this.currentMonth.subtract(1, 'months');
        }
    }

    // Mostramos las celdas en función de la clase que tienen.
    showCells() {
        this.cells = this.generateDates(this.currentMonth);

        if (this.cells === null) {
            return toastr.error('No ha sido posible generar los días de este mes', 'Error');
        }

        // Establecemos las variables que vamos a usar
        this.gridBody.innerHTML = '';
        let templateCells = '';
        let disableCells = '';
        var start_vacations = [];
        var finish_vacations = [];
        var start_event = [];
        var finish_event = [];
        var start_task = [];
        var finish_task = [];
        var start_reminder = [];
        var finish_reminder = [];
        var names_vacations = [];
        var surnames_vacations = [];
        var names_event = [];
        var surnames_event = [];
        var names_task = [];
        var surnames_task = [];
        var names_reminder = [];
        var surnames_reminder = [];
        
        // Almacenamos en los arrays creados las fechas en las que empiezan y acaban los datos del calendario ÚNICAMENTE DEL MES QUE MUESTRA EL CALENDARIO
        for (let x = 0; x < this.vacations.length; x++) {
            if (this.vacations[x].date_type == 'holidays') {
                var start_h = ((this.vacations[x].start_date));
                var finish_h = ((this.vacations[x].finish_date));
                var first_name_h = ((this.vacations[x].first_name));
                var last_name_h = ((this.vacations[x].last_name));
                if ((start_h.split('-')[1] == this.currentMonth.month()+1) && (start_h.split('-')[0] == this.currentMonth.year())) {
                    start_vacations.push(start_h)
                    finish_vacations.push(finish_h)
                    names_vacations.push(first_name_h) 
                    surnames_vacations.push(last_name_h)       
                } else if ((finish_h.split('-')[1] == this.currentMonth.month()+1) && (start_h.split('-')[0] == this.currentMonth.year())) {
                    start_vacations.push(this.currentMonth.startOf('month').format('YYYY-MM-DD'))
                    finish_vacations.push(finish_h)
                    names_vacations.push(first_name_h) 
                    surnames_vacations.push(last_name_h) 
                }
            } else if (this.vacations[x].date_type == 'event') {
                var start_e = ((this.vacations[x].start_date));
                var finish_e = ((this.vacations[x].finish_date));
                var first_name_e = ((this.vacations[x].first_name));
                var last_name_e = ((this.vacations[x].last_name));
                if ((start_e.split('-')[1] == this.currentMonth.month()+1) && (start_e.split('-')[0] == this.currentMonth.year())) {
                    start_event.push(start_e)
                    finish_event.push(finish_e)
                    names_event.push(first_name_e) 
                    surnames_event.push(last_name_e) 
                } else if ((finish_e.split('-')[1] == this.currentMonth.month()+1) && (start_e.split('-')[0] == this.currentMonth.year())) {
                    start_event.push(this.currentMonth.startOf('month').format('YYYY-MM-DD'))
                    finish_event.push(finish_e)
                    names_event.push(first_name_e) 
                    surnames_event.push(last_name_e)  
                    
                }
            } else if (this.vacations[x].date_type == 'task') {
                var start_t = ((this.vacations[x].start_date));
                var finish_t = ((this.vacations[x].finish_date));
                var first_name_t = ((this.vacations[x].first_name));
                var last_name_t = ((this.vacations[x].last_name));
                if ((start_t.split('-')[1] == this.currentMonth.month()+1) && (start_t.split('-')[0] == this.currentMonth.year())) {
                    start_task.push(start_t)
                    finish_task.push(finish_t)
                    names_task.push(first_name_t) 
                    surnames_task.push(last_name_t)
                } else if ((finish_t.split('-')[1] == this.currentMonth.month()+1) && (start_t.split('-')[0] == this.currentMonth.year())) {
                    start_task.push(this.currentMonth.startOf('month').format('YYYY-MM-DD'))
                    finish_task.push(finish_t)
                    names_task.push(first_name_t) 
                    surnames_task.push(last_name_t)
                }
            } else if (this.vacations[x].date_type == 'reminder') {
                var start_r = ((this.vacations[x].start_date));
                var finish_r = ((this.vacations[x].finish_date));
                var first_name_r = ((this.vacations[x].first_name));
                var last_name_r = ((this.vacations[x].last_name));
                if ((start_r.split('-')[1] == this.currentMonth.month()+1) && (start_r.split('-')[0] == this.currentMonth.year())) {
                    start_reminder.push(start_r)
                    finish_reminder.push(finish_r)
                    names_reminder.push(first_name_r) 
                    surnames_reminder.push(last_name_r)
                } else if ((finish_r.split('-')[1] == this.currentMonth.month()+1) && (start_r.split('-')[0] == this.currentMonth.year())) {
                    start_reminder.push(this.currentMonth.startOf('month').format('YYYY-MM-DD'))
                    finish_reminder.push(finish_r)
                    names_reminder.push(first_name_r) 
                    surnames_reminder.push(last_name_r)
                }
            }
        }

        for (let i = 0; i < this.cells.length; i++) {
            disableCells = '';

            // Si esa posición de la cuadrícula pertenece al mes actual...
            if (this.cells[i].isInCurrentMonth) {

                //Si hay vacaciones en ese mes...
                if(start_vacations.length > 0) {
                    for (let y = 0; y < start_vacations.length; y++) {
                        // Si el día coincide con dia, mes y año de un elemento en la lista de vacaciones...
                        if ((this.cells[i].date.date() == start_vacations[y].split('-')[2]) && (this.currentMonth.month()+1 == start_vacations[y].split('-')[1]) && (this.currentMonth.year() == start_vacations[y].split('-')[0])) {
                            let start_d = start_vacations[y].split('-')[2]
                            let finish_d = finish_vacations[y].split('-')[2]
                            let start_m = start_vacations[y].split('-')[1]
                            let finish_m = finish_vacations[y].split('-')[1]
                            let name_h = names_vacations[y]
                            let surname_h = surnames_vacations[y]
                            // Vacaciones que tienen tramos en dos meses distintos
                            if (start_m == finish_m) {
                                while (start_d <= finish_d) {
                                    templateCells += `<a style="color: #1c2636;" data-toggle="modal" data-target="#VacationModal" class="prof-modal-trigger" href="#"><span data-title="${name_h+" "+surname_h}" class="grid_cell grid_cell_gb grid_cell_holidays" data-id="${this.cells[i].date.date()}">${this.cells[i].date.date()}</span></a>`;
                                    start_d = start_d+++1
                                    i++
                                }
                            } else {
                                while (this.cells[i].isInCurrentMonth) {
                                    templateCells += `<a style="color: #1c2636;" data-toggle="modal" data-target="#VacationModal" class="prof-modal-trigger" href="#"><span data-title="${name_h+" "+surname_h}" class="grid_cell grid_cell_gb grid_cell_holidays" data-id="${this.cells[i].date.date()}">${this.cells[i].date.date()}</span></a>`;
                                    i++
                                }
                            }
                        }
                    }
                }

                //Si hay eventos en ese mes...
                if(start_event.length > 0) {
                    for (let y = 0; y < start_event.length; y++) {
                        // Si el día coincide con dia, mes y año de un elemento en la lista de vacaciones...
                        if ((this.cells[i].date.date() == start_event[y].split('-')[2]) && (this.currentMonth.month()+1 == start_event[y].split('-')[1]) && (this.currentMonth.year() == start_event[y].split('-')[0])) {
                            let start_d = start_event[y].split('-')[2]
                            let finish_d = finish_event[y].split('-')[2]
                            let start_m = start_event[y].split('-')[1]
                            let finish_m = finish_event[y].split('-')[1]
                            let name_e = names_event[y]
                            let surname_e = surnames_event[y]
                            // Vacaciones que tienen tramos en dos meses distintos
                            if (start_m == finish_m) {
                                while (start_d <= finish_d) {
                                    templateCells += `<a style="color: #1c2636;" data-toggle="modal" data-target="#VacationModal" class="prof-modal-trigger" href="#"><span data-title="${name_e+" "+surname_e}" class="grid_cell grid_cell_gb grid_cell_event" data-id="${this.cells[i].date.date()}">${this.cells[i].date.date()}</span></a>`;
                                    start_d = start_d+++1
                                    i++
                                }
                            } else {
                                while (this.cells[i].isInCurrentMonth) {
                                    templateCells += `<a style="color: #1c2636;" data-toggle="modal" data-target="#VacationModal" class="prof-modal-trigger" href="#"><span data-title="${name_e+" "+surname_e}" class="grid_cell grid_cell_gb grid_cell_event" data-id="${this.cells[i].date.date()}">${this.cells[i].date.date()}</span></a>`;
                                    i++
                                }
                            }
                        }
                    }
                }

                //Si hay tareas en ese mes...
                if(start_task.length > 0) {
                    for (let y = 0; y < start_task.length; y++) {
                        // Si el día coincide con dia, mes y año de un elemento en la lista de vacaciones...
                        if ((this.cells[i].date.date() == start_task[y].split('-')[2]) && (this.currentMonth.month()+1 == start_task[y].split('-')[1]) && (this.currentMonth.year() == start_task[y].split('-')[0])) {
                            let start_d = start_task[y].split('-')[2]
                            let finish_d = finish_task[y].split('-')[2]
                            let start_m = start_task[y].split('-')[1]
                            let finish_m = finish_task[y].split('-')[1]
                            let name_t = names_task[y]
                            let surname_t = surnames_task[y]
                            // Vacaciones que tienen tramos en dos meses distintos
                            if (start_m == finish_m) {
                                while (start_d <= finish_d) {
                                    templateCells += `<a style="color: #1c2636;" data-toggle="modal" data-target="#VacationModal" class="prof-modal-trigger" href="#"><span data-title="${name_t+" "+surname_t}" class="grid_cell grid_cell_gb grid_cell_task" data-id="${this.cells[i].date.date()}">${this.cells[i].date.date()}</span></a>`;
                                    start_d = start_d+++1
                                    i++
                                }
                            } else {
                                while (this.cells[i].isInCurrentMonth) {
                                    templateCells += `<a style="color: #1c2636;" data-toggle="modal" data-target="#VacationModal" class="prof-modal-trigger" href="#"><span data-title="${name_t+" "+surname_t}" class="grid_cell grid_cell_gb grid_cell_task" data-id="${this.cells[i].date.date()}">${this.cells[i].date.date()}</span></a>`;
                                    i++
                                }
                            }
                        }
                    }
                }

                //Si hay recordatorios en ese mes...
                if(start_reminder.length > 0) {
                    for (let y = 0; y < start_reminder.length; y++) {
                        // Si el día coincide con dia, mes y año de un elemento en la lista de vacaciones...
                        if ((this.cells[i].date.date() == start_reminder[y].split('-')[2]) && (this.currentMonth.month()+1 == start_reminder[y].split('-')[1]) && (this.currentMonth.year() == start_reminder[y].split('-')[0])) {
                            let start_d = start_reminder[y].split('-')[2]
                            let finish_d = finish_reminder[y].split('-')[2]
                            let start_m = start_reminder[y].split('-')[1]
                            let finish_m = finish_reminder[y].split('-')[1]
                            let name_r = names_reminder[y]
                            let surname_r = surnames_reminder[y]
                            // Vacaciones que tienen tramos en dos meses distintos
                            if (start_m == finish_m) {
                                while (start_d <= finish_d) {
                                    templateCells += `<a style="color: #1c2636;" data-toggle="modal" data-target="#VacationModal" class="prof-modal-trigger" href="#"><span data-title="${name_r+" "+surname_r}" class="grid_cell grid_cell_gb grid_cell_reminder" data-id="${this.cells[i].date.date()}">${this.cells[i].date.date()}</span></a>`;
                                    start_d = start_d+++1
                                    i++
                                }
                            } else {
                                while (this.cells[i].isInCurrentMonth) {
                                    templateCells += `<a style="color: #1c2636;" data-toggle="modal" data-target="#VacationModal" class="prof-modal-trigger" href="#"><span data-title="${name_r+" "+surname_r}" class="grid_cell grid_cell_gb grid_cell_reminder" data-id="${this.cells[i].date.date()}">${this.cells[i].date.date()}</span></a>`;
                                    i++
                                }
                            }
                        }
                    }
                }
                
                if ((this.cells[i].date.date() == today_day) && (this.currentMonth.month()+1 == today_month) && (this.currentMonth.year() == today_year)) {
                    templateCells += `<a style="color: #1c2636;" data-toggle="modal" data-target="#VacationModal" class="prof-modal-trigger" href="#"><span class="grid_cell grid_cell_gb grid_cell_today" data-id="${this.cells[i].date.date()}">${this.cells[i].date.date()}</span></a>`;
                } else if (this.cells[i].isInCurrentMonth) {
                    templateCells += `<a style="color: #1c2636;" data-toggle="modal" data-target="#VacationModal" class="prof-modal-trigger" href="#"><span class="grid_cell grid_cell_gb" data-id="${this.cells[i].date.date()}">${this.cells[i].date.date()}</span></a>`;
                }
            } else {
                disableCells = 'grid_cell_disable';
                templateCells += `<span class="grid_cell grid_cell_gb ${disableCells}" data-id="${this.cells[i].date.date()}">${this.cells[i].date.date()}</span>`;
            }
        }

        // Mostramos en el título del mini calendario el mes y año actual (En español usamos un array definido en el constructor)
        this.monthName.innerHTML = this.months[this.currentMonth.month()]+this.currentMonth.format(' YYYY');
        this.gridBody.innerHTML = templateCells;
        this.addEventListenerToCells();
    }


    // Generamos datos sobre fechas para usarlos posteriormente.
    generateDates(monthToShow = moment()) {
        if (!moment.isMoment(monthToShow)) {
            return null;
        }
        // Almacenamos en variables el primer y último dia del mes.
        let startMonth = moment(monthToShow).startOf('month');
        let endMonth = moment(monthToShow).endOf('month');
        let cells = [];


        // Primera fecha que muestra el calendario
        while (startMonth.isoWeekday() !== 1) {
            startMonth.subtract(1, 'days');
        }

        // Última fecha que muestra el calendario
        while (endMonth.isoWeekday() !== 7) {
            endMonth.add(1, 'days');
        }

        // Generamos los días que hay entre el primer dia del mes y el último.
        do {
            cells.push({
                date: moment(startMonth),
                isInCurrentMonth: startMonth.month() === monthToShow.month()
            });
            startMonth.add(1, 'days');
        } while (startMonth.isSameOrBefore(endMonth));

        return cells;
    }
    
    // Validaciones para las celdas del calendario
    addEventListenerToCells() {
        let cellInfo = this.mini_calendar.querySelectorAll('.grid_cell_gb');
        cellInfo.forEach(cellInfo => {
            cellInfo.addEventListener('click', e => {
                let target = e.target;
                // Si tiene la clase disable, no puede ser seleccionado. || Si tiene la clase selected, ya está seleccionado. No se sigue seleccionando.
                if (target.classList.contains('grid_cell_disable') || target.classList.contains('grid_cell_today')) {
                    return;
                }
    
                let selectedCell = this.gridBody.querySelector('.grid_cell_today');
                // Si tiene la clase sel, ya hay un elemento seleccionado. Le quitamos la clase sel para que solo haya uno seleccionado.
                if (selectedCell) {
                    selectedCell.classList.remove('grid_cell_today');
                }

                this.selectedDate = this.cells[parseInt(target.dataset.id-1)].date;
                target.classList.add('grid_cell_today');
                this.mini_calendar.dispatchEvent(new Event('change'));
            });
        });
    }

    // Devuelve todo el contenido del mini_calendario.
    getElement() {
        return this.mini_calendar;
    }

    value() {
        return this.selectedDate;
    }
}