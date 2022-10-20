
export default class BlogError extends Error{
        code:number = 500;
    constructor(message:string, code?: number){

        super(message)
        if(code){
            this.code = code
        }
    }
    
}