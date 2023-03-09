import requests
from dashboard.models import DomainKey
import json

def clearWhiteSpaces(string):
    result = ''

    for c in range(len(string)):
        if string[c] != ' ':
            result = result + string[c]
        elif c < len(string):
            if string[c] != string[c+1] and string[c+1] != '"':
                result = result + string[c]

    return result


def generate_request(params):

    key = DomainKey.objects.get(pk=1).key

    if key == '0':
        url = 'http://192.168.10.5/'
    elif key == '1':
        url = 'http://80.28.211.158:8282/'

    response = requests.get(url + params)

    if response.status_code == 200:
        #return clearWhiteSpaces(response.text)
        return response


def get_replenishmentReport():
    
    params = 'django/replenishmentReport'
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def get_replenishmentReport2(year, month):
    
    params = 'django/replenishmentReport2/'+year+'/'+month
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def reload_replenishmentReport(references):
    
    params = 'django/replenishmentReport/'+references
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def getPartNumber(reference):
    
    params = 'django/partnumber/'+reference
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def get_numberInvoiceCustomer():
    
    params = 'django/invoice_number_customer'
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def get_apportionment_tphox():
    
    params = 'django/apportionmenttphox'
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def get_brands():
    
    params = 'django/brands'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_models_sat(key):
    
    params = 'django/models/'+key
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_brands_sat(key):
    
    params = 'django/brands/sat/'+key
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_partnumber_quality(key):
    key = key.replace('/','%2F')
    key = key.replace('+','')
    
    params = 'django/partnumber/quality/'+key
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_client_tariff(key, tariff):

    params = 'django/sat/product/'+key+'/'+tariff
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_stock_budget(key):
    
    params = 'django/budget/stock/'+key
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def get_client_invoices(key):
    
    params = 'django/client-invoices/'+key
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_client_invoices_media(key):
    
    params = 'django/client-invoices-media/'+key
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_invoice_articles(key):
    
    params = 'django/invoice-articles/'+key
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_invoice_articles_media(key):
    
    params = 'django/invoice-articles-media/'+key
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_obj_all(key):
    
    params = 'django/obj/com/'+key
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_obj_total():
    
    params = 'django/obj/total'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_active_clients(key):
    
    params = 'django/obj/active/'+key
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_active_clients_all(quarter, year):
    
    params = 'django/obj/acustomer/'+quarter+'/'+year
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_obj_tphox():

    params = 'django/obj/tphox/'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_obj_reds():

    params = 'django/obj/red/'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_obj_scooter():

    params = 'django/obj/scooter/'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_obj_laptop():

    params = 'django/obj/laptop/'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_obj_qcharx():

    params = 'django/obj/qcharx/'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_meeting_stock():

    params = 'django/meeting-stock'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_trademargin_list():

    params = 'django/trademargin-list'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_responsableart_list():

    params = 'django/responsableart-list'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_rmaprov_list():

    params = 'django/rmaprov-list'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_desc_list(key):

    params = 'django/desc-list/'+key
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_weekly_obs_stock():

    params = 'django/weekly-obs-stock'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_discount_group():

    params = 'django/dt2'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_tariff_discount_group(id, cost):

    params = 'django/dt2/'+id+'/'+cost
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_web_group(key):

    params = 'django/sgw/'+key
    response = generate_request(params)

    if response:
        return response

    return 'error'

def get_suppliers():

    params = 'django/supplier/xdfgh/list'
    response = generate_request(params)

    if response:
        return response

    return 'error'

def get_families():
    
    params = 'django/families'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def get_families_rr():
    
    params = 'django/subfamilies'
    response = generate_request(params)
    
    if response:
       return response

    return 'error'

def load_clients():
    params = 'django/customers'
    response = generate_request(params)
    
    if response:
        #print(response)
        return response

    return 'error'

def testingPhone(search):    
    params = 'django/partnumber/quality/tfn/'+search
    response = generate_request(params)
    
    if response:
        return response.json()

    return 'error'

def testingPart(search):    
    params = 'django/partnumber/quality/'+search
    response = generate_request(params)
    
    if response:
        return response.json()

    return 'error'

