function ping_host($server){
    if(!(test-connection -cn $server -count 1 -quiet)){
        write-host "ko"
    }else{write-host "ok"}
}

##############"MAIN#######################
ping_host $args[0]