"""Converts csv/tsv files from data folders to populate queries."""
import csv, glob

def quote(text):
    """quotes given text."""
    return '"' + text + '"'

def commajoin(array, elements_to_quote, indent=0):
    """Adds indent, quotes specified elements, joins them with ',' and surrounds with parentheses."""
    result = " " * indent + "("
    for i in elements_to_quote:
        if array[i] == '':
            array[i] = "NULL"
        else:
            array[i] = "'" + str(array[i]) + "'"
    j = 0
    for i in array:
        result += str(i)
        if j != len(array) - 1:
            result += ", "
        j += 1
    return result + ")"

def getorder(columns, langs):
    """Gets what column matches which language."""
    i = 0
    order = []
    for col in columns:
        for lang in langs:
            if col == lang:
                order.append(i)
        i += 1
    if len(order) != len(langs):
        print("Either missing a language or have a duplicate\n")
    return order

def writenames(sql, names, indent=0):
    """Writes name inserts to given file."""
    i = 0
    for row in names:
        j = 0
        if i > 0:
            sql.write(",\n")
        for name in row:
            if j > 0:
                sql.write(",\n")
            sql.write(commajoin([i, j, name], [2], indent))
            j += 1
        i += 1

def write_lang_city(sql):
    """Write and read lang data"""
    langs = []
    nametemp = []
    langorder = []
    countries = []

    sql.write("INSERT INTO languages(language_id, name, iso2, iso3) VALUES\n")
    with open("data/lang.csv", 'r', encoding='utf8') as csvfile:
        reader = csv.reader(csvfile, delimiter=",", quoting=csv.QUOTE_MINIMAL)
        i = 0
        for row in reader:
            if i == 0:
                i += 1
                continue
            if row == '' or ''.join(row) == '':
                continue
            langs.append(row[2])
            if i > 1:
                sql.write(",\n")
            sql.write(commajoin([i-1, row[0], row[1], row[2]], [1, 2, 3], 4))
            i += 1
    sql.write(";\n\n")

    sql.write("INSERT INTO country(country_id, iso2, iso3) VALUES\n")
    with open("data/countries.csv", 'r', encoding='utf8') as csvfile:
        reader = csv.reader(csvfile, delimiter=",", quoting=csv.QUOTE_MINIMAL)
        i = 0
        for row in reader:
            if i == 0:
                i += 1
                langorder = getorder(row, langs)
                continue
            if row == '' or ''.join(row) == '':
                continue
            nametemp.append([row[x] for x in langorder])
            countries.append([i-1, [row[x] for x in langorder]])
            if i > 1:
                sql.write(",\n")
            sql.write(commajoin([i-1, row[0], row[1]], [1, 2], 4))
            i += 1
    sql.write(";\n\n")

    sql.write("INSERT INTO country_name(country_id, language_id, name) VALUES\n")
    writenames(sql, nametemp, 4)
    sql.write(";\n\n")

    nametemp = []
    
    sql.write("INSERT INTO city(city_id, country_id) VALUES\n")
    with open("data/towns.csv", 'r', encoding='utf8') as csvfile:
        reader = csv.reader(csvfile, delimiter=",", quoting=csv.QUOTE_MINIMAL)
        i = 0
        for row in reader:
            if i == 0:
                i += 1
                langorder = getorder(row, langs)
                continue
            if row == '' or ''.join(row) == '':
                continue
            index = 0
            for country in countries:
                if row[0] in country[1]:
                    nametemp.append([row[x] for x in langorder])
                    if i > 1:
                        sql.write(",\n")
                    sql.write(commajoin([i-1, index], [], 4))
                    break
                index += 1
            if index == len(countries):
                print("Could not find country(towns.csv): " + row[0])
            i += 1
    sql.write(";\n\n")

    sql.write("INSERT INTO city_name(city_id, language_id, name) VALUES\n")
    writenames(sql, nametemp, 4)
    sql.write(";\n\n")

    return langs

