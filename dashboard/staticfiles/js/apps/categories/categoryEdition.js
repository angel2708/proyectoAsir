var active = 0;

$(".lang-form").each(function(){
    if($(this).is(':visible')){
        active = $(this).attr('lang')
    }
});

$('.lang-select').change(function(){
    $(".lang-form[lang='"+active+"']").hide();

    active = $(this).val()
    $(".lang-form[lang='"+active+"']").show();
});

$('.trigger').click(function(e) {
    e.stopPropagation();
    $(this).closest('.dir').children().not('.container').slideToggle();

    let icon = $(this).find('i');
    let atr = $(icon).attr('class');

    if(atr.includes('fa-folder-open')){
        icon.removeClass('fa-folder-open');
        icon.addClass('fa-folder');
    }else{
        icon.removeClass('fa-folder');
        icon.addClass('fa-folder-open');
    }
});

let selected_cat=$('.category-parent').val();

$('.cat-check').change(function(){
    if($(this).prop('checked')){
        selected_cat = $(this).attr('category-id');

        $('.cat-check').each(function(){
            if($(this).attr('category-id') != selected_cat)
                $(this).prop('checked',false);
        });
    }else{
        selected_cat=0;
    }
});

function branchUp(id){
    let element = $(".cat-tag[category-id='"+id+"']");
    let parent = element.attr('parent-id');
    let name = element.text();
    if(parent == 0){
        return '/'+name;
    }else{
        return branchUp(parent)+'/'+name;
    }
}

function openBranch(id){
    let parent = $(".cat-tag[category-id='"+id+"']").attr('parent-id');
    console.log(parent);

    if(parent==0){
        $(".cat-tag[category-id='"+id+"']").closest('ul').slideDown();
    }else{
        console.log('recursive');
        $(".cat-tag[category-id='"+id+"']").closest('ul').slideDown();
        openBranch(parent)
    }
}

var show = false;

$('.category-search').keyup(function(){
    let search = $('.category-search').val();
    show = false;
    $('.suggestions').empty();
    
    if(search != ''){
        $('.cat-tag').each(function(){
            if($(this).text().includes(search)){
                $('.suggestions').append('<a style="padding:7px" class="activate-category" cat-id="'+$(this).attr('category-id')+'"><i class="feather icon-chevron-right"></i>'+branchUp($(this).attr('parent-id'))+'/'+$(this).text()+'</a><br>');
                show = true;
            }
        });

        if(show){
            $('.suggestions').slideDown();
        }else{
            $('.suggestions').slideUp();
        }
    }else{
        $('.suggestions').slideUp();
    }

    $('.activate-category').click(function(){
        activateCategory($(this).attr('cat-id'));
    });
});

$('.category-search').focusout(function(){
    $('.suggestions').slideUp();
});

$('.category-search').focusin(function(){
    if($('.suggestions').html()!=''){
        $('.suggestions').slideDown();  
    }
});

$('.show-all').click(function(){
    $('ul.cat-content').slideDown();
});

$('.hide-all').click(function(){
    $('ul.cat-content').slideUp();
});

$('.save-category').click(function(){
    var lang_form = new FormData();
    let index = 1;
    let lock = false;

    $('.lang-form').each(function(){
        let container = this;
        
        if(index == 1 && $(container).find('.cat-name').val()==''){
            toastr.error('Debe completar el campo nombre en el idioma principal.', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            lock = true;
            return false;
        }else if(index == 1 && $(container).find('.cat-friendly-url').val()==''){
            toastr.error('Debe completar el campo url amigable en el idioma principal.', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-bottom-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            lock = true;
            return false;
        }

        lang_form.append('lang_'+index,$(container).attr('lang'));
        lang_form.append('name_'+index,$(container).find('.cat-name').val());
        lang_form.append('description_'+index,$(container).find('.cat-description').val());
        lang_form.append('meta_title_'+index,$(container).find('.cat-meta-title').val());
        lang_form.append('meta_description_'+index,$(container).find('.cat-meta-description').val());
        lang_form.append('meta_key_words_'+index,$(container).find('.cat-meta-key-words').val());
        lang_form.append('friendly_url_'+index,$(container).find('.cat-friendly-url').val());

        index++;
    });

    lang_form.append('lang_count',index);
    lang_form.append('parent',selected_cat);
    lang_form.append('hide',$('.hide-category').prop('checked'));
    lang_form.append('action','save_category');
    lang_form.append('category_id',$('.category-id').val());
    lang_form.append('csrfmiddlewaretoken',$('input[name=csrfmiddlewaretoken]').val());

    $.ajax({
        type: 'POST',
        url: '/category-edition/2',
        data: lang_form,
        cache: false,
        contentType: false,
        processData: false,
        success: function (json) {
            location.replace("/categories-management/"+json);
        },
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
});

$('.cat-name').keyup(function(){
    let input = $(this).val().replace('ñ','n');

    $(this).closest('.lang-form').find('.cat-friendly-url').val(input.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-'))
});

function activateCategory(id){
    let cat_id = id;

    $('ul.cat-content').slideUp();

    selected_cat = cat_id;

    $('.cat-check').each(function(){
        if($(this).attr('category-id') != selected_cat)
            $(this).prop('checked',false);
    });

    openBranch(cat_id);

    let element = $(".cat-tag[category-id='"+cat_id+"']");

    $("input[category-id='"+cat_id+"']").prop('checked',true);
}

activateCategory($('.category-parent').val());
