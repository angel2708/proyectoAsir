import re
from django import template

from dashboard.models import Companies, CA, Departament

register = template.Library()

@register.simple_tag(takes_context=True)
def loadCompanies(context):
    companies = Companies.objects.raw('SELECT dashboard_companies.* FROM dashboard_companies')
    current_ca = CA.objects.get(user_id=context['request'].user.id)
    current_company = current_ca.company_id

    companies_opt=''

    for c in companies:
        if str(c.id) == str(current_company):
            companies_opt = companies_opt + '<option value="'+str(c.id)+'" selected>'+str(c.name)+'</option>'
        else:
            companies_opt = companies_opt + '<option value="'+str(c.id)+'">'+str(c.name)+'</option>'

    # for c in companies:
    #     if c.on_use:
    #         companies_opt = companies_opt + '<option value="'+str(c.id)+'" selected>'+str(c.name)+'</option>'
    #     else:
    #         companies_opt = companies_opt + '<option value="'+str(c.id)+'">'+str(c.name)+'</option>'

    return companies_opt

@register.simple_tag(takes_context=True)
def getCa(context):
    
    return CA.objects.filter(user_id=context['request'].user.id).filter(on_use=1)[0]


@register.simple_tag(takes_context=True)
def getDepartament(context):
    ca = CA.objects.filter(user_id=context['request'].user.id).filter(on_use=1)[0]
    
    return Departament.objects.filter(company_id=ca.company_id)

@register.simple_tag(takes_context=True)
def getCompanyUserId(context):
    
    return CA.objects.filter(user_id=context['request'].user.id).filter(on_use=1)[0].user_id

@register.simple_tag(takes_context=True)
def getRanking(context):     
    data = esmovil.getRanking()
    
    if data != 'error':
        result = """<li data-toggle="modal" data-target="" class="dropdown dropdown-notification nav-item" style="margin-right:1.4em; font-size:1.4em;">
                        <a href="" class="nav-link nav-link-label"><i class="fa fa-trophy" style="color:#ffbf00;"></i>
                        <span style="font-size:20px;">"""+data[0]['rep']+"""("""+data[0]['n_vendidos'].split('.')[0]+""")<span></span></span></a>
                    </li>"""

        if len(data)>1:
            result = result +"""<li data-toggle="modal" data-target="" class="dropdown dropdown-notification nav-item" style="margin-right:1.4em; font-size:1.4em;">
                        <a href="" class="nav-link nav-link-label"><i class="fa fa-trophy" style="color:#8a9597;"></i>
                        <span style="font-size:20px;">"""+data[1]['rep']+"""("""+data[1]['n_vendidos'].split('.')[0]+""")<span></span></span></a>
                    </li>"""
        if len(data)>2:
            result = result +"""<li data-toggle="modal" data-target="" class="dropdown dropdown-notification nav-item" style="margin-right:1.4em; font-size:1.4em;">
                        <a href="" class="nav-link nav-link-label"><i class="fa fa-trophy" style="color:#763c28;"></i>
                        <span style="font-size:20px;">"""+data[2]['rep']+"""("""+data[2]['n_vendidos'].split('.')[0]+""")<span></span></span></a>
                    </li>"""

        result = result +   """<li class="dropdown dropdown-notification nav-item" style="margin-right:2.2em; font-size:1.4em;"><a class="nav-link nav-link-label" href="#" data-toggle="dropdown"><i class="fa fa-trophy"></i></a>

                                <ul class="dropdown-menu dropdown-menu-media dropdown-menu-right" style="width: 318px;padding: 22px;text-align: left;">
                            """
        if len(data)>3:
            for i in range(3,len(data)):
                if data[i]['rep'] != 'Jorge Hita' and data[i]['rep'] != 'Alberto  Pichel' and data[i]['rep'] != 'Álvaro':
                    result = result + """   <li data-toggle="modal" data-target="#modalPedirPresupuesto" class="dropdown dropdown-notification nav-item" style="font-size:1.6em;margin-top: 10px;">
                                            <span style="font-size:20px;">"""+data[i]['rep']+"""("""+data[i]['n_vendidos'].split('.')[0]+""")<span>
                                            </span></span></li>
                                        """

            result = result + '</ul></li>'
        else:
            result = result + """   <li data-toggle="modal" data-target="#modalPedirPresupuesto" class="dropdown dropdown-notification nav-item" style="font-size:1.6em;margin-top: 10px;">
                                    <span style="font-size:20px;">No hay datos<span>
                                    </span></span></li>
                                """

            result = result + '</ul></li>'
    else:
        result ="""<li class="dropdown dropdown-notification nav-item" style="margin-right:2.2em; font-size:1.4em;"><a class="nav-link nav-link-label" href="#" data-toggle="dropdown"><i class="fa fa-trophy"></i></a>
                    <ul class="dropdown-menu dropdown-menu-media dropdown-menu-right" style="width: 318px;padding: 22px;text-align: left;">
                    <li data-toggle="modal" data-target="#modalPedirPresupuesto" class="dropdown dropdown-notification nav-item" style="font-size:1.6em;margin-top: 10px;">
                    <span style="font-size:20px;">No hay datos<span>
                    </span></span></li>
                    </ul></li>
                """

    return result