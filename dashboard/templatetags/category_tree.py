from django import template

register = template.Library()

def closeTree(x):
    x=x-1
    res=""
    for i in range(x):
        res=res+"</ul></li>"

    return res

@register.filter
def generateTree(cats):
    category_tree="""<ul style="padding:0px;border:solid DarkGray 1px;border-radius:5px;padding:10px">
                        <li class="dir">"""

    index = 0
    
    for  c in cats:
        index = index + 1

        if c.company_category_id == 0:
            category_tree = category_tree + '<div class="container" style="padding:0"><input type="checkbox" class="cat-check" parent-id="0" category-id="'+str(c.id)+'"><a class="trigger"> <i class="fa fa-folder"></i> <span class="cat-tag" parent-id="0" category-id="'+str(c.id)+'">Root</span></a></div>'
            category_tree = category_tree + '<ul class="cat-content" style="display:none">'
        else:
            if c.has_child == True:
                category_tree =category_tree+ '''
                                <li class="dir">
                                <div class="container" style="padding:0"><input type="checkbox" class="cat-check" parent-id="'''+str(c.parent)+'''" category-id="'''+str(c.id)+'''"><a class="trigger"> <i class="fa fa-folder"></i> <span class="cat-tag" parent-id="'''+str(c.parent)+'''" category-id="'''+str(c.id)+'''">'''+str(c.company_category_id)+'''</span></a></div>
                                <ul class="cat-content" style="display:none">
                                '''
            else:
                category_tree =category_tree+'<li><input type="checkbox" class="cat-check" parent-id="'+str(c.parent)+'" category-id="'+str(c.id)+'"> <i class="fa fa-dot-circle-o"></i> <span class="cat-tag" parent-id="'+str(c.parent)+'" category-id="'+str(c.id)+'">'+str(c.company_category_id)+'</span></li>'

            try:
                if c.level != cats[index].level and c.company_category_id != 0 and c.id != cats[index].parent:
                    if c.level > cats[index].level:
                        category_tree=category_tree+closeTree(c.level-cats[index].level+1)
                    else:
                        category_tree=category_tree+closeTree(c.level)
                elif c.position >= cats[index].position and c.company_category_id != 0 and c.id != cats[index].parent:
                    category_tree=category_tree+closeTree(c.level)
            except:
                category_tree=category_tree+closeTree(c.level)+"</ul></li>"

    category_tree=category_tree+"</ul></li></ul>"
    
    return category_tree
