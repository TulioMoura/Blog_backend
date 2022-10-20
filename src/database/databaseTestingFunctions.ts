import { createConnection, getConnection, getRepository } from "typeorm"; 

const db_connection = {
    async create(){
        await createConnection();
    },
    async close(){
        await getConnection().close()
   
    },
   


}
export default db_connection;