def write_groups(sql, langs):
    """Write and read food group data"""
    groups = []
    nametemp = []
    langorder = []
    sql.write("INSERT INTO food_group(food_group_id) VALUES\n")
    with open("data/groups.csv", 'r', encoding='utf8') as csvfile:
        reader = csv.reader(csvfile, delimiter=",", quoting=csv.QUOTE_MINIMAL)
        i = 0
        for row in reader:
            if i == 0:
                i += 1
                langorder = getorder(row, langs)
                continue
            if row == '' or ''.join(row) == '':
                continue
            nametemp.append([row[x] for x in langorder])
            groups.append([i-1, [x for x in row[0].split(';')]])
            if i > 1:
                sql.write(",\n")
            sql.write(commajoin([i-1], [], 4))
            i += 1
    sql.write(";\n\n")

    sql.write("INSERT INTO food_group_name(food_group_id, language_id, name) VALUES\n")
    writenames(sql, nametemp, 4)
    sql.write(";\n\n")

    sql.write("INSERT INTO food_group_groups(food_group_id, food_group_id2) VALUES\n")
    i = 0
    for group in groups:
        for inner_group in group[1]:
            index = 0
            if inner_group == [] or inner_group == '':
                continue
            for names in nametemp:
                if inner_group in names:
                    if i > 0:
                        sql.write(",\n")
                    sql.write(commajoin([group[0], index], [], 4))
                    i += 1
                    break
                index += 1
            if index == len(nametemp):
                print("Could not find food group(groups.csv): " + inner_group)
    sql.write(";\n\n")

    # save group names, they are still needed
    # inner group names are not so saving over them
    for i in range(len(groups)):
        groups[i][1] = nametemp[i]
    return groups


def write_groups_diets(sql, langs):
    """Write and read diet data"""
    groups = []
    diets = []
    nametemp = []
    langorder = []
    
    groups = write_groups(sql, langs)
    sql.write("INSERT INTO global_diet(global_diet_id, preset) VALUES\n")
    with open("data/diets.csv", 'r', encoding='utf8') as csvfile:
        reader = csv.reader(csvfile, delimiter=",", quoting=csv.QUOTE_MINIMAL)
        i = 0
        for row in reader:
            if i == 0:
                i += 1
                langorder = getorder(row, langs)
                continue
            if row == '' or ''.join(row) == '':
                continue
            nametemp.append([row[x] for x in langorder])
            diets.append([i-1, [x for x in row[0].split(';')]])
            if i > 1:
                sql.write(",\n")
            sql.write(commajoin([i-1, "TRUE"], [], 4))
            i += 1
    sql.write(";\n\n")

    sql.write("INSERT INTO global_diet_name(global_diet_id, language_id, name) VALUES\n")
    writenames(sql, nametemp, 4)
    sql.write(";\n\n")

    sql.write("INSERT INTO diet_groups(global_diet_id, food_group_id) VALUES\n")
    i = 0
    for diet in diets:
        # diet[1] contains groups names in diet
        for group in diet[1]:
            if group == [] or group == '':
                print("Diet " + str(nametemp[diet[0]]) + " doesn't have any groups, is this intended?")
                continue
            index = 0
            # earlier group[i][1] contains group names
            for food_group in groups:
                if group in food_group[1]:
                    if i > 0:
                        sql.write(",\n")
                    # index 0 of element has id
                    sql.write(commajoin([diet[0], food_group[0]], [], 4))
                    i += 1
                    break
                index += 1
            if index == len(groups):
                print("Could not find food group(diets.csv): " + group)

    sql.write(";\n\n")

def write_test_data(sql):
    """simply converts all csv files in mock data into insert statements"""
    for fname in sorted(glob.glob("mock_data/*.csv")):
        with open(fname, 'r', encoding='utf8') as csvfile:
            reader = csv.reader(csvfile, delimiter=",", quoting=csv.QUOTE_MINIMAL)
            i = 0
            for row in reader:
                if i == 0:
                    if row != '' and ''.join(row) != '':
                        sql.write("INSERT INTO " + "_".join(fname.split('_')[2:])[:-4] + commajoin(row, [], 0) + " VALUES\n")
                    else:
                        sql.write("INSERT INTO " + "_".join(fname.split('_')[2:])[:-4] + " VALUES\n")
                    i += 1
                    continue
                if row == '' or ''.join(row) == '':
                    continue
                if i > 1:
                    sql.write(",\n")
                sql.write(commajoin(row, list(range(len(row))), 4))
                i += 1
        sql.write(";\n\n")

def main():
    """Converts csv/tsv files from data folders to populate queries."""
    langs = []

    with open("sql/06_populate.sql", 'w', encoding='utf8') as sql:
        sql.write("--this file is generated from csv files in data folder\n\n")

        langs = write_lang_city(sql)
        write_groups_diets(sql, langs)

    with open("sql/07_populate_test_data.sql", 'w') as sql:
        sql.write("--this file is generated from csv files in moc_data folder\n\n")
        write_test_data(sql)

main()
