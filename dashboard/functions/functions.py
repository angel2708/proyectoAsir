def rawSerializer(cursor):
    r = [dict((cursor.description[i][0], value) for i, value in enumerate(row)) for row in cursor.fetchall()]
    return str(r).replace(": '",': "').replace("',",'",').replace(", '",', "').replace("':",'":').replace("'}",'"}').replace("{'",'{"').replace("None",'""').replace("True",'"1"').replace("False",'"0"').replace("\\xa0","")