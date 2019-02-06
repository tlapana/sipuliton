#!/bin/bash
# Prerequisites
#  - Setup .pgpass with credentials in your home folder
#  - Install psql
#
cd services/postgres
python3 populate_parser.py

cd ../..
psql -h sipulitondb.c15ehja7hync.eu-central-1.rds.amazonaws.com  -d sipuliton -U sipulitonadmin -a -f services/postgres/aws/drop_schema.sql

for f in services/postgres/sql/*sql
do
    psql -h sipulitondb.c15ehja7hync.eu-central-1.rds.amazonaws.com  -d sipuliton -U sipulitonadmin -a -f $f
done

psql -h sipulitondb.c15ehja7hync.eu-central-1.rds.amazonaws.com  -d sipuliton -U sipulitonadmin -a -f services/postgres/aws/give_rights.sql
