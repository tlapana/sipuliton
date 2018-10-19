import csv

def quote(text):
    return '"' + text + '"'

def commajoin(array, elements_to_quote, indent=0):
    result = " " * indent + "("
    for i in elements_to_quote:
        array[i] = '"' + str(array[i]) + '"'
    for i in array:
        result += str(i)
        if i != array[-1]:
            result += ", "
    return result + ")"


lang = []
foods = []
groups = []
nametemp = []

with open("sql\\06_populate.sql", 'w') as sql:
    sql.write("--this file is generated from csv files in data folder\r\n\r\n")

    sql.write("INSERT INTO languages(language_id, name, iso2, iso3) VALUES\r\n")
    with open("data\\lang.csv", 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter=",", quoting=csv.QUOTE_MINIMAL)
        i = 0
        for row in reader:
            i += 1
            if i==1:
                continue
            if row == '':
                continue
            lang.append([i-2, row[0], row[1], row[2]])
            if i > 2:
                sql.write(",\r\n");
            sql.write(commajoin([i-2, row[0], row[1], row[2]], [1,2,3], 4))
    sql.write(";\r\n\r\n");