def getSuppliers():    
    params = 'django/supplier'
    response = generate_request(params)
    
    if response:
        response = response.json()

        for i in range(len(response)):
            response[i]['id_pfj']=str(int(response[i]['codigo']))

        return response

    return 'error'

def getDocuments(search):    
    if len(search) < 5:
        search = (5-len(search))*'0'+search

    print(search)

    params = 'django/supplier/'+search
    response = generate_request(params)
    
    if response:
        return response.json()

    return 'error'

def getArticles(search):    
    params = 'django/supplier/art/'+search
    response = generate_request(params)
    
    if response:
        return response.json()

    return 'error'

def get_refunds():    
    params = 'django/warehouse/get_refunds'
    response = generate_request(params)
    
    if response:
        return response.json()

    return 'error'

def customer_management(data):
#    params = 'django/customermanagement/'+data
#    response = generate_request(params)
#    
#    if response:
#        return response
#
    return 'error'
    
def get_order_reception(key):

    params = 'django/reception/doc/'+key
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'


def get_customer_adn():
    params = 'django/customers'
    response = generate_request(params)
    
    if response:
        #print(response)
        return response
        
def getRanking():
    params = 'django/ranking'
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def getPackagingList():
    params = 'django/get-packaging-list'
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def getOrderLines(id_fcab):
    params = 'django/get-order-lines/'+id_fcab
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def getNextArticle(id_fcab):
    params = 'django/get-next-article/'+id_fcab
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def searchSeries(id_flin, search):
    params = 'django/search-series/'+id_flin+'/'+search
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def loadOrderNumbers():
    params = 'django/reception/nacional'
    response = generate_request(params)
    
    if response:
       return json.dumps(response.json())

    return 'error'

def getArtResponsible(key):

    params = 'django/responsable/'+key
    response = generate_request(params)
    
    if response:
       return response.json()

    return 'error'

def getSalesReport(reference, description, s_date, e_date, commercial, subfamily):
    # commercial="5232"
    params = f'django/report/sales/{commercial}/{s_date}/{e_date}/{reference}/{description}/{subfamily}'
    print(params)
    response = generate_request(params)

    if response:
       return response.json()

    return 'error'

def getSalesReportClient(reference, description, s_date, e_date, commercial, subfamily):
    # commercial="5232"
    params = f'django/report/customersales/{commercial}/{s_date}/{e_date}/{reference}/{description}/{subfamily}'
    print(params)
    response = generate_request(params)

    if response:
       return response.json()

    return 'error'

def getSubfamilies(family):
    params = 'django/subfamilies/'+family
    response = generate_request(params)

    if response:
       return response

    return 'error'

def webService(key):
    params = 'django/webservice/megasur/'+key
    response = generate_request(params)

    if response:
       return response

    return 'error'

def webServiceStock(reference):
    params = 'django/webservice/megasur/stock/'+reference
    response = generate_request(params)

    if response:
       return response

    return 'error'

def webServicePrice(reference):
    params = 'django/webservice/megasur/price/'+reference
    response = generate_request(params)

    if response:
       return response

    return 'error'

def getSalesIntrastat(start, finish):
    params = f'django/intrastat/sales/{start}/{finish}'
    response = generate_request(params)

    if response:
        return response

    return 'error'

def getPurchasesIntrastat(start, finish):
    params = f'django/intrastat/purchases/{start}/{finish}'
    response = generate_request(params)

    if response:
        return response

    return 'error'

def getRecievePending(date):
    params = f'django/recieve-pending/{date}'
    response = generate_request(params)

    if response:
        return response
    
def getPendingPaymentsClients(key = "0",key2 = "0"):
    if key == "0":
        params = 'django/get-pending-payments-all'
    else:
        params = 'django/get-pending-payments/'+key+'/'+key2

    response = generate_request(params)

    if response:
       return response
    return 'error'

def getNewBooking(id_flin, newBooking):
    params = f'django/recieve-pending/new-booking/{id_flin}/{newBooking}'
    response = generate_request(params)

    if response:
        return response

    return 'error'

def getOrderAdn(ref):
    params = f'django/order-adn/{ref}'
    response = generate_request(params)

    if response:
        return response

    return 'error'

def getOrderAndFac(ref):
    params = f'django/order-adn-fac/{ref}'
    response = generate_request(params)

    if response:
        return response

    return 'error'