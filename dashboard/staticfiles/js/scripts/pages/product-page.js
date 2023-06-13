$('.loading-banner').hide();

// Funcionamiento del menu de acceso a los Formularios

$('.link-list>div>a[active="0"]').attr('style','background-color:#fff;color:#009c9f !important');
$('.link-list>div>a[active="1"]').attr('style','background-color:#009c9f;color:#fff !important');
$('.product-view-forms>div[active="1"]').show();
$('.product-view-forms>div[active="0"]').hide();
$('.link-list').on('click','div',function(e){
    let element = this;
    if($(element).attr('active') == 0){
    //     $(element).attr('active',0)
    //     $(element).children().attr('active',0)
    // }else{
        $(element).attr('active',1)
        $(element).children().attr('active',1)
        let div = $(element).children().attr('triggers');
        $('.product-view-forms>div').each(function(){
            if(!($(this).hasClass(div))){
                $(this).hide();
            }else{
                $(this).show();
            }
            $('.div-view-header').show();
        });
        $('.link-list>div').each(function(){
            if(this != element){
                $(this).attr('active',0)
                $(this).children().attr('active',0)
            }
        })
    }
    
    $('.link-list>div>a[active="0"]').attr('style','background-color:#fff;color:#009c9f !important');
    $('.link-list>div>a[active="1"]').attr('style','background-color:#009c9f;color:#fff !important');
    
});

// Interruptor de activo

$('#info-active').click(function(e){
    if($('#info-not-active').hasClass('btn-danger')){
        $('#info-active').removeClass('btn-outline-success');
        $('#info-active').addClass('btn-success');
        $('#info-not-active').removeClass('btn-danger');
        $('#info-not-active').addClass('btn-outline-danger');
    }
});
$('#info-not-active').click(function(e){
    if($('#info-active').hasClass('btn-success')){
        $('#info-active').removeClass('btn-success');
        $('#info-active').addClass('btn-outline-success');
        $('#info-not-active').removeClass('btn-outline-danger');
        $('#info-not-active').addClass('btn-danger');
    }
});

// Boton guardar de INFORMACION

