#!/bin/sh

info_arr=("0331 2" "0404 3" "0423 4" "0425 5" "0502 4" "0507 5" "0513 3" "0513 4" "0602 4" "0619 1" "0624 5" "0625 3" "0625 4" "0625 6" "0701 5" "0702 1" "0706 4" "0709 6" "0711 3" "0712 3" "0712 6" "0715 3" "0717 1" "0722 5" "0823 5" "0827 5" "0829 6" "0901 1" "0908 1" "0912 2" "0914 4" "0921 4" "0930 4" "1001 3")

pt="/Users/IsamuUmetsu/dev/py_baseball"

for info in "${info_arr[@]}"
do
    dt=`echo $info | awk '{print $1}'`
    gameno=`echo $info | awk '{print $2}'`
    cmd="python3 ${pt}/game_scenes.py -ss ${dt} -se ${dt} -s ${gameno}"
    eval $cmd
done