import {Request,Response} from 'express';
import knex from '../database/connection';

class itensController {

  async index(request: Request,resposnse: Response) {
  
    const itens = await knex('itens').select('*');
  
    const serializedItens = itens.map( item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://localhost:3000/uploads/${item.image}`
      };
    });
    
    return resposnse.json(serializedItens);
  }

}
export default itensController;