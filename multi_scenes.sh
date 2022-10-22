#!/bin/sh

#info_arr=("0902 6" "0904 5" "0906 4" "0906 5")
#info_arr=("0911 2" "0919 1" "0919 2" "0919 3" "0919 4" "0920 1" "0920 2")
info_arr=("0923 4" "0924 5" "0927 2" "0928 4")

pt="/Users/IsamuUmetsu/dev/py_baseball"

for info in "${info_arr[@]}"
do
    dt=`echo $info | awk '{print $1}'`
    gameno=`echo $info | awk '{print $2}'`
    cmd="python3 ${pt}/game_scenes.py -ss ${dt} -se ${dt} -s ${gameno}"
    eval $cmd
done