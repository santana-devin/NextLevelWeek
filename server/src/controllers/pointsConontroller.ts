import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {
  async index (request: Request,response: Response){
    const {city, uf, itens} = request.query;

    const parsedIntens = String(itens).split(',').map(item => Number(item.trim()));

    const points = knex('points')
    .join('points_itens', 'points.id', '=', 'points_itens.points_id')
    .whereIn("points_itens.itens_id",parsedIntens)
    .where('city',String(city))
    .where('uf',String(uf))
    .distinct()
    .select('*');
//    console.log(points);
    if(points){
      return response.json(points);
    }else{
      return response.json({'message':'error'});
    }

  }


  async create (request: Request, response: Response){
  
        const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      itens
    } = request.body;

    const trx = await knex.transaction();
    const point = {
      image:'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };
        
    const ids = await trx('points').insert(point);
  
    const points_id = ids[0];
  
    const pointsItens = itens.map((itens_id:number) => {
        return {
          itens_id,
          points_id    
        }
    })
  
    await trx('points_itens').insert(pointsItens);
    
    await trx.commit();
    
    return response.json({
      id:points_id,
      ...point
    });
  
  }

  async show (request:Request, response: Response ){
    
    const { id } = request.params;

    const point = knex('points').where('id',id).first();

    if(!point){
      return response.status(400).json({message:"Point not found"});
    }

    const itens = knex('itens')
    .join('points_itens',  'itens.id', '=' ,'points_itens.itens_id')
    .where('point_itens.point_id', id);

    return response.json({
      point,
      itens
    });

  }
}

  
export default PointsController;