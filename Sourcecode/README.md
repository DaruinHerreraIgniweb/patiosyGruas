# INSTALACIÓN DE ENTORNO
1. Verifique que tiene la versión 18.18.2 de Node.js instalada en su computadora.
2. Seguir el paso a paso de la documentación, que pueden encontrar en la carpeta Documentation de la raiz del proyecto, seguir el paso a paso hasta el comando `firebase login`, omita el `firebase login:ci`.
3. Salte al apartado de "5. Deploying the Web App plus Server Side" y ejecute los comandos que se le indican

Este apartado indica ejecutar tres comandos: `cd SourceCode`, `yarn`, `yarn deploy` en ese orden.

*IMPORTANTE:* El comando `yarn` y `yarn deploy` debe ejecutarlos en una CMD con permisos de administrador, y dentro de la carpeta SourceCode, no los ejecute en la terminal de VSCode, ya que puede ocasionar problemas.

# POSIBLES PROBLEMAS

## Al ejecutar yarn
- Si tiene problemas al ejecutar el comando `yarn`:

    *POSIBLE ERROR 1:* Si se trata de errores de Visual Studio, Build Tools o Python, realice lo siguiente:
    - Verifique que ya tene instalado Chocolatey ejecutando `choco` o `choco -?`, si ya lo tiene, omita lo siguiente:
        - Para instalar Chocolatey, abra una Powershell con administrador y ejecute el comando:
            - `Get-ExecutionPolicy`, si devuelve `Restricted`, ejecute el comando `Set-ExecutionPolicy AllSigned` y ingrese `O` cuando se lo pida, si dice que la directiva no queda activa (error con letras rojas), utilice este otro comando `Set-ExecutionPolicy Bypass -Scope Process` y ingrese `O` cuando se pida.
        - Ahora cuando ejecute `Get-ExecutionPolicy` debe devolverle `Unrestricted`.
        - En la misma powershell con admin, ejecute `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`
        - Este ultimo comando puede llegar a retornar errores en letras rojas, ignorelos, solo necesita comprobar que Chocolatey haya quedado instalado, para comprobarlo, cierre esta CMD y abra otra nueva, y ejecute el comando `choco` o `choco -?`.

- Omita hasta este punto si ya tiene instalado Chocolatey.
- [Descargue el instalador de Visual Studio](https://visualstudio.microsoft.com/es/downloads/) en su versión de Comunidad, descargue tambien la [configuración de instalación](https://drive.google.com/file/d/1JIAxB3TytGSVz0ZrMQ2i1HDi05p5B6Yy/view?usp=sharing) e importela en el instalador de Visual Studio y haga la instalación.
- Cierre la powershell, abra una CMD con permisos de administrador, ingrese a la carpeta SourceCode y ejecute el comando `npm install -g node-gyp`
- En la misma cmd, ejecute el comando `choco install python visualstudio2017-workload-vctools -y`

*POSIBLE ERROR 2:* Si se trata de errores de timeout, este es un problema de intermitencia de la conexión a internet, donde la instalación demora más de lo esperado para resolverlo, ejecute en lugar de `yarn` el comando: `yarn install --network-timeout 1000000000` para evitar interrupciones en la instalación, recuerde ejecutarlo desde la carpeta SourceCode.

## Al ejecutar yarn deploy
- Si tiene problemas al ejecutar el comando `yarn deploy`, hay varias opciones:
    - PRIMER OPCIÓN: Existen comandos alternativos a `yarn deploy`, en si lo que se requiere es desplegar los cambios, entonces se puede utilizar los siguientes comandos:
        - Para desplegar los cambios a la web: `yarn run web:deploy`
        - Para generar el apk con los cambios para mobile: `yarn app:build-android-apk`

    Estos comandos se ejecutan desde la carpeta SourceCode.

    *IMPORTANTE:* Las apks se generan utilizando Expo, el cual ofrece una capa gratuita de 30 apks por mes, genere la APK solamente cuando este seguro, si se supera la capa gratuita, hay que crear otra cuenta de Expo y configurarla nuevamente según la documentación para tener nuevamente los 30 mensuales.

    - SEGUNDA OPCIÓN: [Contactar con soporte](https://www.exicube.com/support#:~:text=Find%20expert%20support%20for%20your%20technology), ellos pueden resolver el problema desde su panel de control, esto se ha hecho antes y la instruccón ha sido borrar la carpeta `node_modules` de SourceCode y ejecutar otra vez `yarn` y luego `yarn deploy`, y si sigue sin resolverse, se pedia ejecutar nuevamente `yarn deploy`.

## Al ejecutar yarn app:build-android-apk
- Existe un problema conocido al momento de ejecutar `yarn app:build-android-apk`, el cual muestra un error de timeout o problemas de conexión, esto es un problema de intermitencia de la conexión a internet, el error sugerira aumentar la potencia de buildeo a `large`, pero esto no se puede hacer porque hace parte del plan pago por lo que tirará otro error, la forma de solucionar esto es simplemente cerrando la CMD, abriendo otra CMD con permisos de admin y ejecutando el comando `yarn app:build-android-apk` de nuevo.

- Este comando se ejecuta desde la carpeta SourceCode.