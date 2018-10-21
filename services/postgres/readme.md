#About schema and database
Docker creates database "sipuliton" automatically
Default schema used is "public"

#About Populating DB
Running populate_parser.py in this folder coverts csv files from data and mock_data into sql files

-Format of CSV files
CSV files use single comma(,) as separator and does not parse any remaining whitespace
Quotation policy for csv data files is minimal (only fields with delimiter, quotechar or part(s) of line terminator are quoted)
For diets and groups, first column is reserved for contained other groups separated by semicolons(;)

--Mock data format
CSV files in mock_data should be of following format:
file name should be of following format: XX_TABLE.csv
XX can be a number between 00 and 99 and defines the read order of files
TABLE is the name of sql table to be populated
1st line: either empty or table field names
2nd line and forward: data in same order as defined in 1st row or in sql tables if 1st row is empty