class CalculadoraController{
    constructor(){
        this._dataEl = document.querySelector(".data");
        this._horaEl = document.querySelector(".hora");
        this._listaExpressao = ["0"];
        this._displayEl = document.querySelector(".expressao");
        this._prevEl = document.querySelector(".previa");
        this._prev = 0;
        this.iniciar();
        this.initAddEventsKeyboard();
        this.initAddEventosBotoes();
        this._ifResult = false;
    }

    iniciar(){
        this.attData();
        setInterval(()=>{
            this.attData();
        },1000)
    }

    inverse(){
        if(this.verifSeOperador(this.retornaUltimo())){
            this._listaExpressao.pop()
        }
            if(this.retornaUltimo()=="0"){
                return;
            }
            this._listaExpressao[this._listaExpressao.length-1] = (1/this.retornaUltimo()).toString();
            this._ifResult = true;
            this.attDisplay()
    }

    attData(){
        let data = new Date();

        this._dataEl.innerHTML = data.toLocaleDateString("pt-BR");
        this._horaEl.innerHTML = data.toLocaleTimeString("pt-BR");
    }

    attDisplay(){
        this._displayEl.innerHTML = this._listaExpressao.join("");
        this._prevEl.innerHTML = this._prev;
        this._displayEl.scrollBy(100,0);
    }

    clear(){
        this._listaExpressao = ["0"];
        this._prev = "0";
        this.attDisplay();
    }

    apagar(){
        this._listaExpressao[this._listaExpressao.length-1] = this.retornaUltimo().slice(0,-1);
        if(this.retornaUltimo() == ""){
            if(this._listaExpressao.length == 1){
                this._listaExpressao = ["0"]
            }else{
                this._listaExpressao.pop();
            }
        }
        this.attDisplay();
    }

    error(){
        this._displayEl.innerHTML = "ERROR";
        this._prevEl.innerHTML = "";
        this._ifResult = true;
    }

    retornaUltimo(){
        return this._listaExpressao[this._listaExpressao.length-1]
    }

    verifSeOperador(val){
        return ["+","-","÷","×"].indexOf(val)>-1;
    }

    addValoresEspressao(val){
        if(this.verifSeOperador(val)){
            //se não for número
            //mandar o val para um index novo na nossa lista
            if(this.verifSeOperador(this.retornaUltimo())){
                this._listaExpressao[this._listaExpressao.length-1] = val;
            }else{
                this._listaExpressao.push(val);
            }

        }else{
            //se for número
            //adicionar o número dentro do ultimo indexx da lista
            if(this.verifSeOperador(this.retornaUltimo())){
                this._listaExpressao.push(val);
            }else{
                if(this.retornaUltimo() == "0" && val.toString() != "."){
                    this._listaExpressao[this._listaExpressao.length-1] = "";
                }
                if(this.retornaUltimo().indexOf(".")>-1 && val.toString() == "."){
                    return
                }
                this._listaExpressao[this._listaExpressao.length-1] += val.toString();
            }
        }

        this.attDisplay();
    }

    multIndexOf(arrPrincipal,arr){
        for(let i = 0; i<arrPrincipal.length; i++){
            let v = arrPrincipal[i];
            for(let i2 = 0; i2<arr.length; i2++){
                let v2 = arr[i2];
                if(v == v2){
                    return[i,v2];
                }
            }
        }
        return [-1,""]
    }

    calculate(arr){
        for(let i = 0;i < arr.length; i+=2){
            arr[i] = parseFloat(arr[i])
        }

        while(this.multIndexOf(arr,["÷","×"])[0]>-1){
            let operation = this.multIndexOf(arr,["÷","×"]); // [index, "el"]
            let result;
            switch(operation[1]){
                case "÷" :
                    result = arr[operation[0]-1]/arr[operation[0]+1]
                    break;
                case "×" :
                    result = arr[operation[0]-1]*arr[operation[0]+1]
                    break;
            }
            arr.splice(operation[0]-1,3,result);
        }
        while(this.multIndexOf(arr,["+","-"])[0]>-1){
            let operation = this.multIndexOf(arr,["+","-"]); // [index, "el"]
            let result;
            switch(operation[1]){
                case "+" :
                    result = arr[operation[0]-1]+arr[operation[0]+1]
                    break;
                case "-" :
                    result = arr[operation[0]-1]-arr[operation[0]+1]
                    break;
            }
            arr.splice(operation[0]-1,3,result);
        }
        this._ifResult = true;
        arr[0] = arr[0].toString();
        this.attDisplay();
    }
    
    calPrev(){
        let listPrev = [];
        this._listaExpressao.forEach((v)=>{
            listPrev.push(v);
        })
        this.calculate(listPrev);
        this._ifResult = false;
        if(isNaN(listPrev[0])){
            return;
        }
        this._prev = listPrev;
        this.attDisplay();
    }

    initAddEventsKeyboard(){
        document.addEventListener("keyup",(e)=>{

            switch(e.key){
                case "c":
                    this.clear();
                    //limpar tudo
                    break;
                case "Backspace":
                    if(this._ifResult == true){
                        this.clear();
                    }
                    this.apagar();
                    this.calPrev();
                    //apagar ultimo caractere
                    break;
                case "Enter":
                    //calcular valor final
                    if(this._ifResult == true){
                        return;
                    }
                    this._prev = "";
                    this.calculate(this._listaExpressao);
                    break;                   
                case "+":
                case "-":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "0":
                case ".":
                    if(this._ifResult == true){
                        this.clear();
                        this._ifResult = false;
                    }
                    this.addValoresEspressao(e.key);
                    this.calPrev();
                    //adicionar na lista da expressao
                    break; 
                case "/":
                    if(this._ifResult == true){
                        this.clear();
                        this._ifResult = false;
                    }
                    this.addValoresEspressao("÷");
                    this.calPrev();
                    break;
                case "*":
                    if(this._ifResult == true){
                        this.clear();
                        this._ifResult = false;
                    }
                    this.addValoresEspressao("×");
                    this.calPrev();
                    break;
            }
            if(isNaN(this._listaExpressao[0])){
                this.error();
            }
        })
    }

    initAddEventosBotoes(){
        let botoes = document.querySelectorAll("table.botoes td")

        botoes.forEach(botao => {
            botao.addEventListener("click",()=>{
                let valor = botao.innerHTML;

                switch(valor){
                    case "AC":
                        this.clear();
                        //limpar tudo
                        break;
                    case "backspace":
                        if(this._ifResult == true){
                            this.clear();
                        }
                        this.apagar();
                        this.calPrev();
                        //apagar ultimo caractere
                        break;
                    case "=":
                        //calcular valor final
                        if(this._ifResult == true){
                            return;
                        }
                        this._prev = "";
                        this.calculate(this._listaExpressao);
                        break;
                    case "1/x":
                        //inverter ultimo valor digitado
                        this.inverse();
                        this.calPrev();
                        break;                     
                    case "+":
                    case "-":
                    case "÷":
                    case "×":
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                    case "9":
                    case "0":
                    case ".":
                        if(this._ifResult == true){
                            this.clear();
                            this._ifResult = false;
                        }
                        this.addValoresEspressao(valor);
                        this.calPrev();
                        //adicionar na lista da expressao
                        break; 
                }
                if(isNaN(this._listaExpressao[0])){
                    this.error();
                }
            })
        });
    }
}