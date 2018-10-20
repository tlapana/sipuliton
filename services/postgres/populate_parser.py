import csv

langs = []
foods = []
groups = []
nametemp = []
langorder = []

def quote(text):
    return '"' + text + '"'

def commajoin(array, elements_to_quote, indent=0):
    result = " " * indent + "("
    for i in elements_to_quote:
        array[i] = "'" + str(array[i]) + "'"
    for i in array:
        result += str(i)
        if i != array[-1]:
            result += ", "
    return result + ")"

def getorder(row):
    i = 0
    order = []
    for col in row:
        i += 1
        for lang in langs:
            if col == lang:
                order.append(i-1)
    if len(order) != len(langs):
        print("Either missing a language or have a duplicate\n")
    return order


with open("sql/06_populate.sql", 'w') as sql:
    sql.write("--this file is generated from csv files in data folder\n\n")

    sql.write("INSERT INTO languages(language_id, name, iso2, iso3) VALUES\n")
    with open("data/lang.csv", 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter=",", quoting=csv.QUOTE_MINIMAL)
        i = 0
        for row in reader:
            i += 1
            if i==1:
                continue
            if row == '':
                continue
            langs.append(row[2])
            if i > 2:
                sql.write(",\n");
            sql.write(commajoin([i-2, row[0], row[1], row[2]], [1,2,3], 4))
    sql.write(";\n\n");

    sql.write("INSERT INTO country(country_id, iso2, iso3) VALUES\n")
    with open("data/countries.csv", 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter=",", quoting=csv.QUOTE_MINIMAL)
        i = 0
        for row in reader:
            i += 1
            if i==1:
                langorder = getorder(row)
                continue
            if row == '':
                continue
            nametemp.append([row[x] for x in langorder])
            if i > 2:
                sql.write(",\n");
            sql.write(commajoin([i-2, row[0], row[1]], [1,2], 4))
    sql.write(";\n\n");

    sql.write("INSERT INTO country_name(country_id, language_id, name) VALUES\n")
    i = 0
    for row in nametemp:
        j = 0
        if i > 0:
            sql.write(",\n");
        for name in row:
            if j > 0:
                sql.write(",\n");
            sql.write(commajoin([i, j, name], [2], 4))
            j += 1
        i += 1

    sql.write(";\n\n");