$('.saveInfo').click(function(){
    let element = this;
    
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/save-product/',
        data: {
            product_id: $('.product-id').val(),
            company_id: $('.company-id').val(),
            type: $('[name=product-type]:checked').val(),
            name: $('#info-name').val(),
            reference : $('#info-ref').val(),
            EAN_13_barcode : $('#info-EAN_13_barcode').val(),
            JAN_barcode : $('#info-JAN_barcode').val(),
            active : $('#info-not-active').hasClass('btn-outline-danger'),
            visible : $('#info-visible').val(),
            sale_avaliable : $('#product-disp').prop('checked'),
            price_shown : $('#product-show-price').prop('checked'),
            online : $('#product-online').prop('checked'),
            condition : $('#info-condition').val(),
            short_description : $('#info-short-description').val(),
            description : $('#info-description').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'save-info'
        },
        success: function(res) {
            toastr.success('','Información actualizada correctamente');

            // Detectar si se pulsa el boton de salir

            if($(element).hasClass('exit')){
                window.location="../product-management/"
            }

            $('.product-title').html($('#info-name').val())
        },  
        error: function (xhr, errmsg, err) {
            toastr.error('', 'Error al guardar');
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
});

// Establecer precio por tarifa

$('#tariff').change(function(){
    let element = this;

    $.ajax({
        type:'POST',
        url:'/tariff-price/',
        data:{
            tariff_id: $('#tariff').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'tariff-price'
        },success:function(json){
            json = JSON.parse(json)[0]['fields'];
            console.log(json);
            $('#no-iva-mayor-price').val(json['no_iva_mayor_price']);
            $('#no-iva-sell-price').val(json['no_iva_sale_price']);
            if(json['tax_rule']){
                $('#tax-rule').val(json['tax_rule']);
            }else{
                $('#tax-rule').val(0);
            }
            $('#iva-sell-price').val(json['iva_sale_price']);
            $('#unit-price').val(json['unit_price']);

            if(json['discount-shown']){
                $('#show-discount').prop('checked');
            }
            
            if($('#no-iva-sell-price').val() != ''){
                if($('#tax-rule').val()){
                    let tax = parseInt($('#tax-rule').val()) / 100 ;
                    let iva_sell_price = parseInt($('#no-iva-sell-price').val()) + (parseInt($('#no-iva-sell-price').val()) * tax)
                    $('#iva-sell-price').val(iva_sell_price)
                    $('.final-price-iva').parent().parent().removeClass('d-none');
                    $('.final-price-iva').html(iva_sell_price+" €")
                    $('.final-price-no-iva').html($('#no-iva-sell-price').val() + " €")
                }
            }else{
                $('.final-price-iva').parent().parent().addClass('d-none');
                $('#iva-sell-price').val(' ')
    }
        }
    });

});

// Calculo de precio con impuesto

$('#no-iva-sell-price').on('keyup' ,function(e){
    if($('#no-iva-sell-price').val() != ''){
        if($('#tax-rule').val()){
            let tax = parseInt($('#tax-rule').val()) / 100 ;
            let iva_sell_price = parseInt($('#no-iva-sell-price').val()) + (parseInt($('#no-iva-sell-price').val()) * tax)
            $('#iva-sell-price').val(iva_sell_price)
            $('.final-price-iva').parent().parent().removeClass('d-none');
            $('.final-price-iva').html(iva_sell_price+" €")
            $('.final-price-no-iva').html($('#no-iva-sell-price').val() + " €")
        }
        
    }else{
        $('.final-price-iva').parent().parent().addClass('d-none');
        $('#iva-sell-price').val(' ')
    }
});

$('#tax-rule').on('change' ,function(e){
    if($('#no-iva-sell-price').val() != ''){
        if($('#tax-rule').val()){
            let tax = parseInt($('#tax-rule').val()) / 100 ;
            let iva_sell_price = parseInt($('#no-iva-sell-price').val()) + (parseInt($('#no-iva-sell-price').val()) * tax)
            $('#iva-sell-price').val(iva_sell_price)
            $('.final-price-iva').parent().parent().removeClass('d-none');
            $('.final-price-iva').html(iva_sell_price+" €")
            $('.final-price-no-iva').html($('#no-iva-sell-price').val() + " €")
        }
    }else{
        $('.final-price-iva').parent().parent().addClass('d-none');
        $('#iva-sell-price').val(' ')
    }
});

// Boton guardar de PRECIO DEL PRODUCTO 

$('.savePrice').click(function(){
    let element = this;
    // Llamada AJAX
    $.ajax({
        type: 'POST',
        url: '/save-product/',
        data: {
            tariff_id : $('#tariff').val(),
            no_iva_sell_price : $('#no-iva-sell-price').val(),
            tax_rule: $('#tax-rule').val(),
            iva_sell_price : $('#iva-sell-price').val(),
            // unit_price : $('#unit-price').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'save-product-price'
        },
        success: function(res) {
            toastr.success('','Precio actualizada correctamente');

            // Detectar si se pulsa el boton de salir

            if($(element).hasClass('exit')){
                window.location="../product-management/"
            }
        },  
        error: function (xhr, errmsg, err) {
            toastr.error('', 'Error al guardar');
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
});

// Generación de URL amigable a traves del meta-titulo

$('.generate-url').click(function(e){
    if($('#meta-title').val()){
        let friendly_url = $('#meta-title').val().split(' ').filter(part => part!='+');
        let length = friendly_url.length;
        for(let part = 0; part<length; part++){
            if(friendly_url[part]=='+'){

            }
            friendly_url[part] = friendly_url[part].toLowerCase();
        }
        $('#friendly-url').val(friendly_url.join('-'))
        $('.final-seo-url').html('https://esmovil.es/es/'+$('.product-id').val()+friendly_url.join('-')+"-"+$('#info-EAN_13_barcode').val()+".html")
    }
});

// Boton guardar de SEO

$('.saveSEO').click(function(){
    let element = this;
    // Llamada AJAX
    $.ajax({
        type:'POST',
        url: '/save-product/',
        data:{
            meta_title : $('#meta-title').val(),
            product_id: $('.product-id').val(),
            company_id: $('.company-id').val(),
            meta_description : $('#meta-desc').val(),
            friendly_url : $('.final-seo-url').html(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'save-seo'
        },
        success:function(res){
            toastr.success('','SEO actualizado correctamente')

            // Detectar si se pulsa el boton de salir

            if($(element).hasClass('exit')){
                window.location="../product-management/"
            }
        },
        error: function (xhr, errmsg, err) {
            toastr.error('', 'Error al guardar');
            console.log(xhr.status + ": " + xhr.responseText);
        }
    })
});

// Borrado de accesorios

$('.delete-accesory').click(function(e){
    let element = this;
    $(element).parent().parent().parent().remove();
    // Falta llamada a AJAX
})

// Seleccion de transportistas

$('.add-carriers').click(function(){
    $('.avaliable-carriers>span').each(function(index){
        if( $(this).attr('active') == 1){
            $('.selected-carriers').append("<span active='0' class='cursor-pointer unselect-text mb-1 d-block'>"+$(this).text()+"</span>")
        }
    });
    $('.selected-carriers>span').each(function(index){
        if( $(this).attr('active') == 1){
            $('.avaliable-carriers').append("<span active='0' class='cursor-pointer unselect-text mb-1 d-block'>"+$(this).text()+"</span>")
        }
    });
    $('.selected-carriers>span').click(function(){
        let element = this;
        if( $(element).attr('active') == 0 ){
            $(element).attr('active', 1);
            $(element).attr('style','background-color:#cc1e1e;color:#fff !important');
        }else{
            $(element).attr('active', 0);
            $(element).attr('style','');
        }
    });
    $('.avaliable-carriers>span').click(function(){
        let element = this;
        if( $(element).attr('active') == 0 ){
            $(element).attr('active', 1);
            $(element).attr('style','background-color:#009c9f;color:#fff !important');
        }else{
            $(element).attr('active', 0);
            $(element).attr('style','');
        }
    });
    $('.avaliable-carriers>span[active="1"]').remove();
});

$('.delete-carriers').click(function(){
    $('.avaliable-carriers>span').each(function(index){
        if( $(this).attr('active') == 1){
            $('.selected-carriers').append("<span active='0' class='cursor-pointer unselect-text mb-1 d-block'>"+$(this).text()+"</span>")
        }
    });
    $('.selected-carriers>span').each(function(index){
        if( $(this).attr('active') == 1){
            $('.avaliable-carriers').append("<span active='0' class='cursor-pointer unselect-text mb-1 d-block'>"+$(this).text()+"</span>")
        }
    });
    $('.avaliable-carriers>span').click(function(){
        let element = this;
        if( $(element).attr('active') == 0 ){
            $(element).attr('active', 1);
            $(element).attr('style','background-color:#009c9f;color:#fff !important');
        }else{
            $(element).attr('active', 0);
            $(element).attr('style','');
        }
    });
    $('.selected-carriers>span').click(function(){
        let element = this;
        if( $(element).attr('active') == 0 ){
            $(element).attr('active', 1);
            $(element).attr('style','background-color:#cc1e1e;color:#fff !important');
        }else{
            $(element).attr('active', 0);
            $(element).attr('style','');
        }
    });
    
    $('.selected-carriers>span[active="1"]').remove();
});



$('.avaliable-carriers>span').click(function(){
    let element = this;
    if( $(element).attr('active') == 0 ){
        $(element).attr('active', 1);
        $(element).attr('style','background-color:#009c9f;color:#fff !important');
    }else{
        $(element).attr('active', 0);
        $(element).attr('style','');
    }
});

$('.selected-carriers>span').click(function(){
    let element = this;
    if( $(element).attr('active') == 0 ){
        $(element).attr('active', 1);
        $(element).attr('style','background-color:#cc1e1e;color:#fff !important');
    }else{
        $(element).attr('active', 0);
        $(element).attr('style','');
    }
});

// Boton guardar de Transporte

$('.saveTransport').click(function(){
    $.ajax({
        type: 'POST',
        url: '/save-product/',
        data: {
            product_id: $('.product-id').val(),
            company_id: $('.company-id').val(),
            width_package : $('#width-package').val(),
            heigth_package : $('#heigth-package').val(),
            depth_package : $('#depth-package').val(),
            weight_package : $('#weigth-package').val(),
            shipment_cost : $('#shipment-cost').val(),
            // Aqui irian los transportistas en un JSON
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            action: 'save-transport'
        },
        success: function(res) {
            toastr.success('','Transporte actualizado correctamente');

            // Detectar si se pulsa el boton de salir

            if($(element).hasClass('exit')){
                window.location="../product-management/"
            }
        },  
        error: function (xhr, errmsg, err) {
            toastr.error('', 'Error al guardar');
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
});