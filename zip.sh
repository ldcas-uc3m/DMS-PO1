#!/bin/bash
# Bash script to zip the whole project in order to make it deriverable
# please make sure zip and texlive are installed

set -e  # exit on error

OUTFILE=../100429021_100429005_100548395_100406009_100549459.zip
[ -e $OUTFILE ] && rm $OUTFILE  # remove if exists already


# compile the report (and save it to root folder)
echo "Compiling the report..."

latexmk -cd -shell-escape -silent -pdf report/report.tex 
cp report/report.pdf $OUTFILE
