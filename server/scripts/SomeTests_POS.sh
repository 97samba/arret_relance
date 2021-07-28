TYPE_ACTION=$1
TYPE_ENVIRONNEMENT=$2
BUILD_JENKINS_USER=$3
LOCAL_DIR=/tmp
LOG_DIR=/tmp
TIME_OUT=600
################################ VARIABLES ################################
APPLI=SomeTests
case $TYPE_ENVIRONNEMENT in 
    PROD)
        sw11203=sw11203
        localhost=localhost
        var=var
        test=test
        sw12345=sw12345
        REBOND_WIN=sw15298
        ;;
    HPROD)
        sw11203=SW11204
        localhost=definir
        var=
        test=definir
        sw12345=definir
        REBOND_WIN=sw15272
        ;;
    HPROD2)
        sw11203=definir
        localhost=definir
        var=
        test=definir
        sw12345=definir
        REBOND_WIN=sw15272
        ;;
    *)
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        echo "Type d'environnement incorrect (PROD / HPROD )"
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        exit 0
        ;;
esac
 
################################ FIN VARIABLES ################################
 
######################################## Tests ########################################
Launch_POS()
{
     
    echo " Execution des étapes POS de 0 à 2"
    CMD_WIN = "powershell .\POSTester.ps1 .\Json\SomeTests.json 0 2"
    res=$(ssh -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no -q adm-deploy@$REBOND_WIN "$CMD_WIN")
    echo " [Action Web :"$APPLI"] / OK RES("$res") " 
    echo "FIN : $(date +'%d/%m/%Y %H:%M:%S')"
    echo 
     
}
