function write-line($line, $tab = 0) {

    $symbole = ""
    
    if ($tab -gt 0) {

        $symbole = "  "

        for ($i = 0 ; $i -lt $tab ; $i++) {
     
            $symbole += $symbole
        }
    }
    Add-Content -Value $symbole$line -Path $SCRIPT_DIRECTORY\$FILE_NAME
}
#Ajoute la fonction "executor" qui execute l'etape POS
function AddFunctionExecutor($step){

    write-line -line $step
}

#Ajoute la fonction "Decryptor" qui déchiffre le mot de passe
function AddFunctionDecyptor(){

}

function create-POSstep($step){

}

########### MAIN ########
