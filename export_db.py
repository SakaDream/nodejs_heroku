import os
from sys import argv
n = len(argv)

def help():
    print "Welcome to PostgreSQL database exporter!"
    print "List of arguments:"
    print "h: display help content"
    print "d: default setting (username = postgres, db = MerryChristmas, fn = export.sql)"
    print "c <username> <database> <fileName> : Custom setting"

def exportDefault():
    os.system("pg_dump -U postgres MerryChristmas > export.sql")

def exportCustom(username, database, fileName):
    os.system("pg_dump -U " + username + " " + database + " > " + fileName)

if n == 1:
    help()

if n >= 2:
    option = argv[1]
    if option == "h":
        help()
    elif option == "d":
        exportDefault()
    elif option == "c":
        if n == 2:
            print "Please add more arguments!"
        else:
            exportCustom(argv[2], argv[3], argv[4])
    else:
        print "Function not found!"